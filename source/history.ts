import { GuildChannel, TextChannel } from "discord.js";
import { displayMessage } from "./display";
import { handleInput } from "./input";
import { log, statusLine, syserr, syslog } from "./logging";
import { Mode, setMode } from "./modes";
import { selection } from "./select";

export const HISTORY_MODE: Mode = {
    linebuf: () => `message history limit: `,
    onenter: () => { },
    onleave: () => { },
    oninput: async (char) => {
        if (!"0123456789:\r".split("").includes(char)) return
        handleInput("history", char, async (input) => {
            if (!selection.text_channel) return statusLine(syserr("no channel selected"))
            var [rnum, roffset] = input.split(":")
            roffset ||= "0"
            var num = parseInt(rnum)
            var offset = parseInt(roffset)
            setMode("normal")

            if ((selection.text_channel instanceof TextChannel)) {
                statusLine(syslog("loading messages"))
                var msgs = await selection.text_channel.messages.fetch({
                    limit: num,
                })
                msgs.forEach(m => {
                    log(displayMessage(m))
                })
                statusLine(syslog(`${msgs.size} messages loaded`))
            }
        })
    }
}