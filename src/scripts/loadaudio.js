"use strict";

const fetchAudio = async (file_location = null) => {
  if (file_location == null) {
    throw new Error(`[ERROR] fetchAudio: File Path is not Defined. file_location=[${file_location}]`)
  }

  try {
    const response = await fetch(file_location)
    return await response.arrayBuffer()
  } catch (err) {
    throw new Error(`[ERROR] fetchAudio: Something Occured during fetchg file. file_location=[${file_location}]`)
  }
}

export {
  fetchAudio
}
