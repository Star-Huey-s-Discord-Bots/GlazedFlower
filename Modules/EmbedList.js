const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require("discord.js");

module.exports = class EmbedList {
    id      = "anonymous";
    rows    = 10;
    color   = 0xfdfdfd;
    title   = "List";
    getList = () => {
        return [];
    }

    constructor (
        id           = "anonymous",
        title        = "An Anonymous List", 
        color        = 0xfdfdfd, 
        rowsPerPage  = 20, 
        listFunction = () => { 
            return []; 
        }
    ) {
        this.id      = id;
        this.rows    = rowsPerPage;
        this.title   = title;
        this.color   = color;
        this.getList = listFunction;
    }

    parseButton(customId) {
        let args = customId.split("_");

        var start = args.findIndex(s => s == "list");

        var pageIndex = parseInt(args[start + 1]),
               action = args[start + 2];

        return { pageIndex, action };
    }

    empty() {
        return {
            embeds: [
                new EmbedBuilder()
                    .setColor(this.color)
                    .setTitle(this.title)
                    .setDescription("Nothing is here.")
            ]
        };
    }

    prototypeOutput(arr, minPageIndex, pageIndex, maxPageIndex) {
        var listIndex = pageIndex * this.rows;

        return {
            embeds: [
                new EmbedBuilder()
                    .setColor(this.color)
                    .setTitle(this.title)
                    .setDescription(
                        arr.slice(listIndex, listIndex + this.rows).join("\n")
                    )
            ],
            components: minPageIndex == maxPageIndex ? [] : [
                new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("◀️")
                            // .setLabel("Previous Page")
                            .setCustomId(`${this.id}_${pageIndex}_previous`)
                            .setDisabled(pageIndex == minPageIndex)
                        ,
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("▶️")
                            // .setLabel("Next Page")
                            .setCustomId(`${this.id}_${pageIndex}_next`)
                            .setDisabled(pageIndex == maxPageIndex)
                    ])
            ]
        };
    }

    show(pageIndex = 0) {
        let arr = this.getList();

        let maxPageIndex = Math.ceil(arr.length / this.rows - 1);

        pageIndex = Math.min(Math.max(0, pageIndex), maxPageIndex);

        return arr.length > 0 ?
            this.prototypeOutput(arr, 0, pageIndex, maxPageIndex)
        :
            this.empty()
        ;
    }

    turnAndShow(currentPageIndex = 0, action = "nothing") {
        let pageIndex = currentPageIndex;

        switch (action) {

        case "previous":
            pageIndex -= 1;
            break;

        case "next":
            pageIndex += 1;
            break;

        }

        return this.show(pageIndex);
    }
};