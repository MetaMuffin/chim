import { CategoryChannel, Channel, DMChannel, Guild, GuildMember, Message, NewsChannel, TextChannel, VoiceChannel } from "discord.js"
import { client } from "."
import { config, sgr_reset } from "./config"
import { log } from "./logging"
import { selection } from "./select"



export function displayMessage(msg: Message): string {
    return `[${displayChannelShort(msg.channel)}]: ${displayMemberShort(msg?.member) || "rcpt"}: ${config.colors.content + msg.content + sgr_reset}`
}

function displayMemberShort(member: GuildMember | undefined | null): string | undefined {
    if (!member) return undefined
    return config.colors.content_author + member.user.tag + sgr_reset
}
export function displayChannelShort(c: Channel | undefined): string | undefined {
    if (c instanceof TextChannel) return config.colors.content_channel + "t#" + c.name + sgr_reset
    if (c instanceof NewsChannel) return config.colors.content_channel + "n#" + c.name + sgr_reset
    if (c instanceof VoiceChannel) return config.colors.content_channel + "v#" + c.name + sgr_reset
    if (c instanceof DMChannel) return config.colors.content_channel + "d#" + c.recipient.tag + sgr_reset
    if (c instanceof CategoryChannel) return config.colors.content_category + "c#" + c.name + sgr_reset
    return undefined
}
export function displayGuildShort(g: Guild): string {
    return config.colors.content_guild + g.name + sgr_reset
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
