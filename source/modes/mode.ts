import { DELETE_MODE } from "./delete"
import { LIST_MODE } from "./list"
import { MESSAGE_MODE } from "./message"
import { NORMAL_MODE } from "./normal"
import { SELECT_CHANNEL_MODE } from "./select-channel"
import { SELECT_GUILD_MODE } from "./select-guild"
import { VOICE_MODE } from "./voice"

export type ModeName = "message" | "select_channel" | "select_guild" | "normal" | "voice_control" | "delete" | "list"
export interface Mode {
    onenter: () => any
    onleave: () => any
    oninput: (char: string) => any,
}

export var mode: ModeName = "normal"

export function setMode(name: ModeName) {
    MODES[mode].onleave()
    mode = name
    MODES[mode].onenter()
}


export const MODES: { [key in ModeName]: Mode } = {
    select_channel: SELECT_CHANNEL_MODE,
    voice_control: VOICE_MODE,
    select_guild: SELECT_GUILD_MODE,
    message: MESSAGE_MODE,
    normal: NORMAL_MODE,
    delete: DELETE_MODE,
    list: LIST_MODE
}

