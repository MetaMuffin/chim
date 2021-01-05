import { Channel, DMChannel, GuildMember, Message, NewsChannel, TextChannel, VoiceChannel } from "discord.js"
import { client } from "."
import { config, sgr_reset } from "./config"
import { log } from "./logging"
import { selection } from "./select"



function displayMessage(msg: Message): string {
    if (!(msg.channel instanceof TextChannel)) return ""
    return `[${config.colors.content_channel + msg.channel.name}]: ${displayMemberShort(msg?.member) || "rcpt"}: ${config.colors.content + msg.content + sgr_reset}`
}

function displayMemberShort(member: GuildMember | undefined | null): string | undefined {
    if (!member) return undefined
    return config.colors.content_author + member.user.tag + sgr_reset
}
export function displayChannelShort(c: Channel | undefined): string | undefined {
    if (c instanceof TextChannel) return "t#" + c.name
    if (c instanceof NewsChannel) return "n#" + c.name
    if (c instanceof VoiceChannel) return "v#" + c.name
    if (c instanceof DMChannel) return "d#" + c.recipient.tag
    return undefined
}


export function onMessage(msg: Message) {
    if (client.user) var should_notify = msg.mentions.has(client.user)
    if (!msg.guild) return
    var gg = client.guilds.cache.get(msg.guild.id)
    if (!gg?.me) return
    should_notify ||= msg.mentions.roles.intersect(gg.me.roles.cache)?.size > 0
    if (selection.text_channel) should_notify ||= msg.channel.id == selection.text_channel.id
    if (should_notify) log(displayMessage(msg))
}
