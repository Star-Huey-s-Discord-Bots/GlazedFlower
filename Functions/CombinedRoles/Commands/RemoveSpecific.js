const $      = require("../../../Modules/Logger.js");
const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var server = Pistil.server.load(body.guild.id);

    var { index } = body.arguments;
    index--;

    if (index < 0 || index >= server.combinedRoles.length) {
        body.xReply("Index out of range.");
        return;
    }

    server.combinedRoles.splice(index, 1);

    Pistil.server.save(body.guild.id, server);

    index++;
    body.reply(`${body.user.toString()} has remove combined-roles no.${index}.`);
    Pistil.commandLog(body, `forget &ano.${index}`);
};

module.exports = {
    name: "combined-roles remove-specific",
    arguments: [
        { key: "index", type: "integer", required: true }
    ],
    handle
};