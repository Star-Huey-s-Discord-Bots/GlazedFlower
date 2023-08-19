const Pistil = require("../../../Modules/Pistil");

var handle = async (body) => {
    var { items } = body.arguments;
    
    var items = items
        .split(/,|\uff0c|;|\uff1b/g)
        .filter(s => s.trim() && s.split("").findIndex(c => c != "\u3000") != -1);

    const chosen = items[Math.floor(Math.random() * items.length)];

    body.reply("Thinking...")
        .then(async r => r.fetch()
            .then(async msg => {
                await new Promise(r => setTimeout(r, 1000));
                msg.edit(`I choose ${chosen.trim()}.`);
            })
    );
}

module.exports = {
    name: "choose",
    arguments: [
        { key: "items", type: "string", required: true }
    ],
    handle
};