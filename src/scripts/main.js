"use strict";

import { fetchAudio, decodeAudioDataPromise } from './loadaudio.js';
import { convTimeFormatFromSec, toggle_button_disable } from './mainlib.js';

const _MP3_URL = './mp3/eine.mp3';
const SEEK_DURATION_MSEC = 30
const wa = {
  a_ctx: null,
  source: null,
  arrayBuffer: null,
  a_ctx_start_time: 0,
  a_ctx_paused_time: 0
};
let isPlaying = false;
let seekTimerId = 0;

const AudioContext = window.AudioContext || window.webkitAudioContext;

(async () => {
  // Get UI elements
  const seek_bar = document.querySelector('#seek_bar')
  const seek_bar_text = document.querySelector('span#seek_bar_text')
  const loadaudio_button = document.querySelector('#loadaudio_button')
  const start_stop_button = document.querySelector('#start_stop_button')

  // Init UI
  toggle_button_disable(start_stop_button)
  toggle_button_disable(seek_bar)

  const allow_play = async () => {
    wa.a_ctx = new AudioContext()
    try {
      wa.arrayBuffer = await fetchAudio(_MP3_URL)
    } catch (err) {
      console.error(`[ERROR] allow_play: msg=[${JSON.stringify(err)}]`)
    }
    console.log(`[message] ${_MP3_URL} is loaded.`)
    wa.source = await decodeAudioDataPromise(wa)
    toggle_button_disable(seek_bar)
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

  const main = () => {
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
    loadaudio_button.addEventListener('mousedown', async () => {
      toggle_button_disable(loadaudio_button)
      try {
        await allow_play()
      } catch (err) {
        console.error(`[ERROR] loadaudio_button: msg=[${JSON.stringify(err)}]`)
      }
      toggle_button_disable(start_stop_button)
    })

    //
    start_stop_button.addEventListener('mousedown', async () => {
      if (!isPlaying) {
        toggle_button_disable(seek_bar)
        start_stop_button.innerHTML = '■ Stop'
        wa.source.connect(wa.a_ctx.destination)
        wa.source.start(0, wa.a_ctx_paused_time + wa.a_ctx_start_time)
        setPausedTime()
        start_update_display_time(seek_bar_callback)
      } else {
        toggle_button_disable(start_stop_button)
        start_stop_button.innerHTML = '- - - -'
        setPausedTime()
        stop_update_display_time(seek_bar_callback)
        wa.source.stop(0)
        wa.source.buffer = null
        wa.source = await decodeAudioDataPromise(wa)
        toggle_button_disable(start_stop_button)
        start_stop_button.innerHTML = '▶ Start'
        toggle_button_disable(seek_bar)
      }
      isPlaying = !isPlaying
    })
  }

  main()

})()


