const Pistil = require("../../../Modules/Pistil");

const { client } = global;

var handle = async (body) => {
    var server = Pistil.server.load(body.guild.id);

    var { emoji, role } = body.arguments;

    server.reactionRoles.push([ emoji, role.id ]);

    Pistil.server.save(body.guild.id, server);
}

module.exports = {
    name: "reaction-roles add",
    arguments: [
        { key: "emoji", type: "string", required: true },
        { key: "role",  type: "role",   required: true }
    ],
    handle
};