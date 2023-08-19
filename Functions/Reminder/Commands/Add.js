const Pistil = require("../../../Modules/Pistil");

const { Clock, Tick } = require("../../../Modules/Timer");

const dt = { 
    SECOND:                    1000,
    MINUTE:               60 * 1000,
    HOUR  :          60 * 60 * 1000,
    DAY   :     24 * 60 * 60 * 1000,
    WEEK  : 7 * 24 * 60 * 60 * 1000
};

var handle = async (body) => {
    if (true /* Not done! */) {
        body.xReply("Sorry, this feature is unavailable right now!");
        return;
    }

    var { content, time } = body.arguments;
    var loopDelay = body.arguments["loop-delay"];
    // Convert content
    content = content.replaceAll("\\\\", "\\\u200B").replaceAll("\\n", "\n");
    if (isNaN(Date.parse(time))) {
        body.xReply("Could not parse the time string.");
        return;
    }
    // Convert time string to epoch number
    time = new Date(time).setSeconds(0, 0).valueOf();
    if (time <= new Date().valueOf()) {
        body.xReply("Start time could only be in future.");
        return;
    }
    // Convert loop delay
    var loopDelayFormat
    if (loopDelay) {
        loopDelayFormat = loopDelay.split(" ");
        if (loopDelayFormat.length < 2 || !dt[loopDelayFormat[1].toUpperCase()] || isNaN(loopDelayFormat[0])) {
            body.xReply("Invalid loop delay.");
            return;
        }
        loopDelay = parseInt(loopDelayFormat[0]) * dt[loopDelayFormat[1].toUpperCase()];
    }
    if (loopDelay < 15 * dt.MINUTE) {
        body.xReply("Loop delay should be greater than 15 minutes.");
        return;
    }

    client.clock.addTick(new Tick(
        time,
        loopDelay,
        () => {
            body.channel.send(`> A reminder by <@${body.user.id}>\n` + content);
        }
    ));

    body.reply(
        `<@${body.user.id}> has added a reminder to send in `
      + new Date(time).toLocaleString("en-US", { 
            hour12: false, 
            dateStyle: "long", 
            timeStyle: "short" 
        }) 
      + (
            loopDelay ? 
                ` with ${loopDelayFormat[0]} ${loopDelayFormat[1]} loop.` 
            :   
                "." 
        )
    );

    Pistil.commandLog(body);
}

module.exports = {
    name: "reminder add",
    arguments: [
        { key: "content",    type: "string", required: true },
        { key: "time",       type: "string", required: true },
        { key: "loop-delay", type: "string" }
    ],
    handle
};