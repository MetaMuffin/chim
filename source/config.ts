import { sgr_bold, sgr_dim, sgr_fg } from "./helper";
import { LogTag, LogTags } from "./logger";


export var config: Config = {
    colors: {
        log_tags: {
            err: sgr_fg(255, 100, 100) + sgr_bold,
            progress: sgr_fg(100, 255, 255),
            info: sgr_fg(100, 255, 255),
            success: sgr_fg(100, 255, 100),
            warn: sgr_fg(255, 255, 100),
        },
        inline_highlights: {
            channel: sgr_fg(255,255,100),
            guild: sgr_fg(100,255,100),
            role: sgr_fg(100,100,255),
            user: sgr_fg(255,100,255),
            category: sgr_bold + sgr_fg(255,255,255)
        },

    },
    channel_alias: {},
    guild_alias: {}
}

export interface Config {
    colors: {
        log_tags: { [key in LogTag]: string }

        inline_highlights: {
            channel: string,
            guild: string,
            role: string,
            user: string,
            category: string
        }
    }
    channel_alias: { [key: string]: string }
    guild_alias: { [key: string]: string }
}