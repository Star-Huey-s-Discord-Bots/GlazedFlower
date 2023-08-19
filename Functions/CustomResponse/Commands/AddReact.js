const $      = require("../../../Modules/Logger.js");
const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var server = Pistil.server.load(body.guild.id);

    var { keyword, emoji, strict } = body.arguments;
    emoji = emoji.trim();

    server.customResponse.react.push([ keyword, emoji, strict ]);

    Pistil.server.save(body.guild.id, server);

    body.reply(`${body.user.toString()} has taught me to react ${emoji} to \"${keyword}\"`);
    Pistil.commandLog(body, `added react ${emoji} to \"${keyword}\"`);
};

module.exports = {
    name: "custom-response add-react",
    arguments: [
        { key: "keyword", type: "string",  required: true },
        { key: "emoji",   type: "string",  required: true },
        { key: "strict",  type: "bool",    default: 1 }
    ],
    handle
};