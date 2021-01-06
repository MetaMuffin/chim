import { onScroll } from "./channel-history"
import { config } from "./config"
import { sgr_reset } from "./helper"

export type LogTag = "info" | "warn" | "success" | "err" | "progress"
export type LogTags = LogTag[]

export class Logger {
    static input_buf: string = ""
    static prompt_buf: string = ""
    static status_buf: string = ""
    private static log_status_on_overwrite: boolean = false

    private static format(message: string, tags?: LogTags): string {
        if (!tags) return message
        var prefix = ""
        for (const tag of tags) prefix += config.colors.log_tags[tag]
        return prefix + "~chim: " + message + sgr_reset
    }

    static log(message: string, tags?: LogTags) {
        process.stdout.write(`\x1b[1A\r\x1b[0K${this.format(message, tags)}\n\r\x1b[0K${this.status_buf}\n\r\x1b[0K${this.prompt_buf}${this.input_buf}`)
    }
    static status(message: string, tags?: LogTags, logOnOverwrite?: boolean) {
        if (this.log_status_on_overwrite) this.log(this.status_buf)
        this.log_status_on_overwrite = logOnOverwrite || false
        this.status_buf = this.format(message, tags)
        process.stdout.write(`\x1b[s\x1b[1A\r\x1b[0K${this.status_buf}\n\x1b[u`)
    }
    static prompt(line: string) {
        this.prompt_buf = line
        process.stdout.write(`\r\x1b[0K${this.prompt_buf}${this.input_buf}`)
    }
    static inputReset() {
        this.input_buf = ""
        process.stdout.write(`\r\x1b[0K${this.prompt_buf}`)
    }
    static inputAppend(chars: string) {
        if (chars.startsWith("\x1b[B")) onScroll(1)
        else if (chars.startsWith("\x1b[A")) onScroll(-1)
        else if (chars.startsWith("\x1b")) {
            
        }
    }
}

