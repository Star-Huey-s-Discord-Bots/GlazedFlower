const $      = require("../../../Modules/Logger.js");
const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var server = Pistil.server.load(body.guild.id);

    var { keyword, response, strict, type } = body.arguments;
    strict = !!strict;
    response = response.trim();

    server.customResponse.reply.push([ keyword, response, strict, type ]);

    Pistil.server.save(body.guild.id, server);

    body.reply(`${body.user.toString()} has taught me to `
             + `reply \"${response}\" to \"${keyword}\"`);
    Pistil.commandLog(
        body,
        `added reply \"${response.short()}\" to \"${keyword.short()}\"`
    );
};

module.exports = {
    name: "custom-response add-reply",
    arguments: [
        { key: "keyword",  type: "string",  required: true },
        { key: "response", type: "string",  required: true },
        { key: "strict",   type: "bool",    default: 1 },
        { key: "type",     type: "integer", default: 0, choices: {
            "normal":   0,
            "not-ping": 1,
            "channel":  2
        } }
    ],
    handle
};