const EmbedList = require("../../../Modules/EmbedList.js");
const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var embedList = new EmbedList(
        `combinedRoles_list`,
        `Combined Roles`,
        0x0dfdfd,
        10,
        () => {
            var server = Pistil.server.load(body.guild.id);

            var arr = new Array();
            server.combinedRoles
                .forEach(([ role_1_id, role_2_id, role_combined_id ], i) => {
                    let role_1 = body.guild.roles.cache.get(role_1_id);
                    let role_2 = body.guild.roles.cache.get(role_2_id);
                    let role_combined = body.guild.roles.cache.get(role_combined_id);
                    
                    arr.push(
                        `${i + 1}. **\@\\\u200B${role_1.name}** + `
                      + `**\@\\\u200B${role_2.name}** → **\@\\\u200B${role_combined.name}**`
                    );
                });

            return arr;
        }
    );

    body.reply(embedList.show(0));
    Pistil.commandLog(body);
};

module.exports = {
    name: "combined-roles list",
    arguments: [],
    handle
};