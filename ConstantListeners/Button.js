// This is a common translator for buttons
// It'll convert message into a Pistil Button Body

const { Events } = require("discord.js");

const fs   = require("node:fs"),
      path = require("node:path");

const Pistil = require("../Modules/Pistil");

// Define a special error I used to distinguish whether the errors are fatal
class SlightError extends Error {
    constructor (message = "Unknown") {
        super (message);
        this.name = "SlightError";
    }
}

// Read the buttons files and store them in "buttons" array
var buttons = new Array();

fs.readdirSync("./Functions/").forEach((folder) => {
    var buttonFolderPath = path.join("./Functions/", folder, "/Buttons/");
    if (!fs.existsSync(buttonFolderPath)) return;

    var files = fs.readdirSync(buttonFolderPath);
    files.forEach((file) => {
        var btn = require(path.resolve(buttonFolderPath, file));
        buttons.push(btn);
    });
});


const convertArgumentType = async (itr, receivedString, requiredType) => {
    let str = receivedString, type = requiredType;

    switch (type) {

    case "user":
        var userId = str.slice(2, -1); // remove the <@...> prefix and suffix
        var member = itr.guild.members.cache.get(userId);

        if (!member) return undefined;

        // I need "user" more often, but still need to store "member"
        // A circular structure
        var user = await member.user.fetch();
        user.member = member;
        return user;

    case "integer":
        if (isNaN(str)) 
            throw new SlightError("Integer option is NaN");
        return parseInt(str);

    case "float":
        if (isNaN(str)) 
            throw new SlightError("Integer option is NaN");
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
        throw new Error("Command type invalid");

    }
}

async function handle(itr) {
    // Check if it's button!
    if (!itr.isButton()) return;
    // Make a body based on the interaction object
    var body = itr;

    // Some addon functions
    body.xReply = async (options) => {
        if (!options) return;

        if (options instanceof Object)
            await body.reply(Object.assign({ ephemeral: true }, options));
        else
            await body.reply({ content: options, ephemeral: true });
    }
    body.xFollowUp = async (options) => {
        if (!options) return;

        if (options instanceof Object)
            await body.followUp(Object.assign({ ephemeral: true }, options));
        else
            await body.followUp({ content: options, ephemeral: true });
    }

    // Split the arguments
    let receivedArguments = itr.customId
        .split("_");

    // Find the matched button handler
    const btn = buttons.find(b => {
        // If it has sub...button? Whatever it is...
        if (b.name.includes("_")) {
            let [ btnName, sbtnName ] = b.name.split("_");
            return  btnName == receivedArguments[0]
                && sbtnName == receivedArguments[1];
        }
        else {
            return b.name == receivedArguments[0];
        }
    });
    // Check if there's anything matched
    if (!btn) return;

    // Add buttonName to body and delete it from arguments list
    body.buttonName = receivedArguments[0];
    receivedArguments.splice(0, 1);

    // If there's subbutton, do it again
    if (btn.name.includes("_")) {
        body.subbuttonName = receivedArguments[0];
        receivedArguments.splice(0, 1);
    }

    // Store the arguments
    body.arguments = new Object();
    for (let [ i, a ] of btn.arguments.entries())
        body.arguments[a.key] = await convertArgumentType(
            itr, 
            receivedArguments[i],
            a.type
        ).catch(err => {
            if (err instanceof SlightError)
                return;
            else if (Pistil.safe) 
                console.error(err);
            else
                throw err;
        });

    // Handle it & catch errors
    return await btn.handle(body).catch(err => {
        if (Pistil.safe) 
            console.error(err);
        else
            throw err;
    });
}

module.exports = {
    event: Events.InteractionCreate,
    handle
};