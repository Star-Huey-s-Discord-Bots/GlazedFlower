const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var idv = Pistil.idv.load(body.guild.id, body.user.id);

    var dateNow = Math.floor(new Date().valueOf() / 24 / 60 / 60 / 1000);

    if (dateNow == idv.economy.daily.date) {
        body.xReply("You have already signed up today.");
        return;
    }

    var dailyState = idv.economy.daily;

    if (dateNow - dailyState.date == 1) {
        dailyState.sustained += 1;
        dailyState.amount    += 10;
    }
    else {
        dailyState.sustained  = 1;
        dailyState.amount    -= 50;
    }
    
    dailyState.amount = Math.min(Math.max(100, dailyState.amount), 500);
    dailyState.date = dateNow;
    idv.economy.coins += dailyState.amount;

    idv.economy.daily = dailyState;

    Pistil.idv.save(body.guild.id, body.user.id, idv);
    
    var modifier = dailyState.sustained == 1 ?
        "" : `Signed up for ${dailyState.sustained} consecutive days, `;

    body.reply({
        content: `${modifier}${body.user.toString()} got $${dailyState.amount}.`,
        components: [ 
            new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(idv.mails.length ? "📫" : "📪")
                        .setLabel("Mailbox")
                        .setCustomId(`mail_${body.user.id}`)
                ])
        ]
    });
    Pistil.commandLog(body, `got &a$${dailyState.amount}`);
};

module.exports = {
    name: "daily",
    arguments: [],
    handle
}