const Pistil = require("../../Modules/Pistil.js");

const fs   = require("node:fs");
const path = require("node:path");

const { client } = global;

var childHandlers = new Array();

var files = fs.readdirSync("./Functions/");
files.forEach((folder) => {
    if (!fs.existsSync(path.join("./Functions/", folder, "/Handlers/"))) 
        return;

    var handlers = fs.readdirSync(
        path.join("./Functions/", folder, "/Handlers/")
    );

    handlers.forEach((file) => {
        var childHandler = require(
            path.resolve(path.join("./Functions/", folder, "/Handlers/", file))
        );

        if (childHandler.handle !== undefined)
            childHandlers.push(childHandler);
    });
});

var listeners = new Map();

for (let h of childHandlers) {
    var handlers = listeners.get(h.event);
    if (handlers)
        listeners.set(handlers.push(h.handle));
    else
        listeners.set(h.event, [ h.handle ]);
}

var finalListeners = new Object();

for (let [ event, handlers ] of listeners.entries()) {
    var chainedHandler = handlers.reduce((prev, curr) => {
        return async (...args) => {
            await prev(...args);
            await curr(...args);
        };
    });
    finalListeners[event] = chainedHandler;
}

for (let event of Object.keys(finalListeners)) {
    client.addListener(event, async (...args) => {
        try {
            await finalListeners[event](...args);
        }
        catch (err) {
            if (Pistil.safe)
                console.error(err);
            else
                throw err;
        }
    });
}

global.client = client;