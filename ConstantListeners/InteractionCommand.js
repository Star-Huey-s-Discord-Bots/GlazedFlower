// This is a common translator for interaction command
// It'll convert interaction into a Pistil Command Body

const { Events, ApplicationCommandOptionType: OptionType } = require("discord.js");

const fs   = require("node:fs"),
      path = require("node:path");

const Pistil = require("../Modules/Pistil.js");

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

const convertArgumentType = async (itr, requiredArgument) => {
    // Gets raw argument from API
    var option = itr.options.get(requiredArgument.key);
    // If not exist, return its default value
    if (!option) return requiredArgument.default;

    // I'll turn it into object instead of raw string 
    switch (option.type) {

    case OptionType.User:
        var userId = option.value;

        var member = itr.guild.members.cache.get(userId);

        if (!member) return undefined;

        // I need "user" more often, but still need to store "member"
        // A circular structure
        var user = await member.user.fetch();
        user.member = member;
        
        return user;

    case OptionType.Channel:
        var channelId = option.value;

        var channel = itr.guild.channels.cache.get(channelId);

        if (!channel) return undefined;

        return channel;

    case OptionType.Role:
        var roleId = option.value;

        var role = itr.guild.roles.cache.get(roleId);

        if (!role) return undefined;

        return role;

    case OptionType.Integer:
    case OptionType.String:
    case OptionType.Boolean:
        // These are converted by default
        return option.value;

    default:
        throw new Error("Command type invalid");

    }
}

async function handle(itr) {
    // Check if it's command!
    if (!itr.isCommand()) return;
    // Make a body based on the interaction object
    var body = itr;

    // Convert subcommand
    body.subcommandName = itr.options
        .getSubcommand(false /* not required */);

    // Some addon functions
    body.xDeferReply = () => body.deferReply({ ephemeral: true });
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
    body.isMessage = () => false;
    
    // Find the matched command handler
    const cmd = commands.find(c => {
        // If it has subcommand
        if (c.name.includes(" ")) {
            let [ cmdName, scmdName ] = c.name.split(" ");
            return  cmdName == body.   commandName
                && scmdName == body.subcommandName;
        }
        else {
            return c.name == body.commandName;
        }
    });
    // Check if there's anything matched
    if (!cmd) return;

    // Store the arguments
    body.arguments = new Object();
    for (let a of cmd.arguments)
        body.arguments[a.key] = await convertArgumentType(itr, a);

    // Handle it & catch errors
    return await cmd.handle(body).catch(err => {
        if (Pistil.safe) 
            console.error(err);
        else
            throw err;
    });
}

module.exports = { event: Events.InteractionCreate, handle };