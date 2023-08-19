const { REST, Routes } = require("discord.js");

const fs   = require("node:fs"),
      path = require("node:path");

const $      = require("../Modules/Logger.js");
const Pistil = require("../Modules/Pistil.js");

(async () => {
    var commands = new Array();

    var files = fs.readdirSync(path.resolve(__dirname, "./Commands"));
    files.forEach((file) => {
        var loadedCommands = require(path.resolve(__dirname, "./Commands", file));
        commands = commands.concat(loadedCommands);
    });

    const rest = new REST({ version: "10" })
        .setToken(Pistil.bot.token);

    try {
        await rest.put(Routes.applicationCommands(Pistil.bot.app), { body: commands });
        $(`Reloaded &b${commands.length}&r application commands`);
    } 
    catch (err) {
        throw err;
    }
})();