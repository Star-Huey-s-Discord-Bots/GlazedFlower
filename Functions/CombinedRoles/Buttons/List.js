const $         = require("../../../Modules/Logger.js");
const Pistil    = require("../../../Modules/Pistil.js");
const EmbedList = require("../../../Modules/EmbedList.js");

var handle = async (body) => {
    var { currentPageIndex, action } = body.arguments;
    
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
                        `${i + 1}. ${role_1.name} + ${role_2.name} → ${role_combined.name}`
                    );
                });

            return arr;
        }
    );

    body.update(embedList.turnAndShow(currentPageIndex, action));
};

module.exports = {
    name: "combinedRoles_list",
    arguments: [
        { key: "currentPageIndex", type: "integer" },
        { key: "action",           type: "string" }
    ],
    handle
};