const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("reminder")
        .setDescription("Remind System.")
        .addSubcommand(subcommand => subcommand 
            .setName("add")    
            .setDescription("Send a message at specific time (and loop!)")
            .addStringOption(option => option
                .setName("content")
                .setDescription("The message to send.")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("time")
                .setDescription("The time to send message, ex: \"2023-04-18 02:20\".")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("loop-delay")
                .setDescription("The loop delay between each time I send message.")
                .setRequired(false)
            )
        )
];