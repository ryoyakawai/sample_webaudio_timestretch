"use strict";

import {fetchAudio, decodeAudioDataPromise, decodeAudioDataStretchPromise} from './loadaudio.js';
import {convTimeFormatFromSec, toggle_button_disable} from './mainlib.js';

const _MP3_URL = './mp3/eine.mp3';
const SEEK_DURATION_MSEC = 30
const wa = {
  a_ctx: null,
  source: null,
  file_name: '',
  arrayBuffer: null,
  a_ctx_start_time: 0,
  a_ctx_paused_time: 0
};
let isPlaying = false;
let seekTimerId = 0;

const AudioContext = window.AudioContext || window.webkitAudioContext;

(async () => {
  // Get UI elements
  const seek_bar = document.querySelector('input#seek_bar')
  const seek_bar_text = document.querySelector('span#seek_bar_text')
  const loadaudio_button = document.querySelector('button#loadaudio_button')
  const start_stop_button = document.querySelector('button#start_stop_button')
  const playback_rate = document.querySelector('input#playback_rate')
  const playback_rate_text = document.querySelector('span#playback_rate_text')

  const allow_play = async () => {
    wa.a_ctx = new AudioContext()
    try {
      wa.arrayBuffer = await fetchAudio(_MP3_URL)
      wa.file_name = _MP3_URL.split('/').pop()
      start_stop_button.innerHTML = `▶ Start : ${wa.file_name}`
      console.log(`[message] ${_MP3_URL} is loaded.`)
      wa.source = await decodeAudioDataPromise(wa)
      toggle_button_disable(seek_bar)
      loadaudio_button.innerHTML = 'Reload Page To Change Music'
    } catch (err) {
      console.error(`[ERROR] allow_play: msg=[${JSON.stringify(err)}]`)
    }
  }

  const start_update_display_time = (callback = () => { }) => {
    seekTimerId = setInterval(() => {
      if (wa.source.buffer !== null) {
        const duration = wa.source.buffer.duration.toFixed(2)
        const current_position = (wa.a_ctx_paused_time + wa.a_ctx.currentTime - wa.a_ctx_start_time).toFixed(4)
        callback(current_position, duration)
      }
    }, SEEK_DURATION_MSEC)
  }
  const stop_update_display_time = () => (
    clearInterval(seekTimerId)
  )

  const setPausedTime = () => {
    wa.a_ctx_start_time = wa.a_ctx.currentTime - wa.a_ctx_start_time
  }

  const seek_bar_callback = (current_position = 0, duration = 0) => {
    seek_bar.value = (100 * current_position / duration)
    const [hour, min, sec, msec] = convTimeFormatFromSec(current_position)
    seek_bar_text.innerHTML = `${hour}:${min}:${sec}:${msec}`
  }

  const uploadFilDragOver = (event) => {
    event.stopPropagation()
    event.preventDefault()

    event.dataTransfer.dropEffect = 'copy';
    event.target.setAttribute('disabled', 'disabled')
  }
  const uploadFilDragLeave = (event) => {
    event.stopPropagation()
    event.preventDefault()

    event.target.removeAttribute('disabled')
  }
  const uploadFileDrop = (event) => {
    event.stopPropagation()
    event.preventDefault()

    const file = event.dataTransfer.files[0]
    wa.file_name = file.name
    const reader = new FileReader()
    reader.onload = async (ev) => {
      wa.arrayBuffer = ev.target.result
      wa.a_ctx = new AudioContext()
      console.log(`[message] ${file.name} is loaded.`)
      wa.source = await decodeAudioDataPromise(wa)
      start_stop_button.innerHTML = `▶ Start : ${wa.file_name}`
      toggle_button_disable(start_stop_button)
      toggle_button_disable(playback_rate)
      loadaudio_button.innerHTML = 'Reload Page To Change Music'
    }
    reader.readAsArrayBuffer(file)
  }

  const main = () => {
    // Init UI
    toggle_button_disable(start_stop_button)
    toggle_button_disable(seek_bar)
    toggle_button_disable(playback_rate)

    //
    seek_bar.addEventListener('input', async (event) => {
      if (typeof wa.source.buffer.duration !== undefined) {
        const duration = wa.source.buffer.duration
        const seek_position = duration * event.target.value / 100
        wa.a_ctx_paused_time = seek_position
        const [hour, min, sec, msec] = convTimeFormatFromSec(seek_position)
        seek_bar_text.innerHTML = `${hour}:${min}:${sec}:${msec}`
      }
    })

    //
    playback_rate.addEventListener('input', async (event) => {
      playback_rate_text.innerHTML = (Number(event.target.value)).toFixed(2)
    })
    playback_rate.addEventListener('change', async (event) => {
      start_stop_button.innerHTML = `Processing ${wa.file_name}...`
      toggle_button_disable(start_stop_button)
      toggle_button_disable(seek_bar)
      toggle_button_disable(playback_rate)
      wa.source = await decodeAudioDataStretchPromise(wa, event.target.value, false)
      start_stop_button.innerHTML = `▶ Start : ${wa.file_name}`
      toggle_button_disable(start_stop_button)
      toggle_button_disable(seek_bar)
      toggle_button_disable(playback_rate)
    })

    //
    loadaudio_button.addEventListener('dragover', uploadFilDragOver, false);
    loadaudio_button.addEventListener('dragleave', uploadFilDragLeave, false);
    loadaudio_button.addEventListener('drop', uploadFileDrop, false);
    loadaudio_button.addEventListener('mousedown', async () => {
      toggle_button_disable(loadaudio_button)
      try {
        await allow_play()
        toggle_button_disable(start_stop_button)
        toggle_button_disable(playback_rate)
      } catch (err) {
        console.error(`[ERROR] loadaudio_button: msg=[${JSON.stringify(err)}]`)
      }
    })

    //
    start_stop_button.addEventListener('mousedown', async () => {
      if (!isPlaying) {
        toggle_button_disable(seek_bar)
        toggle_button_disable(playback_rate)
        start_stop_button.innerHTML = `■ Stop : ${wa.file_name}`
        wa.source.connect(wa.a_ctx.destination)
        wa.source.start(0, wa.a_ctx_paused_time + wa.a_ctx_start_time)
        setPausedTime()
        start_update_display_time(seek_bar_callback)
      } else {
        toggle_button_disable(start_stop_button)
        start_stop_button.innerHTML = `Processing : ${wa.file_name}...`
        setPausedTime()
        stop_update_display_time(seek_bar_callback)
        wa.source.stop(0)
        wa.source.buffer = null
        wa.source = await decodeAudioDataPromise(wa)
        start_stop_button.innerHTML = `▶ Start : ${wa.file_name}`
        toggle_button_disable(start_stop_button)
        toggle_button_disable(seek_bar)
        toggle_button_disable(playback_rate)
      }
      isPlaying = !isPlaying
    })
  }

  main()

})()


