const $         = require("../../../Modules/Logger.js");
const Pistil    = require("../../../Modules/Pistil.js");
const EmbedList = require("../../../Modules/EmbedList.js");

var handle = async (body) => {
    if (!Pistil.vips.includes(body.user.id)) return;

    var { userId, currentPageIndex, action } = body.arguments;
    
    var embedList = new EmbedList(
        `queryChannelPermissions_list_${userId}`,
        body.message.embeds[0].title,
        0x0dfdfd,
        10,
        () => {
            var arr = new Array();

            var theMember = body.guild.members.cache.get(userId);

            if (!theMember) return new Array();

            theMember.permissionsIn(body.channel).toArray()
                .forEach((value, i) => {
                    arr.push(`${i + 1}. ${value}`);
                });

            return arr;
        }
    );

    body.update(embedList.turnAndShow(currentPageIndex, action));
};

module.exports = {
    name: "queryChannelPermissions_list",
    arguments: [
        { key: "userId",           type: "string" },
        { key: "currentPageIndex", type: "integer" },
        { key: "action",           type: "string" }
    ],
    handle
};