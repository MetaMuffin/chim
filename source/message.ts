import { DMChannel, NewsChannel, TextChannel } from "discord.js"
import { displayChannelShort } from "./display"
import { handleInput } from "./input"
import { inputLine, statusLine, syserr, syslog } from "./logging"
import { Mode, MODES } from "./modes"
import { selection } from "./select"



export const MESSAGE_MODE: Mode = {
    onenter: () => {
        inputLine(MODES.message.linebuf())
    },
    linebuf: () => `(message ${displayChannelShort(selection.text_channel) || "nothing"}) `,
    onleave: () => { },
    oninput: (char) => {
        handleInput("message", char, (input) => {
            if ((selection.text_channel instanceof TextChannel) || (selection.text_channel instanceof NewsChannel) || (selection.text_channel instanceof DMChannel)) {
                if (input.trim() == "") return statusLine(syserr("message empty"))
                selection.text_channel.send(input).then(() => {
                    statusLine("message sent")
                })
                statusLine("awaiting message to be sent")
            } else {
                statusLine(syserr("no channel selected"))
            }
        })
    }
}
