const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("scoreboard")
        .setDescription("Create a simple scoreboard with add & remove buttons")
        .addIntegerOption(option => option
            .setName("color")
            .setDescription("The color of the scoreboard.")
            .setRequired(true)
            .addChoices(
                { name: "red",    value: 0 },
                { name: "yellow", value: 0 },
                { name: "green",  value: 0 },
                { name: "blue",   value: 0 },
                { name: "purple", value: 0 }
            )
        )
        .addIntegerOption(option => option
            .setName("default-value")
            .setDescription("The default value of the scoreboard.")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("content")
            .setDescription("The message content of the scoreboard.")
            .setRequired(false)
        )
];