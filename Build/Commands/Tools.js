const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("calculate")
        .setDescription("Math. + - * / % ( )")
        .addStringOption(option => option
            .setName("content")
            .setDescription("Ex: 3 - (25 - 2 * 5)")
            .setRequired(true)
        )
    ,
    new SlashCommandBuilder()
        .setName("scheduler")
        .setDescription("Scheduler System.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user.")
            .setRequired(true)    
        )
    ,
    new SlashCommandBuilder()
        .setName("sweet-message")
        .setDescription("Generate a random sweet message.")
    ,
    new SlashCommandBuilder()
        .setName("choose")
        .setDescription("Choose an item from the given list.")
        .addStringOption(option => option
            .setName("items")
            .setDescription("The item list.")
            .setRequired(true)    
        )
    ,
    new SlashCommandBuilder()
        .setName("impersonate")
        .setDescription("Pretend someone and say something.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user you want to impersonate.")
            .setRequired(true)    
        )
        .addStringOption(option => option
            .setName("content")
            .setDescription("The content you want to falsify.")
            .setRequired(true)    
        )
    ,
    new SlashCommandBuilder()
        .setName("encrypt")
        .setDescription("Encript some secret text.")
        .addStringOption(option => option
            .setName("content")
            .setDescription("The content you want encrypt.")
            .setRequired(true)    
        )
        .addStringOption(option => option
            .setName("token")
            .setDescription("Your secret token.")
            .setRequired(true)    
        )
    ,
    new SlashCommandBuilder()
        .setName("decrypt")
        .setDescription("Decript some secret text.")
        .addStringOption(option => option
            .setName("content")
            .setDescription("The content you want encrypt.")
            .setRequired(true)    
        )
        .addStringOption(option => option
            .setName("token")
            .setDescription("Your secret token.")
            .setRequired(true)    
        )
];