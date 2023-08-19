const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("quiz")
        .setDescription("Give a question for everyone to answer.")
        .addStringOption(option => option
            .setName("question")
            .setDescription("Ex: What is my favorite fruit?")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("correct-answer")
            .setDescription("The index of the correct answer")
            .setRequired(true)
            .addChoices(
                { name: "answer-1", value: 1 },
                { name: "answer-2", value: 2 },
                { name: "answer-3", value: 3 },
                { name: "answer-4", value: 4 }
            )
        )
        .addStringOption(option => option
            .setName("answer-1")
            .setDescription("The answer 1.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("answer-2")
            .setDescription("The answer 2.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("answer-3")
            .setDescription("The answer 3.")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("answer-4")
            .setDescription("The answer 4.")
            .setRequired(false)
        )
];