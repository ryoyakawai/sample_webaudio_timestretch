"use strict";

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

export {
  fetchAudio,
  decodeAudioDataPromise
}
