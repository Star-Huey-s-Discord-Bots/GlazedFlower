const fs = require("node:fs");
const $ = require("../Modules/Logger");

//=================================================================================

const version = 9;

const updateUser = (idv) => {


    return idv;
}

const updateServer = (server) => {
    server.commonRoles = server.roleSystem;
    delete server.roleSystem;

    server.reactionRoles = new Array();

    return server;
}

//=================================================================================

var systemData = JSON.parse(fs.readFileSync("./Build/Data/System.json"));
if (systemData.fileSystem != version) {
    systemData.fileSystem = version;
    fs.writeFileSync("./Build/Data/System.json", JSON.stringify(systemData, null, 4));

    fs.readdirSync("./ServersData").forEach(serverPath => {
        fs.readdirSync(`./ServersData/${serverPath}/Users`).forEach((userPath) => {
            var user = JSON.parse(fs.readFileSync(`./ServersData/${serverPath}/Users/${userPath}`));
            
            user = updateUser(user);

            fs.writeFileSync(`./ServersData/${serverPath}/Users/${userPath}`, JSON.stringify(user, null, 4))
        });
        var server = JSON.parse(fs.readFileSync(`./ServersData/${serverPath}/Data.json`));
        
        server = updateServer(server);

        fs.writeFileSync(`./ServersData/${serverPath}/Data.json`, JSON.stringify(server, null, 4));
    });

    $(`Updated to version &b${version}&r file system`);
}