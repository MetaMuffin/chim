import { RtAudio, RtAudioFormat } from "audify";
import { spawn } from "child_process";
import { VoiceConnection } from "discord.js";
import { AudioIO, getDevices, SampleFormat16Bit } from "naudiodon";
import { Readable } from "stream";
import { config, sgr_reset } from "../config";
import { log, statusLine, syserr, syslog } from "../logging";
import { Mode, setMode } from "../modes";
import { selection } from "../select";

var voice_connection: VoiceConnection | undefined

var receivers: [string, Readable, RtAudio][] = []


export const VOICE_MODE: Mode = {
    linebuf: () => `v?`,
    onenter: () => { },
    onleave: () => { },
    oninput: async (char) => {
        // console.log(getDevices());

        if (char == "c") {
            setMode("normal")
            if (voice_connection) return statusLine(syserr("already connected"))
            if (!selection.voice_channel) return statusLine(syserr("no voice channel selected"))
            statusLine(syslog("connecting"))
            voice_connection = await selection.voice_channel.join()
            if (!voice_connection) return statusLine(syserr("failed to connect"))
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
                if (!voice_connection) return statusLine(syserr("failed to connect"))
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
                    statusLine(syslog(`closed stream for ${m.user.tag}`))
                    rtAudio.closeStream()
                    rtAudio.stop()
                    user_stream.destroy()
                })
                user_stream.on("data", (chunk) => {
                    log(chunk.length)
                    rtAudio.write(chunk)
                })
                rtAudio.start();
            })
            voice_connection.on("ready", () => {
                statusLine(syslog("voice ready"))
            })
            statusLine(syslog("voice connected"))

        } else if (char == "d") {
            setMode("normal")
            if (!voice_connection) return statusLine(syserr("voice not connected"))
            voice_connection.disconnect()
            voice_connection = undefined
            receivers.forEach(([_1, _2, rta]) => rta.stop())
            receivers = []
            statusLine(syslog("disconnected"))
        }
    }
}
