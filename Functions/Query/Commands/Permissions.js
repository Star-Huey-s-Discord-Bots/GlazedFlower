const Pistil    = require("../../../Modules/Pistil.js");
const EmbedList = require("../../../Modules/EmbedList.js");

var handle = async (body) => {
    if (!Pistil.vips.includes(body.user.id)) return;

    var theUser    = body.arguments["user"] ?? body.user;
    var theChannel = body.arguments["channel"] ?? body.channel;
    
    var embedList = new EmbedList(
        `queryChannelPermissions_list_${theUser.id}`,
        `Channel Permissions of ${theUser.tag}`,
        0x0dfdfd,
        10,
        () => {
            var arr = new Array();

            console.log(theUser);

            theUser.member.permissionsIn(theChannel).toArray().forEach((value, i) => {
                arr.push(`${i + 1}. ${value}`);
            });

            return arr;
        }
    );

    body.reply(embedList.show(0));

    Pistil.commandLog(body);
}

module.exports = {
    name: "query channel-permissions",
    arguments: [
        { key: "user",    type: "user",    required: false },
        { key: "channel", type: "channel", required: false }
    ],
    handle
}