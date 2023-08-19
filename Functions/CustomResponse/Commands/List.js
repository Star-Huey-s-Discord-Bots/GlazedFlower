const $         = require("../../../Modules/Logger.js");
const Pistil    = require("../../../Modules/Pistil.js");
const EmbedList = require("../../../Modules/EmbedList.js");

var handle = async (body) => {
    var { type } = body.arguments;

    var embedList = new EmbedList(
        `customResponse_list_${type}`,
        `Custom ${type == "react" ? "Reactions" : "Responses"}`,
        0x0dfdfd,
        5,
        () => {
            var server = Pistil.server.load(body.guild.id);

            var arr = new Array();
            server.customResponse[type].forEach((v, i) => {
                arr.push(
                    `\u200B\n${i + 1}. ` 
                  + `${type == "reply" ? `\"` : ""}${v[1]}${type == "reply" ? `\"` : ""} `
                  + `${type == "reply" ? `to` : "at"} \"${v[0]}\"`
                );
            });

            return arr;
        }
    );

    body.reply(embedList.show(0));
    Pistil.commandLog(body);
};

module.exports = {
    name: "custom-response list",
    arguments: [
        { key: "type", type: "string",  required: true, choices: {
            reply: "reply",
            react: "react"
        } },
    ],
    handle
};