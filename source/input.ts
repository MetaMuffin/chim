import { inputLine, inputLineUpdateManaged } from "./logging"
import { ModeName, MODES } from "./modes"

export var input_buffers: { [key: string]: string } = {}

export function handleInput(modename: ModeName, char: string, onsubmit: (s: string) => any) {
    if (!input_buffers[modename]) input_buffers[modename] = "" 
    if (char == "\b") {
        input_buffers[modename].slice(0, -1)
        process.stdout.write("\b")
    } else if (char == "\r") {
        var input = input_buffers[modename]
        input_buffers[modename] = ""
        inputLine(MODES[modename].linebuf())
        onsubmit(input)
    } else {
        process.stdout.write(char)
        input_buffers[modename] += char
        inputLineUpdateManaged(input_buffers[modename])
    }
}


