import { DMChannel, NewsChannel, TextChannel } from "discord.js"
import { glob_state } from ".."
import { display } from "../display"
import { Logger } from "../logger"
import { promptTextInput, TextInputCallback, TextInputState } from "../text-input"
import { Mode } from "./mode"

var prompt_state: TextInputState = {
    buf: "",
    cursor: 0,
    onbeforeinput: () => true,
    onafterinput: () => {},
    prompt: () => `(message ${display(glob_state.channel)})`,
    onsubmit: (input) => {
        if ((glob_state.channel instanceof TextChannel) || (glob_state.channel instanceof NewsChannel) || (glob_state.channel instanceof DMChannel)) {

            if (input.trim() == "") return Logger.status("message empty", ["warn"], true)
            glob_state.channel.send(input).then(() => {
                Logger.status("message sent", ["success"], false)
            })
            Logger.status("awaiting message to be sent", ["progress"], false)
        } else {
            Logger.status("no channel selected", ["err"])
        }
    }
}
var prompt_on_input: TextInputCallback

export const MESSAGE_MODE: Mode = {
    onenter: () => {
        if (!glob_state.channel) {
            Logger.status("no channel selected", ["warn"], true)
        }
        prompt_on_input = promptTextInput(prompt_state)
    },
    onleave: () => { },
    oninput: (char) => {
        prompt_on_input(char)
    }
}
