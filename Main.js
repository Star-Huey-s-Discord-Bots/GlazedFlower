const cluster = require("node:cluster");

const $      = require("./Modules/Logger.js");
const Pistil = require("./Modules/Pistil.js");

if (cluster.isPrimary) {
    cluster.fork();
  
    cluster.on("exit", (worker, code, signal) => {
        if (Pistil.safe) {
            $("&cProcess stopped, restarting...");
            cluster.fork();
        }
    });
}

if (cluster.isWorker) {
    $(`Linked &bv${Pistil.version}&r bot core &2Pistil`);

    void require("./Build/Client.js");
    void require("./Build/ReloadCommands.js");
    void require("./Build/UpdateFileSystem.js");
}