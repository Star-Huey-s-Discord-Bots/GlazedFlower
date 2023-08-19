const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("abalone")
        .setDescription("Play abalone board game with your friend.")
        .addUserOption(option => option
            .setName("opponent")
            .setDescription("Your opponent.")
            .setRequired(true)
        )
    ,
    new SlashCommandBuilder()
        .setName("guess-number")
        .setDescription("Bets some coins and play guess-number game.")
        .addIntegerOption(option => option
            .setName("bet")
            .setDescription("Your bet, max 400% payout.")
            .setRequired(true)
        )
    ,
    new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Bets some coins and play russia roulette game.")
        .addIntegerOption(option => option
            .setName("bet")
            .setDescription("Your bet, max 400% payout.")
            .setRequired(true)
        )
    ,
    new SlashCommandBuilder()
        .setName("rock-paper-scissors-lizard-spock")
        .setDescription("A game of chance that expands the traditional game of Rock-Paper-Scissors.")
        .addUserOption(option => option
            .setName("opponent")
            .setDescription("Your opponent.")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("bet")
            .setDescription("Your bet.")
            .setRequired(true)
        )
    ,
    new SlashCommandBuilder()
        .setName("yablon")
        .setDescription("A poker game, max 1100% payout.")
        .addIntegerOption(option => option
            .setName("bet")
            .setDescription("Your bet.")
            .setRequired(true)
        )
];