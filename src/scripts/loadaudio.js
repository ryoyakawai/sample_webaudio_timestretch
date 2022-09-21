"use strict";
import { doStretch, doStretchPromise } from './kali_wrapper.js';

const fetchAudio = async (file_location = null) => {
  if (file_location == null) {
    throw new Error(`[ERROR] fetchAudio: File Path is not Defined. file_location=[${file_location}]`)
  }

  try {
    const response = await fetch(file_location)
    const res_arrayBuffer = await response.arrayBuffer()
    return res_arrayBuffer
  } catch (err) {
    throw new Error(`[ERROR] fetchAudio: Something Occured during fetchg file. file_location=[${file_location}]`)
  }
}

const decodeAudioDataPromise = async (wa = {}) => {
  const source = wa.a_ctx.createBufferSource()
  const arrayBuffer = wa.arrayBuffer.slice()
  return new Promise((resolve) => {
    wa.a_ctx.decodeAudioData(arrayBuffer, (decodedBuffer) => {
      source.buffer = decodedBuffer
      source.loop = false
      console.log('[info] completed to load audio')
      resolve(source)
    })
  })
}

const decodeAudioDataStretchPromise = (wa = {}, rate = 1, quickseek = true) => {
  const source = wa.a_ctx.createBufferSource()
  const arrayBuffer = wa.arrayBuffer.slice()
  const numChannels = 1
  return new Promise((resolve) => {
    wa.a_ctx.decodeAudioData(arrayBuffer, async (decodedBuffer) => {

      // do stretch
      console.log('[info] begin stretch and load audio')
      const inputData_0 = await decodedBuffer.getChannelData(0);
      const inputData_1 = await decodedBuffer.getChannelData(1);

      const promises = [
        doStretchPromise(wa.a_ctx, inputData_0, parseFloat(rate), numChannels, quickseek),
        doStretchPromise(wa.a_ctx, inputData_1, parseFloat(rate), numChannels, quickseek)
      ]
      const output = await Promise.allSettled(promises)
      const [output_0, output_1] = [output[0].value, output[1].value]

      const outputAudioBuffer = wa.a_ctx.createBuffer(2, output_0.length, wa.a_ctx.sampleRate)
      outputAudioBuffer.getChannelData(0).set(output_0)
      outputAudioBuffer.getChannelData(1).set(output_1)

      source.buffer = outputAudioBuffer
      source.loop = false

      console.log('[info] completed to strech and load audio')
      resolve(source)
    })
  })
}


export {
  fetchAudio,
  decodeAudioDataPromise,
  decodeAudioDataStretchPromise
}
