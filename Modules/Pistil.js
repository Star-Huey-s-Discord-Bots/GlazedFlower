/*==============================*\
||                              ||
||            Pistil            ||
||            ᵇⁱˢⁱᵗᴵ            ||
||                              ||
||      Glazed Flower Core      ||
||        Made by Huey☆☆       ||
||                              ||
||                              ||
\*==============================*/

require("dotenv").config();

const { VERSION, BETA, SAFE, BOT_ID, APP_ID, TOKEN, PREFIX } = process.env;

const { ActivityType } = require("discord.js");

const fs  = require("node:fs");
const fse = require("fs-extra");

const $ = require("./Logger");

class PistilError extends Error {
    constructor (message = "Unknown") {
        super (message);

        this.name = "PistilError";
    }
}

// Addons
String.prototype.short = function stringShort(n = 15) {
    return this.length > n ? this.slice(0, Math.max(0, n - 3)) + "..." : this;
}

// Main Core
module.exports = class Pistil {
    // Test mode
    static beta = BETA;
    static safe = SAFE;

    // Can use hacks
    static vips = [
        "845923211127947274", // 晴☆
        "880102161881632869", // 鏡♡
    ];
    static developers = [
        "736831360664207392", // 海之音
        "752472292780539934", // 恣言語
        "822145956756586507", // 佑佑
    ].concat(this.vips);

    static version = VERSION;

    // Bot data
    static bot = class PistilBotData {
        static id = BOT_ID;
        static defaultNickname = `琉花測試機 - v${VERSION}`;
        static token = TOKEN;
        static app = APP_ID;
        static presence = {
            status: "idle",
            activities: [{
                name: "開發系統", 
                type: ActivityType.Streaming, 
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            }]
        }
    }

    // Command prefix for message commands
    static commandPrefix = PREFIX;

    /** @deprecated Split token for buttons, a random unicode string */
    static splitToken = "\u0147\u2580\u7284";

    // Common command logger
    static commandLog(body, modifier) {
        return $(`&n@${body.user.tag}&r used `
               + `&9${body.isMessage() ? this.commandPrefix : "/"}${body.commandName}&r ` 
               + `in &n#${body.channel.name}&r - &n${body.guild.name}`
               + (modifier ? "&r, " + modifier : ""));
    }

    // Check Permission
    static checkPermissions(channel, permissions = 0) {
        if (!channel) throw new PistilError("No channel to check permissions");
        if (channel.isThread()) channel = channel.parent;

        var cliMember;
        if (channel.isVoiceBased())
            cliMember = channel.guild.members.cache
                .get(this.bot.id);
        else
            cliMember = channel.members
                .get(this.bot.id);
        if (!cliMember) return undefined;

        return cliMember.permissionsIn(channel).has(permissions);
    }

    // Server file system
    static server = class PistilServerDataManager {
        static check(guildId) {
            var exists = fs.existsSync(`./ServersData/${guildId}/`)
            if (!exists) {
                fse.copySync(
                    "./ServersData/Template/", 
                    `./ServersData/${guildId}/`
                );
                fs.unlinkSync(`./ServersData/${guildId}/Users/Template.json`);
            }
            return exists;
        }

        static load(guildId) {
            this.check(guildId);
        
            var serverData = JSON.parse(
                fs.readFileSync(`./ServersData/${guildId}/Data.json`)
            );
            return serverData;
        }

        static save(guildId, serverData) {
            fs.writeFileSync(
                `./ServersData/${guildId}/Data.json`,
                JSON.stringify(serverData, null, 4)
            );
            return serverData;
        }

        static forEach(callback = (server) => { return server; }) {
            var servers = fs.readdirSync("./ServersData/").filter(s => s != "Template");
            servers.forEach(srv => {
                var serverData = JSON.parse(
                    fs.readFileSync(`./ServersData/${srv}/Data.json`)
                );
                
                serverData = callback(serverData);

                fs.writeFileSync(
                    `./ServersData/${srv}/Data.json`,
                    JSON.stringify(serverData, null, 4)
                );
            });
        }
    }

    // User files system
    static idv = class PistilIndividualDataManager {
        static check(guildId, indivisualId) {
            var idvPath = `./ServersData/${guildId}/Users/${indivisualId}.json`;
            if (!fs.existsSync(idvPath))
                fs.copyFileSync(
                    "./ServersData/Template/Users/Template.json", 
                    idvPath
                )
        }

        static load(guildId, indivisualId) {
            Pistil.server.check(guildId);
            
            this.check(guildId, indivisualId);

            var idvPath = `./ServersData/${guildId}/Users/${indivisualId}.json`;
            var indivisualData = JSON.parse(
                fs.readFileSync(idvPath)
            );
            return indivisualData;
        }

        static save(guildId, indivisualId, indivisualData) {
            fs.writeFileSync(
                `./ServersData/${guildId}/Users/${indivisualId}.json`,
                JSON.stringify(indivisualData, null, 4)
            );
            return indivisualData;
        }
    }

    // Shortened getters, not recommanded
    static getter = class PistilGetters {
        cli     = null;
        guild   = null;
        itr     = null;
        channel = null;

        constructor ({ client = null, guild = null, itr = null, channel = null }) {
            this.cli     = client;
            this.guild   = guild;
            this.itr     = itr;
            this.channel = channel;
        }

        guild(guildId) {
            if (!this.cli) throw new PistilError("Client not defined");

            let guild = this.channel.messages.cache.get(guildId);
            if (guild) return guild;

            return null;
        }

        option(commandOptionKey, returnType = "value") {
            if (!this.itr) throw new PistilError("Interaction not defined");

            let option = this.itr.options.get(commandOptionKey);
            if (!option) return null;

            if (returnType == "raw") return option;
            return option[returnType];
        };

        channel = function (channelId) {
            if (!this.guild) throw new PistilError("Guild not defined");

            let channel = this.guild.channels.cache.find(c => c.id == channelId);
            if (channel) return channel;

            throw new PistilError("Channel not found");
        }

        role = function (roleId) {
            if (!this.guild) throw new PistilError("Guild not defined");

            let role = this.guild.roles.cache.find(r => r.id == roleId);
            if (role) return role;

            throw new PistilError("Role not found");
        }

        message = function (messageId) {
            if (!this.channel) throw new PistilError("Channel not defined");

            let message = this.channel.messages.cache.get(messageId);
            if (message) return message;

            return null;
        }
    }
};

// used cluster, so no log here
// $(`Linked &bv${version}&r bot core &2Pistil`)
