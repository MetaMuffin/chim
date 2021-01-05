

export async function loadConfig(fn: string) {

}


export const sgr_reset = "\x1b[0m"
export const sgr_bold = "\x1b[1m"
export const sgr_dim = "\x1b[2m"
export const sgr_italic = "\x1b[3m"
export const sgr_underline = "\x1b[4m"
export const sgr_fg = (r: number, g: number, b: number) => `\x1b[38;2;${r};${g};${b}m`
export const sgr_bg = (r: number, g: number, b: number) => `\x1b[48;2;${r};${g};${b}m`



export var config: Config = {
    colors: {
        mode_danger: sgr_bold + sgr_fg(255, 100, 100),
        mode_default: sgr_bold,

        err_system: sgr_fg(255, 70, 0),
        log_system: sgr_fg(0, 255, 255),

        message_default: "",
        message_mention_me: sgr_bold + sgr_fg(255, 0, 0),

        content: "",
        content_channel: sgr_fg(255, 255, 100),
        content_guild: sgr_fg(100, 255, 100),
        content_category: sgr_bold + sgr_fg(255, 255, 255),
        content_author: sgr_fg(255, 100, 255),
        content_mention_user: sgr_bold,
        content_mention_role: sgr_bold,
        content_code: ""

    },
    channel_alias: {},
    guild_alias: {}
}

export interface Config {
    colors: {
        mode_default: string,
        mode_danger: string,

        err_system: string,
        log_system: string,

        message_default: string,
        message_mention_me: string,

        content: string
        content_channel: string,
        content_guild: string,
        content_category: string,
        content_author: string,
        content_mention_user: string,
        content_mention_role: string,
        content_code: string
    }
    channel_alias: { [key: string]: string }
    guild_alias: { [key: string]: string }
}