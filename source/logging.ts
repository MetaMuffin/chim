import { config, sgr_reset } from "./config"



export const syslog = (msg: string, mod?: string) => config.colors.log_system + `~chim${mod ? "-" + mod : ""}: ` + msg + sgr_reset
export const syserr = (msg: string, mod?: string) => config.colors.err_system + `~chim${mod ? "-" + mod : ""}: ` + msg + sgr_reset
export const log = (message: string = "") => {
    process.stdout.write(`\x1b[1A\r\x1b[0K${message}\n\r\x1b[0K${statusline_buf}\n\r\x1b[0K${inputline_buf}`)
}

var statusline_buf = ""
export const statusLine = (text: string = "") => {
    statusline_buf = text
    process.stdout.write(`\x1b[s\x1b[1A\r\x1b[0K${text}\n\x1b[u`)
}

var inputline_buf = ""
export const inputLine = (text: string = "") => {
    inputline_buf = text
    process.stdout.write(`\r\x1b[0K${text}`)
}

export const inputLineAppend = (text: string = "") => {
    inputline_buf += text
    process.stdout.write(text)
}
export const inputLineUpdateManaged = (text: string = "") => inputline_buf = text
