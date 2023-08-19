const { client } = global;

var handle = async (body) => {
    await body.deferReply();

    await body.followUp(`Pong! Discord: \`${client.ws.ping}ms\`. Network: \`${new Date().valueOf() - body.createdTimestamp}ms\`.`);
}

module.exports = {
    name: "ping",
    arguments: [],
    handle
};