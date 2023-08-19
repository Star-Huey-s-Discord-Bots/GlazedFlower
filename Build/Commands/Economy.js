const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("coins")
        .setDescription("Show how rich the user is.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user, leave empty for yourself.")
            .setRequired(false)    
        )
    ,
    new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Get money every day. There is a bonus for continuous daily sign-up.")
    ,
    new SlashCommandBuilder()
        .setName("give")
        .setDescription("Give some coins to another user.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user.")
            .setRequired(true)    
        )
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("How much to give.")
            .setRequired(true)
        )
    ,
    new SlashCommandBuilder()
        .setName("rob")
        .setDescription("Rob another user. Success rate: 25%, otherwise you will be fined.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user.")
            .setRequired(true)    
        )
];