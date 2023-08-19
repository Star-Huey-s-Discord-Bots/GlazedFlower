const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var { user: theUser, amount } = body.arguments;

    var giverId = body.user.id,
        givedId = theUser.id;

    if (amount <= 0) {
        body.xReply("The amount must be greater than zero.");
        return;
    }

    var giver = Pistil.idv.load(body.guild.id, giverId),
        gived = Pistil.idv.load(body.guild.id, givedId);

    if (giver.economy.coins < amount) {
        body.xReply("You don't have that much.");
        return;
    }

    giver.economy.coins -= amount,
    gived.economy.coins += amount;

    Pistil.idv.save(body.guild.id, giverId, giver);
    Pistil.idv.save(body.guild.id, givedId, gived);

    body.reply(`<@${giverId}> has given $${amount} to <@${givedId}>.`);
    Pistil.commandLog(body, `gave &a$${amount}&r to &n${theUser.tag}`);
};

module.exports = {
    name: "give",
    arguments: [
        { key: "user",   type: "user",    required: true },
        { key: "amount", type: "integer", required: true }
    ],
    handle
}