const $      = require("../../../Modules/Logger.js");
const Pistil = require("../../../Modules/Pistil.js");

const legals = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '%', '(', ')' ]

var handle = async (body) => {
    var { content } = body.arguments;

    content = content
        .replaceAll(" ", "")
        .replaceAll("\\", "")
        .replaceAll("[", "(")
        .replaceAll("]", ")");

    var toAddSpace = new Array();
    for (let [ i, c ] of content.split("").entries()) {
        if (!legals.includes(c)) {
            body.xReply("Detected illegal characters.");
            return;
        }

        if (content[i + 1] == undefined) break;
        if (
            ( isNaN(content[i]) && !isNaN(content[i + 1]) && content[i    ] != "(")
         || (!isNaN(content[i]) &&  isNaN(content[i + 1]) && content[i + 1] != ")")
         || content[i    ] == ")" 
         || content[i + 1] == "("
        ) toAddSpace.push(i + 1);
    }
    for (let i of toAddSpace.reverse())
        content = content.slice(0, i) + " " + content.slice(i, content.length);

    var ans;
    try {
        ans = eval(content);
    } 
    catch (err) {
        body.xReply("Unable to calculate the given content.");
        return;
    }

    body.reply(`${content.replace("*", "\\*")} = **${Math.floor(ans * 1000) / 1000}**`)
    Pistil.commandLog(body);
};

module.exports = {
    name: "calculate",
    arguments: [
        { key: "content", type: "string", required: true }
    ],
    handle
};