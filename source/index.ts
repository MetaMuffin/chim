import { Channel, Client, DMChannel, Guild, GuildMember, NewsChannel, TextChannel, User } from "discord.js";
import { readFileSync } from "fs";
import { join } from "path";
import { Logger } from "./logger"

export interface GlobalState {
    channel: Channel | undefined
    guild: Guild | undefined
    user: User | undefined
    member: GuildMember | undefined
}
export var glob_state: GlobalState = {
    channel: undefined,
    guild: undefined,
    member: undefined,
    user: undefined
}


export const client = new Client();
function start() {
    process.stdin.setRawMode(true)
    process.stdout.write("\n\n")
    Logger.log("logging in", ["info"])

    client.on('ready', () => {
        init()
    });
    client.on('message', msg => {

    });

    client.login(readFileSync(join(__dirname, "../token")).toString().trim());
}

function init() {
    Logger.log("ready", ["success"])
    process.stdin.on("data", (chunk) => {
        for (let i = 0; i < chunk.toString().length; i++) {
            const char = chunk.toString().charAt(i);
            if (char == "\u0003") return exit()


        }
    })
}


export function exit() {
    Logger.log("exit", ["info"])
    process.stdin.setRawMode(false)
    process.exit(0)
}
process.on("SIGTERM", () => exit())
process.on("SIGINT", () => exit())

start()