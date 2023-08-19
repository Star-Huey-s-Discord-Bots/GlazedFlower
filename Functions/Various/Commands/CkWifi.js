const { EmbedBuilder } = require("discord.js");

const   axios       = require("axios").default,
      { wrapper   } = require("axios-cookiejar-support"),
      { CookieJar } = require("tough-cookie"),
      { recognize } = require("tesseractocr");

const Pistil = require("../../../Modules/Pistil");

class _AxiosError extends Error {
    constructor (message = "Unknown") {
        super (message);

        this.name = "AxiosError";
    }
}

class _TesseractError extends Error {
    constructor (message = "Unknown") {
        super (message);

        this.name = "TerreractError";
    }
}

const { client } = global;

async function getCaptchaImge(axiosClient) {
    const codePage = await axiosClient.get(
        "https://info.ck.tp.edu.tw/ckap_guest_passwd/code.php/",
        { responseType: "arraybuffer" }
    );

    return codePage.data;
}

async function sendCaptcha(axiosClient, captcha) {
    const resultPage = await axiosClient.post(
        "https://info.ck.tp.edu.tw/ckap_guest_passwd/pass_query_get.php", 
        {
            f_uid: "ck1110762",
            f_pwd: "31692673",
            f_magiccode: captcha
        },
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return resultPage.data;
}

async function getCaptchaResult(axiosClient, captcha) {
    var result = await sendCaptcha(axiosClient, captcha);

    if (result.includes("錯誤"))
        return "FAILED";

    var lines = result.split(/\r\n|\r|\n/g);

    var theLine = "";
    for (let line of lines)
        if (line.includes("密碼")) {
            theLine = line;
            break;
        }

    var realLine = "";
    for (let i = 0; i < theLine.length; ++i) {
        if (theLine[i] == "<") {
            i = theLine.indexOf(">", i + 1);
            continue;
        }

        realLine += theLine[i];
    }

    var embed = new EmbedBuilder()
        .setTimestamp(new Date())
        .setColor(0x0dfdfd)
        .setTitle("建中無線網路來賓帳號查詢結果")
        .setDescription(
            realLine
                .replace("帳號：", "帳號：\`")
                .replace("密碼：", "\`\n密碼：\`") 
          + "\`"
        );

    return { embeds: [ embed ] };
}

var prototypeHandle = async (body) => {
    await body.deferReply();

    var tryTimes = body.arguments["try-times"];

    // complex process, log first
    Pistil.commandLog(body);

    // create new axios client and keep the cookies
    const axiosClient = wrapper(axios.create({ jar: new CookieJar() }));

    // get the login page to show the captcha image later
    await axiosClient.get("https://info.ck.tp.edu.tw/ckap_guest_passwd/").catch(err => {
        throw new _AxiosError("Error occured while sending request");
    });

    // use async process to speed up
    var requestPromises = new Array();
    for (let i = 0; i < tryTimes; ++i)
        requestPromises.push(getCaptchaImge(axiosClient).catch(err => {
            throw new _AxiosError("Error occured while sending request");
        }));

    var recognizePromises = new Array();
    for (let i = 0; i < tryTimes; ++i)
        recognizePromises.push(recognize(await requestPromises[i]).catch(err => {
            throw new _TesseractError("Error occured while recognizing the captcha");
        }));

    // refresh the captcha image and attempt to identify it multiple times
    var recognitions = new Object();
    for (let i = 0; i < tryTimes; ++i) {
        var text = await recognizePromises[i];

        text = text.replaceAll(/\r\n|\r|\n|\u0020/g, "");

        if (!text) continue;

        if (recognitions[text])
            recognitions[text]++;
        else
            recognitions[text] = 1;
    }

    // find the most frequently occurring
    var maxTimes = 0, 
        captcha = "";
    for (let key of Object.keys(recognitions))
        if (recognitions[key] > maxTimes) {
            maxTimes = recognitions[key];
            captcha = key;
        }

    // get the result
    var result = await getCaptchaResult(axiosClient, captcha);

    // suceeded
    if (result != "FAILED") {
        await body.followUp(result);
        return;
    }

    // failed
    var captchaImage = await getCaptchaImge(axiosClient);
    await body.followUp({
        content: "Failed to recognize the captcha.\n"
               + "You have 30 seconds to answer the captcha ↓",
        files: [
            captchaImage
        ]
    });

    // await user input
    body.channel.awaitMessages({ 
        filter: msg => msg.author.id = body.user.id, 
        max: 1,
        time: 30_000,
        errors: [ "time" ]
    }).then(async collected => {
        let result = await getCaptchaResult(axiosClient, collected.first().content);

        if (result == "FAILED") {
            await body.followUp(
                "Failed to login..."
            );
            return;
        }

        await collected.first().reply(
            result
        );
    }).catch(async collected => {
        await body.followUp("Error occured, maybe timed out.");
    });
}

var handle = async (body) => {
    await prototypeHandle(body).catch(err => {
        if ((err instanceof _TesseractError) || (err instanceof _AxiosError)) {
            body.followUp(err.message + ".");
            return;
        }
        throw err;
    });
}

module.exports = {
    name: "ck-wifi",
    arguments: [
        { key: "try-times", type: "integer", default: 200 }
    ],
    handle
};
