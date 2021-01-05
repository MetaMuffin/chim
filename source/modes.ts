import { Channel, DMChannel, NewsChannel, TextChannel, VoiceChannel } from "discord.js"
import { SELECT_TEXT_CHANNEL_MODE, SELECT_GUILD_MODE, SELECT_VOICE_CHANNEL_MODE } from "./select"
import { handleInput } from "./input"
import { inputLine, log, statusLine } from "./logging"
import { MESSAGE_MODE } from "./message"
import { VOICE_MODE } from "./voice/voice-mode"
import { exit } from "."

export type ModeName = "message" | "select_text_channel" | "select_voice_channel" | "select_guild" | "normal" | "voice_control"
export interface Mode {
    onenter: () => any
    onleave: () => any
    oninput: (char: string) => any,
    linebuf: () => string
}

export var mode: ModeName;

export function setMode(s: ModeName) {
    if (mode == s) return
    if (mode) MODES[mode].onleave()
    mode = s
    MODES[mode].onenter()
    inputLine(MODES[mode].linebuf())
}



export const MODES: { [key in ModeName]: Mode } = {
    select_text_channel: SELECT_TEXT_CHANNEL_MODE,
    select_voice_channel: SELECT_VOICE_CHANNEL_MODE,
    voice_control: VOICE_MODE,
    select_guild: SELECT_GUILD_MODE,
    message: MESSAGE_MODE,
    normal: {
        onenter: () => { },
        linebuf: () => "?",
        onleave: () => { },
        oninput: (char) => {
            if (["c", "#", "t"].includes(char)) setMode("select_text_channel")
            else if (["v"].includes(char)) setMode("select_voice_channel")
            else if (["V"].includes(char)) setMode("voice_control")
            else if (["m", "i"].includes(char)) setMode("message")
            else if (["g"].includes(char)) setMode("select_guild")
            else if (char == "q") exit()
        },
    },
}

