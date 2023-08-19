const $      = require("../../../Modules/Logger.js");
const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var server = Pistil.server.load(body.guild.id);

    var { type, index } = body.arguments;
    index -= 1;

    if (index < 0 || index >= server.customResponse[type].length) {
        body.xReply("Index out of range.")
        return;
    }

    server.customResponse[type].splice(index, 1);

    Pistil.server.save(body.guild.id, server);

    body.reply(`${body.user.toString()} has made me forget `
             + `the ${type == "react" ? "reaction" : "custom-reply"} `
             + `no.${index + 1}.`);
    Pistil.commandLog(body, `forget ${type} &ano.${index}`);
};

module.exports = {
    name: "custom-response forget-specific",
    arguments: [
        { key: "type", type: "string", required: true, choices: {
            reply: "reply",
            react: "react"
        } },
        { key: "index", type: "integer", required: true }
    ],
    handle
};