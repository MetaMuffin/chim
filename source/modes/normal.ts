import { exit } from ".."
import { Mode, setMode } from "./mode"



export const NORMAL_MODE: Mode = {
    onenter: () => { },
    onleave: () => { },
    oninput: (char) => {
        if (["c"].includes(char)) setMode("select_channel")
        else if (["v"].includes(char)) setMode("voice_control")
        else if (["m"].includes(char)) setMode("message")
        else if (["g"].includes(char)) setMode("select_guild")
        else if (char == "d") setMode("list")
        else if (char == "l") setMode("delete")
        else if (char == "q") exit()
    },
}
