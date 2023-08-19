const $      = require("../../../Modules/Logger.js");
const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    if (body.arguments["user"]) {
        var thatUser = body.arguments["user"];

        var idv = Pistil.idv.load(body.guild.id, thatUser.id);

        await body.reply(`${thatUser.toString()} has $${idv.economy.coins}`);

        Pistil.commandLog(body);
    }
    else {
        var idv = Pistil.idv.load(body.guild.id, body.user.id);

        await body.reply(`${body.user.toString()} has $${idv.economy.coins}`);

        Pistil.commandLog(body);
    }
}

module.exports = {
    name: "coins",
    arguments: [
        { key: "user", type: "user", required: false }
    ],
    handle
}