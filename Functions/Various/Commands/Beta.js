const Pistil = require("../../../Modules/Pistil");

const { client } = global;

var handle = async (body) => {
    await body.reply(Pistil.beta ? "I'm in beta mode." : "I'm not in beta mode.");
}

module.exports = {
    name: "beta",
    arguments: [],
    handle
};