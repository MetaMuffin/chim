import { Guild } from "discord.js"
import { client, glob_state } from ".."
import { display } from "../display"
import { Logger } from "../logger"
import { promptTextInput, TextInputCallback, TextInputState } from "../text-input"
import { Mode, setMode } from "./mode"

export function indexOfFirstDifference(a: string, test: string): number {
    for (let i = 0; i < Math.min(test.length, a.length); i++)
        if (a.charAt(i).toLowerCase() != test.charAt(i).toLowerCase()) return i
    return test.length
}


function suggestGuild(input: string): Guild | undefined {
    var mapped_matching: [Guild, number][] = client.guilds.cache.map(ch => [ch, indexOfFirstDifference(ch.name, input)])
    var sorted_matching = mapped_matching.sort((a, b) => b[1] - a[1])
    if (sorted_matching.length < 1) return undefined
    return sorted_matching[0][0]
}


var prompt_state: TextInputState = {
    buf: "",
    cursor: 0,
    prompt: () => "(guild) ",
    onbeforeinput: () => true,
    onafterinput: (input) => {
        var suggestion = suggestGuild(input)
        Logger.status(display(suggestion))
    },
    onsubmit: (input) => {
        var guild = suggestGuild(input)
        if (!guild) return Logger.status("no matching channels", ["err"], true)
        glob_state.guild = guild
        Logger.status(`selected: ${display(glob_state.guild)}`, ["info"], true)
        setMode("normal")
    },
}
var prompt_on_input: TextInputCallback

export const SELECT_GUILD_MODE: Mode = {
    onleave: () => { },
    onenter: () => {
        prompt_on_input = promptTextInput(prompt_state)
    },
    oninput: (char) => {
        prompt_on_input(char)
    }
}

