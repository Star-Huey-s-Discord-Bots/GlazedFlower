const $      = require("../../../Modules/Logger.js");
const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var server = Pistil.server.load(body.guild.id);

    var { type, keyword } = body.arguments;

    if (type == "both" || type == "react")
        for (let i = server.customResponse.react.length - 1; i >= 0; --i)
            if (server.customResponse.react[i][0] == keyword)
                server.customResponse.react.splice(i, 1);

    if (type == "both" || type == "reply")
        for (let i = server.customResponse.reply.length - 1; i >= 0; --i)
            if (server.customResponse.reply[i][0] == keyword)
                server.customResponse.reply.splice(i, 1);

    Pistil.server.save(body.guild.id, server);

    body.reply(`${body.user.toString()} has taught me not to `
             + `${type == "both" ? "reply or react" : type} to `
             + `\"${keyword}\" anymore.`);
    Pistil.commandLog(body, `removed ${type} keyword \"${keyword.short()}\"`);
};

module.exports = {
    name: "custom-response forget-keyword",
    arguments: [
        { key: "type", type: "string", required: true, choices: {
            both: "both",
            reply: "reply",
            react: "react"
        } },
        { key: "keyword", type: "string", required: true }
    ],
    handle
};