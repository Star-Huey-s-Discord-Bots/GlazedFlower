const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    new SlashCommandBuilder()
        .setName("custom-response")
        .setDescription("Learn to give responses to keyword.")
        .addSubcommand(subcommand => subcommand
            .setName("add-react")
            .setDescription("Learn to react to specific keyword.")
            .addStringOption(option => option
                .setName("keyword")
                .setDescription("The keyword to detect.")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("emoji")
                .setDescription("The emoji to react.")
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName("strict")
                .setDescription("Whether the entire sentence must match.")
                .setRequired(false)
                .addChoices(
                    { name: "yes", value: 1 },
                    { name: "no",  value: 0 },
                )
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("add-reply")
            .setDescription("Learn to react to specific keyword.")
            .addStringOption(option => option
                .setName("keyword")
                .setDescription("The keyword to detect.")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("response")
                .setDescription("The response to send.")
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName("strict")
                .setDescription("Whether the entire sentence must match. (default: yes)")
                .setRequired(false)
                .addChoices(
                    { name: "yes", value: 1 },
                    { name: "no",  value: 0 },
                )
            )
            .addIntegerOption(option => option
                .setName("type")
                .setDescription("Response type. (default: normal reply)")
                .setRequired(false)
                .addChoices(
                    { name: "normal",   value: 0 },
                    { name: "not-ping", value: 1 },
                    { name: "channel",  value: 2 }
                )
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("forget-keyword")
            .setDescription("Forget all the responses / reactions to the keyword.")
            .addStringOption(option => option
                .setName("keyword")
                .setDescription("The keyword to forget.")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("type")
                .setDescription("The type. (default: both)")
                .setRequired(true)
                .addChoices(
                    { name: "both",  value: "both" },
                    { name: "react", value: "react" },
                    { name: "reply", value: "reply" }
                )
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("forget-specific")
            .setDescription("Forget a specific response or reaction based on its index in \"/learn-system list\" command.")
            .addStringOption(option => option
                .setName("type")
                .setDescription("Which type.")
                .setRequired(true)
                .addChoices(
                    { name: "reply", value: "reply" },
                    { name: "react", value: "react" },
                )
            )
            .addIntegerOption(option => option
                .setName("index")
                .setDescription("The index of the response to forget.")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("list")
            .setDescription("List exsisting keyword.")
            .addStringOption(option => option
                .setName("type")
                .setDescription("Which type.")
                .addChoices(
                    { name: "reply", value: "reply" },
                    { name: "react", value: "react" },
                )
                .setRequired(true)
            )
        )
]