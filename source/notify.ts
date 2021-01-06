import { Message } from "discord.js";
import { client, glob_state } from ".";
import { display } from "./display";
import { Logger } from "./logger";


export function onMessage(message: Message) {
    if (client.user) var should_notify = message.mentions.has(client.user)
    if (!message.guild) return
    var gg = client.guilds.cache.get(message.guild.id)
    if (!gg?.me) return
    should_notify ||= message.mentions.roles.intersect(gg.me.roles.cache)?.size > 0
    should_notify ||= message.channel.id == glob_state.channel?.id
    if (should_notify) Logger.log(display(message))
}
