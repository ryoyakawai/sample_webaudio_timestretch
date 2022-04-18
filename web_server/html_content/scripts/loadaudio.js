"use strict";

const fetchAudio = async (file_location = null) => {
  if (file_location == null) {
    console.log(file_location, Object.keys(a_ctx).length, a_ctx)
    console.error('File Path is not Defined.')
    return false
  }

  const response = await fetch(file_location)
  return await response.arrayBuffer()
}

export {
  fetchAudio
}
