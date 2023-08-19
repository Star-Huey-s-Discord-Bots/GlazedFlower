const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var { amount, user } = body.arguments;
    user = user ?? body.user;

    if (amount <= 0) {
        await body.xReply(
            "Amount must be greater than 0, "
          + "if you want to remove coins, use `/remove-coins`."
        );
        return;
    }

    var idv = Pistil.idv.load(body.guild.id, user.id);

    idv.economy.coins += amount;

    Pistil.idv.save(body.guild.id, user.id, idv);

    await body.reply(`Force added $${amount} to ${user.toString()}`);
    Pistil.commandLog(body);
}

module.exports = {
    name: "add-coins",
    arguments: [
        { key: "amount", type: "integer", required: true },
        { key: "user",   type: "user",    required: false }
    ],
    handle
}