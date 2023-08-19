const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var server = Pistil.server.load(body.guild.id);

    var { 
        "role-1": role_1, 
        "role-2": role_2, 
        "combined-role": role_combined
    } = body.arguments;

    server.combinedRoles.push([ role_1.id, role_2.id, role_combined.id ]);

    Pistil.server.save(body.guild.id, server);

    body.reply(
        `${body.user.toString()} has added a combined role:\n> `
      + `**\\@\u200B${role_1.name}** + `
      + `**\\@\u200B${role_2.name}** → `
      + `**\\@\u200B${role_combined.name}**`
    );

    Pistil.commandLog(
        body,
        `&n@&&${role_1.name}&r + `
      + `&n@&&${role_2.name}&r → `
      + `&n@&&${role_combined.name}`
    );
};

module.exports = {
    name: "combined-roles add",
    arguments: [
        { key: "role-1",        type: "role", required: true },
        { key: "role-2",        type: "role", required: true },
        { key: "combined-role", type: "role", required: true }
    ],
    handle
};