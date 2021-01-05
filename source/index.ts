import { Channel, Client, DMChannel, Guild, Message, TextChannel } from "discord.js";
import { readFileSync } from "fs";
import { join } from "path";
import { log, statusLine, syserr, syslog } from "./logging";
import { ModeName, MODES, setMode, mode, } from "./modes";
import { onMessage } from "./display";

process.stdout.write("\x1b]0;chim - discord frontend improved\x07")



function init() {
    process.stdin.setRawMode(true)
    
    process.stdin.on("data", (chunk) => {
        var input = chunk.toString()
        //console.log(JSON.stringify(input))
        for (let i = 0; i < input.length; i++) {
            const char = input.charAt(i);
            if (char == "\u0003") process.exit(0)
            else if (char == "\u001b") {
                setMode("normal")
            }
            MODES[mode].oninput(char)
        }
    })
    log(syslog("ready"))
    setMode("normal")
}


export const client = new Client();
client.on('ready', () => {
    init()
});

client.on('message', msg => {
    onMessage(msg)
});

client.login(readFileSync(join(__dirname, "../token")).toString().trim());

//setInterval(() => statusLine(Math.random().toString()),1000)

process.stdout.write("\x1b[?1049h")
export function exit() {
    process.stdin.setRawMode(false)
    process.stdout.write("\x1b[?1049l" + syslog("exit"))
    process.exit(0)
}
process.on("SIGTERM",() => exit())
process.on("SIGINT",() => exit())

log(syslog("logging in"))

console.log = (s:string) => log(syslog(s,"unknown-log"))
console.error = (s:string) => log(syserr(s,"unknown-err"))
console.warn = (s:string) => log(syserr(s,"unknown-warn"))
