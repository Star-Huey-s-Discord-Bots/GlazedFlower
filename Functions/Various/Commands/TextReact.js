const textEmoji = {
    "A": "🇦",
    "B": "🇧",
    "C": "🇨", 
    "D": "🇩", 
    "E": "🇪",
    "F": "🇫",
    "G": "🇬",
    "H": "🇭",
    "I": "🇮",
    "J": "🇯",
    "K": "🇰",
    "L": "🇱",
    "M": "🇲",
    "N": "🇳",
    "O": "🇴",
    "P": "🇵",
    "Q": "🇶",
    "R": "🇷",
    "S": "🇸",
    "T": "🇹",
    "U": "🇺",
    "V": "🇻",
    "W": "🇼",
    "X": "🇽",
    "Y": "🇾",
    "Z": "🇿",
    "0": "0️⃣", 
    "1": "1️⃣",
    "2": "2️⃣",
    "3": "3️⃣",
    "4": "4️⃣",
    "5": "5️⃣",
    "6": "6️⃣",
    "7": "7️⃣",
    "8": "8️⃣",
    "9": "9️⃣"
};

const Pistil = require("../../../Modules/Pistil");

const { client } = global;

var handle = async (body) => {
    if (!body.reference) {
        body.xReply("You're not replying to another message.");
        return;
    }
    var refMsgId = body.reference.messageId;

    var refMsg = new Pistil.getter({ channel: body.channel })
        .message(refMsgId);
    if (!refMsg) {
        body.xReply("Failed to load message, maybe it's too old.");
        return;
    }

    var { text } = body.arguments;
    text = text.toUpperCase();

    for (let char of text)
        if (!Object.keys(textEmoji).includes(char)) {
            body.xReply("Found invalid characters. Only English characters and numbers can be used.");
            return;
        }

    if (text.split("").some((char, index) => {
        return text.indexOf(char) != index
    })) {
        body.xReply("Found duplicated characters.");
        return;
    }

    await body.deferReply();

    for (let char of text)
        await refMsg.react(textEmoji[char]);

    body.followUp("Successfully reacted.");
    Pistil.commandLog(body, `reacted ${text.short()}`);
}

module.exports = {
    name: "text-react",
    arguments: [
        { key: "text", type: "string", required: true }
    ],
    handle
};