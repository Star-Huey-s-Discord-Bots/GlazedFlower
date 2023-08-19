// This is a common translator for message command
// It'll convert message into a Pistil Command Body

const { Events } = require("discord.js");

const fs   = require("node:fs"),
      path = require("node:path");

const Pistil = require("../Modules/Pistil.js");

// Define a special error I used to distingush whether the errors are fatal
class SlightError extends Error {
    constructor (message = "Unknown") {
        super (message);
        this.name = "SlightError";
    }
}

// Read the commands files and store them in "commands" array
var commands = new Array();

fs.readdirSync("./Functions/").forEach((folder) => {
    var commandFolderPath = path.join("./Functions/", folder, "/Commands/");
    if (!fs.existsSync(commandFolderPath)) return;

    var files = fs.readdirSync(commandFolderPath);
    files.forEach((file) => {
        var cmd = require(path.resolve(commandFolderPath, file));

        // Check if it's empty
        if (cmd.handle !== undefined)
            commands.push(cmd);
    });
});

const convertArgumentType = async (msg, receivedString, requiredArgument) => {
    let str = receivedString, type = requiredArgument.type;
    
    switch (type) {

    case "user":
        var userId;
        if (!isNaN(str))
            userId = str;
        else
            userId = str.slice(2, -1); // remove the <@ ... > prefix and suffix

        var member = msg.mentions.members.get(userId);

        if (!member) throw new SlightError("Cannot find the user");

        // I need "user" more often, but still need to store "member"
        // A circular structure
        var user = await member.user.fetch();
        user.member = member;
        
        return user;

    case "channel":
        var channelId;
        if (!isNaN(str))
            channelId = str;
        else
            channelId = str.slice(2, -1); // remove the <# ... > prefix and suffix

        var channel = msg.guild.channels.cache.get(channelId);

        if (!channel) throw new SlightError("Cannot find the channel");

        return channel;

    case "role":
        var roleId;
        if (!isNaN(str))
            roleId = str;
        else
            roleId = str.slice(3, -1); // remove the <@& ... > prefix and suffix

        var role = msg.guild.roles.cache.get(roleId);

        if (!role) throw new SlightError("Cannot find the role");

        return role;

    case "integer":
        if (isNaN(str)) 
            throw new SlightError("A integer argument could not be parsed");
        return parseInt(str);

    case "float":
        if (isNaN(str)) 
            throw new SlightError("A float argument could not be parsed");
        return parseFloat(str);

    case "string":
        return str;

    case "bool":
        // Somehow a lot XD
        return !(
            [ "false", "no", "0", "never", "nope", "none", "null", "undefined", "x" ]
                .includes(str.toLowerCase())
        );

    default:
        throw new TypeError("Command type invalid");

    }
}


// Special split function I used for the prefixed commands
// to allow spaces in arguments
// "..commandName subcommandName arg1 [arg2 with spaces] arg3 arg4"
const customSplit = function (str) {
    // Either half or full width are allowed
    var arr    = str.split(/\u0020|\u3000/g);
    var result = new Array();

    var inside = false, lastLeft = -1;
    for (let [ i, str ] of arr.entries()) {
        let isLeft = false, isRight = false;
        if (str.startsWith("[")) isLeft = true;
        if (str.endsWith("]")) isRight = true;

        if (isLeft && isRight) {
            result.push(str.slice(1, -1));
            continue;
        }
        if (isLeft) {
            if (inside) throw new SlightError("Invalid left bracket", true);
            lastLeft = i, inside = true;
            continue;
        }
        if (isRight) {
            if (!inside) throw new SlightError("Invalid right bracket", true);
            result.push(
                arr
                    .slice(lastLeft, i + 1)
                    .join(" ")
                    .replace("[", "")
                    .replace("]", "")
            );
            inside = false;
            continue;
        }
        if (!inside)
            result.push(str.trim() /* remove spaces */);
    }

    // Filter the empty ones!
    result = result.filter(s => s != "");
    return result;
}

async function handle(msg) {
    // Do some check...
    if (Pistil.beta && !Pistil.developers.includes(msg.author.id)) return;
    if (!msg.member) return;
    if (msg.member.user.bot || msg.member.user.system) return;
    if (!msg.content.startsWith(Pistil.commandPrefix)) return;

    // Make a body based on the message object
    var body = msg;

    // The user is the author of the message
    body.user        = body.author;
    body.user.member = body.member;

    // Some addon functions
    body.deferReply  = async () => {
        if (body.channel)
            await body.channel.sendTyping();
    };
    body.xDeferReply = async () => {};
    body.xReply      = body.reply;
    body.followUp    = body.reply;
    body.xFollowUp   = body.reply;
    body.isMessage   = () => true;

    // Split the arguments
    let receivedArguments = customSplit(msg.content.slice(Pistil.commandPrefix.length));
    
    // Find the matched command handler
    const cmd = commands.find(c => {
        // If it has subcommand
        if (c.name.includes(" ")) {
            let [ cmdName, scmdName ] = c.name.split(" ");
            return  cmdName == receivedArguments[0]
                && scmdName == receivedArguments[1];
        }
        else {
            return c.name == receivedArguments[0];
        }
    });
    // Check if there's anything matched
    if (!cmd) return;
    
    // Add commandName to body and delete it from arguments list
    body.commandName = receivedArguments[0];
    receivedArguments.splice(0, 1);

    // If there's subcommand, do it again
    if (cmd.name.includes(" ")) {
        body.subcommandName = receivedArguments[0];
        receivedArguments.splice(0, 1);
    }

    // Store the arguments
    body.arguments = new Object();
    // Note: Make sure that each case will report error or store argument value!
    for (let [ i, a ] of cmd.arguments.entries()) {
        // This argument is given
        if (receivedArguments[i]) {
            // Choices are restricted
            if (a.choices)  {
                if (receivedArguments[i] in a.choices) {
                    // Convert to the corresponding value
                    body.arguments[a.key] = a.choices[receivedArguments[i]];
                }
                else {
                    msg.reply("Command arguments out of given choices.");
                    return;
                }
            }
            // Choices are not restricted
            else {
                // Convert it
                try {
                    body.arguments[a.key] = await convertArgumentType(
                        msg, 
                        receivedArguments[i],
                        a
                    );
                }
                catch (err)  {
                    if (err instanceof SlightError) {
                        msg.reply(err.message + ".");
                        return;
                    }
                    else if (Pistil.safe) {
                        console.error(err);
                        return;
                    }
                    else
                        throw err;
                }
            }
        }
        // Not given
        else {
            if (a.required) {
                msg.reply("Too few arguments.");
                return;
            }
            else {
                // Has default value
                // Note that the default value could be 0 or false, so use strict-equals  
                if (a.default !== undefined) {
                    // Use default
                    body.arguments[a.key] = a.default;
                }
                else {
                    body.arguments[a.key] = null;
                }
            }
        }
    }

    // Handle it & catch errors
    return await cmd.handle(body).catch(err => {
        if (Pistil.safe) 
            console.error(err);
        else
            throw err;
    });
}

module.exports = {
    event: Events.MessageCreate,
    handle
}