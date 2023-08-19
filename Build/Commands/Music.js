const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join the voice channel you connected.")
    ,
    new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave voice channel.")
    ,
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play track from Soundcloud URL.")
        .addStringOption(option => option
            .setName("url")
            .setDescription("The URL of a Soundcloud track.")
            .setRequired(true)
        )
    ,
    new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop playing.")
    ,
    new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause track, use /resume to unpause.")
    ,
    new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Unpause track.")
    ,
    new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change volume.")
        .addIntegerOption(option => option
            .setName("value")
            .setDescription("Min 0, max 200")
            .setRequired(true)
        )
];