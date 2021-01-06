import { Logger } from "./logger"


export interface TextInputState {
    cursor: number,
    buf: string,
    onbeforeinput: (char: string) => boolean,
    onafterinput: (input: string) => void,
    onsubmit: (input: string) => void
    prompt: () => string,
}

export type TextInputCallback = (char: string) => void

export function promptTextInput(state: TextInputState): TextInputCallback {
    Logger.prompt(state.prompt())
    const oninput = (char: string) => {
        if (char == "\r") {
            Logger.prompt(state.prompt())
            return state.onsubmit(state.buf)
        }
        if (char == "\x1b[C") state.cursor--
        if (char == "\x1b[D") state.cursor++
        state.buf += char
        Logger.input_buf = state.buf
    }

    return oninput
}