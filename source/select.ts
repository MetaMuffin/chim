import { Channel, DMChannel, Guild, GuildChannel, NewsChannel, TextChannel, VoiceChannel } from "discord.js"
import { inspect } from "util"
import { client } from "."
import { displayChannelShort } from "./display"
import { input_buffers, handleInput } from "./input"
import { log, statusLine, syserr, syslog } from "./logging"
import { Mode, setMode } from "./modes"

export var selection: { text_channel: Channel | undefined, guild: Guild | undefined, voice_channel: VoiceChannel | undefined } = {
    text_channel: undefined,
    voice_channel: undefined,
    guild: undefined
}


export function indexOfFirstDifference(a: string, test: string): number {
    for (let i = 0; i < Math.min(test.length, a.length); i++)
        if (a.charAt(i).toLowerCase() != test.charAt(i).toLowerCase()) return i
    return test.length
}

function suggestChannel(input: string, type: "voice" | "text" | "all"): GuildChannel | undefined {
    if (!selection.guild) return undefined
    var filtered_matching = selection.guild.channels.cache.filter(ch => {
        if (type == "all") return true
        else if (type == "text") return !(ch instanceof VoiceChannel)
        else return (ch instanceof VoiceChannel)
    })
    var mapped_matching: [GuildChannel, number][] = filtered_matching.map(ch => [ch, indexOfFirstDifference(ch.name, input)])
    var sorted_matching = mapped_matching.sort((a, b) => b[1] - a[1])
    if (sorted_matching.length < 1) return undefined
    return sorted_matching[0][0]
}

function suggestGuild(input: string): Guild | undefined {
    var mapped_matching: [Guild, number][] = client.guilds.cache.map(ch => [ch, indexOfFirstDifference(ch.name, input)])
    var sorted_matching = mapped_matching.sort((a, b) => b[1] - a[1])
    if (sorted_matching.length < 1) return undefined
    return sorted_matching[0][0]
}

export const SELECT_TEXT_CHANNEL_MODE: Mode = {
    onleave: () => { },
    onenter: () => { },
    linebuf: () => "(text channel) ",
    oninput: (char) => {
        var suggestion = suggestChannel(input_buffers["select_text_channel"] + char, "text")
        statusLine(displayChannelShort(suggestion) || ((selection.guild) ? syserr("no text channel found") : syserr("no guild selected")))
        handleInput("select_text_channel", char, (input) => {
            var channel = suggestChannel(input, "text")
            if (!channel) return statusLine(syserr("no matching channels"))
            selection.text_channel = channel
            statusLine(`selected: ${displayChannelShort(selection.text_channel)}`)
            setMode("normal")
        })
    }
}


export const SELECT_VOICE_CHANNEL_MODE: Mode = {
    onleave: () => { },
    onenter: () => { },
    linebuf: () => "(voice channel) ",
    oninput: (char) => {
        var suggestion = suggestChannel(input_buffers["select_voice_channel"] + char, "voice")
        statusLine(displayChannelShort(suggestion) || ((selection.guild) ? syserr("no voice channel found") : syserr("no guild selected")))
        handleInput("select_voice_channel", char, (input) => {
            if (!selection.guild) return statusLine(syserr("no guild selected"))
            var channel = suggestChannel(input, "voice")
            if (!channel) return statusLine(syserr("no matching voice channels"))
            if (!(channel instanceof VoiceChannel)) throw new Error("this should have never happend");
            selection.voice_channel = channel
            statusLine(`selected: ${displayChannelShort(selection.voice_channel)}`)
            setMode("normal")
        })
    }
}

export const SELECT_GUILD_MODE: Mode = {
    onleave: () => { },
    onenter: () => { },
    linebuf: () => "(guild) ",
    oninput: (char) => {
        var suggestion = suggestGuild(input_buffers["select_guild"] + char)
        if (suggestion) statusLine(suggestion.name || syserr("no guild found"))
        handleInput("select_guild", char, (input) => {
            var guild = suggestGuild(input)
            if (!guild) return statusLine(syserr("no matching guilds"))
            selection.guild = guild
            statusLine(`selected: ${selection.guild.name}`)
            setMode("normal")
        })
    }
}




