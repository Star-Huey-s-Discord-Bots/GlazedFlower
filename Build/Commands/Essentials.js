const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("info")
        .setDescription("Show help.")
    ,
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Show bot ping value.")
];