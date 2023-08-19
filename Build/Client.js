const { Client, GatewayIntentBits: Intents, Partials } = require("discord.js");

const fs   = require("node:fs"),
      path = require("node:path");

const Pistil = require("../Modules/Pistil.js");

const { Clock } = require("../Modules/Timer");
const $ = require("../Modules/Logger");

const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.GuildMembers,
        Intents.GuildIntegrations,
        Intents.GuildMessageReactions,
        Intents.GuildEmojisAndStickers,
        Intents.MessageContent,
        Intents.GuildVoiceStates,
        Intents.GuildMessageTyping,
        Intents.GuildWebhooks,
        Intents.GuildPresences,
        Intents.GuildModeration
    ],
    partials: [
        Partials.Message, 
        Partials.Channel, 
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.GuildMember,
        Partials.User
    ]
});

client.audios = new Array();
client.clock  = new Clock().start();

fs.readdir("./ConstantListeners", (err, files) => {
    if (err) throw err;

    let listnersCounter = 0;
    files.forEach((file) => {
        if ((path.extname(file) != ".js") || file.endsWith(".old.js")) return; // Invalid file type
        
        var listener = require(path.resolve("./ConstantListeners/", file));

        if (!listener) return; // No parsable listener

        client.addListener(listener.event, listener.handle);

        listnersCounter++;
    });

    $(`Added &b${listnersCounter}&r event listeners`);
});

client.login(Pistil.bot.token);

global.client = client;

void require("./ClientBuilders/LoadFunctionListeners.js");

// void require("../Hacks/General.js");

module.exports = client;