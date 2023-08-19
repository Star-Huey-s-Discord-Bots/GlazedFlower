var handle = async (body) => {
    var value = parseInt(body.message.components[0].components[1].label);
    body.xReply(`The scoreboard value is ${value}.`)
}

module.exports = {
    name: "scoreboard_value",
    arguments: [],
    handle
};