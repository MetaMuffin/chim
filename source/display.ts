import { message } from "blessed";
import { CategoryChannel, Channel, DMChannel, Guild, GuildChannel, GuildMember, Message, NewsChannel, TextChannel, User, VoiceChannel } from "discord.js";
import { config } from "./config";
import { sgr_reset } from "./helper";





export function display(item: TextChannel | NewsChannel | DMChannel | CategoryChannel | VoiceChannel | User | Guild | Message | GuildChannel | Channel | undefined): string {
    if (item instanceof TextChannel) return config.colors.inline_highlights.channel + "t#" + item.name + sgr_reset
    if (item instanceof NewsChannel) return config.colors.inline_highlights.channel + "n#" + item.name + sgr_reset
    if (item instanceof VoiceChannel) return config.colors.inline_highlights.channel + "v#" + item.name + sgr_reset
    if (item instanceof DMChannel) return config.colors.inline_highlights.channel + "d#" + item.recipient.tag + sgr_reset
    if (item instanceof CategoryChannel) return config.colors.inline_highlights.category + "c#" + item.name + sgr_reset
    if (item instanceof Guild) return config.colors.inline_highlights.guild + "g#" + item.name + sgr_reset
    if (item instanceof GuildMember) return display(item.user)
    if (item instanceof User) return config.colors.inline_highlights.user + "u#" + item.tag + sgr_reset
    if (item instanceof Message) {
        return `[${display(item.channel)}] ${display(item.author)}: ${item.content}`
    }
    if (item instanceof GuildChannel) return config.colors.inline_highlights.channel + "gc#" + item.name + sgr_reset
    if (item instanceof Channel) return config.colors.inline_highlights.channel + "ch#" + item.type + sgr_reset
    if (!item) return "(none)"
    return "(something went wrong while generating this message)"
}
