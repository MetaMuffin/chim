import { RtAudio, RtAudioFormat } from "audify";
import { spawn } from "child_process";
import { VoiceChannel, VoiceConnection } from "discord.js";
import { AudioIO, getDevices, SampleFormat16Bit } from "naudiodon";
import { Readable } from "stream";
import { glob_state } from "..";
import { Logger } from "../logger";
import { Mode, setMode } from "./mode";

var voice_connection: VoiceConnection | undefined

var receivers: [string, Readable, RtAudio][] = []


export const VOICE_MODE: Mode = {
    onenter: () => { },
    onleave: () => { },
    oninput: async (char) => {
        // console.log(getDevices());

        if (char == "c") {
            setMode("normal")
            if (voice_connection) return Logger.status("already connected",["err"],true)
            if (!(glob_state.channel instanceof VoiceChannel)) return Logger.status("no voice channel selected",["err"],true)
            Logger.status("connecting",["info"],true)
            voice_connection = await glob_state.channel.join()
            if (!voice_connection) return Logger.status("failed to connect",["err"],true)
            // var ai = AudioIO({
            //     inOptions: {
            //         channelCount: 1,
            //         sampleFormat: SampleFormat16Bit,
            //         sampleRate: 44100,
            //         deviceId: 3,
            //         closeOnError: true,
            //     },
            //     outOptions: {
            //         channelCount: 2,
            //         sampleFormat: SampleFormat16Bit,
            //         sampleRate: 44100,
            //         deviceId: -1 // Use -1 or omit the deviceId to select the default device
            //     }
            // });

            // ai.start();
            voice_connection.channel.members.forEach(m => {
                if (!voice_connection) return Logger.status("failed to connect",["err"],true)
                var user_stream = voice_connection.receiver.createStream(m, { mode: "pcm", end: "manual" })
                const rtAudio = new RtAudio();
                receivers.push([m.user.tag, user_stream, rtAudio])

                rtAudio.openStream(
                    {
                        deviceId: rtAudio.getDefaultOutputDevice(),
                        nChannels: 2,
                        firstChannel: 0
                    },
                    null,
                    RtAudioFormat.RTAUDIO_SINT16,
                    48000,
                    1920,//*2,
                    `chim: ${m.user.tag}`,
                    pcm => rtAudio.write(pcm),
                    () => { }
                );

                user_stream.on("close", () => {
                    Logger.status(`closed stream for ${m.user.tag}`,["info"])
                    rtAudio.closeStream()
                    rtAudio.stop()
                    user_stream.destroy()
                })
                user_stream.on("data", (chunk) => {
                    //log(chunk.length)
                    rtAudio.write(chunk)
                })
                rtAudio.start();
            })
            voice_connection.on("ready", () => {
                Logger.status("voice ready",["info"],false)
            })
            Logger.status("voice connected",["info"],true)

        } else if (char == "d") {
            setMode("normal")
            if (!voice_connection) return Logger.status("voice not connected",["info"],true);
            voice_connection.disconnect()
            voice_connection = undefined
            receivers.forEach(([_1, _2, rta]) => rta.stop())
            receivers = []
            Logger.status("voice disconnected",["info"],true)
        }
    }
}
