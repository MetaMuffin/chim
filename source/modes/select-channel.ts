import { GuildChannel, VoiceChannel } from "discord.js"
import { glob_state } from ".."
import { display } from "../display"
import { Logger } from "../logger"
import { promptTextInput, TextInputCallback, TextInputState } from "../text-input"
import { Mode, setMode } from "./mode"
import { indexOfFirstDifference } from "./select-guild"

function suggestChannel(input: string): GuildChannel | undefined {
    if (!glob_state.guild) return undefined
    var mapped_matching: [GuildChannel, number][] = glob_state.guild.channels.cache.map(ch => [ch, indexOfFirstDifference(ch.name, input)])
    var sorted_matching = mapped_matching.sort((a, b) => b[1] - a[1])
    if (sorted_matching.length < 1) return undefined
    return sorted_matching[0][0]
}


var prompt_state: TextInputState = {
    buf: "",
    cursor: 0,
    prompt: () => "(channel) ",
    onbeforeinput: () => true,
    onafterinput: (input) => {
        var suggestion = suggestChannel(input)
        Logger.status(display(suggestion))
    },
    onsubmit: (input) => {
        var channel = suggestChannel(input)
        if (!channel) return Logger.status("no matching channels", ["err"], true)
        glob_state.channel = channel
        Logger.status(`selected: ${display(glob_state.channel)}`, ["info"], true)
        setMode("normal")
    },
}
var prompt_on_input: TextInputCallback

export const SELECT_CHANNEL_MODE: Mode = {
    onleave: () => { },
    onenter: () => {
        if (!glob_state.guild) {
            Logger.status("no guild selected",["err"],true)
            setMode("normal")
        }
        prompt_on_input = promptTextInput(prompt_state)
    },
    oninput: (char) => {
        prompt_on_input(char)
    }
}

