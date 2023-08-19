const { PermissionsBitField, Events } = require("discord.js");
const Pistil = require("../../../Modules/Pistil")

const handle = async (msg) => {
    // Do some check...
    if (Pistil.beta && !Pistil.developers.includes(msg.author.id)) return;
    if (!msg.member) return;
    if (msg.member.user.bot || msg.member.user.system) return;
    if (msg.content.startsWith(Pistil.commandPrefix)) return;

    var server = Pistil.server.load(msg.guild.id);

    // React
    if (Pistil.checkPermissions(
        msg.channel, 
        PermissionsBitField.Flags.AddReactions
    )) {
        for (let i = 0, m = server.customResponse.react.length; i < m; ++i) {
            let _keywords = server.customResponse.react[i][0],
                   _emoji = server.customResponse.react[i][1],
                  _strict = server.customResponse.react[i][2];
    
            if (
                (  _strict && ( msg.content    ==    _keywords  ) ) 
             || ( !_strict && ( msg.content.includes(_keywords) ) )
            ) {
                msg.react(_emoji)
                    .catch((err) => null);
            }
        }
    }

    // Reply
    if (Pistil.checkPermissions(
        msg.channel,
        PermissionsBitField.Flags.SendMessages
    )) {
        for (let i = 0, m = server.customResponse.reply.length; i < m; ++i) {
            let _keywords = server.customResponse.reply[i][0],
                _response = server.customResponse.reply[i][1],
                  _strict = server.customResponse.reply[i][2],
                    _type = server.customResponse.reply[i][3];
    
            if (
                (  _strict && ( msg.content    ==    _keywords  ) ) 
             || ( !_strict && ( msg.content.includes(_keywords) ) )
            ) {
                switch (_type) {
                    case 0:
                        msg.reply(_response);
                        break;
                    case 1:
                        msg.reply({
                            content: _response,
                            allowedMentions: {
                                repliedUser: false
                            },
                        });
                        break;
                    case 2:
                        msg.channel.send(_response);
                        break;
                }
            }
        }
    }
}

module.exports = {
    event: Events.MessageCreate,
    handle
}