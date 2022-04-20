"use strict";

import {fetchAudio, decodeAudioDataPromise} from './loadaudio.js';
import {convTimeFormatFromSec} from './mainlib.js';

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
  const allow_play = async () => {
    wa.a_ctx = new AudioContext()
    try {
      wa.arrayBuffer = await fetchAudio(_MP3_URL)
    } catch (err) {
      console.error(`[ERROR] allow_play: msg=[${JSON.stringify(err)}]`)
    }
    console.log(`[message] ${_MP3_URL} is loaded.`)
    await decodeAudioDataPromise(wa)
    seek_bar.removeAttribute('disabled')
  }

  const toggle_display_time = (callback = () => {}) => {
    if (isPlaying) {
      seekTimerId = setInterval( () => {
        if (wa.source.buffer !== null) {
          const duration = wa.source.buffer.duration.toFixed(2)
          const current_position = (wa.a_ctx_paused_time + wa.a_ctx.currentTime - wa.a_ctx_start_time).toFixed(4)
          callback(current_position, duration)
        }
      }, SEEK_DURATION_MSEC)
    } else {
      clearInterval(seekTimerId)
    }
  }

  const main = () => {
    // Get UI elements
    const seek_bar = document.querySelector('#seek_bar')
    const seek_bar_text = document.querySelector('span#seek_bar_text')
    const loadaudio_button = document.querySelector('#loadaudio_button')
    const toggle_button = document.querySelector('#toggle_button')

    // Init UI
    toggle_button.setAttribute('disabled', 'disabled')
    seek_bar.setAttribute('disabled', 'disabled')

    const setPausedTime = () => {
      wa.a_ctx_start_time = wa.a_ctx.currentTime - wa.a_ctx_start_time
    }

    const seek_bar_callback = (current_position = 0, duration = 0) => {
      seek_bar.value = (100 * current_position/duration)
      const [hour, min, sec, msec] = convTimeFormatFromSec(current_position)
      seek_bar_text.innerHTML=`${hour}:${min}:${sec}:${msec}`
    }

    //
    seek_bar.addEventListener('input', async (event) => {
      const duration = wa.source.buffer.duration
      const seek_position = duration * event.target.value/100
      wa.a_ctx_paused_time = seek_position
      const [hour, min, sec, msec] = convTimeFormatFromSec(seek_position)
      seek_bar_text.innerHTML=`${hour}:${min}:${sec}:${msec}`
    })

    //
    loadaudio_button.addEventListener('mousedown', async () => {
      loadaudio_button.setAttribute('disabled', 'disabled')
      try {
        await allow_play()
      } catch (err) {
        console.error(`[ERROR] allow_play: msg=[${JSON.stringify(err)}]`)
      }
      toggle_button.removeAttribute('disabled')
    })

    //
    toggle_button.addEventListener('mousedown', async () => {
      if (!isPlaying) {
        seek_bar.setAttribute('disabled', 'disabled')
        toggle_button.innerHTML = '■ Stop'
        await decodeAudioDataPromise(wa)
        wa.source.connect(wa.a_ctx.destination)
        wa.source.start(0, wa.a_ctx_paused_time + wa.a_ctx_start_time)
        setPausedTime()
      } else {
        toggle_button.innerHTML = '▶ Start'
        setPausedTime()
        seek_bar.removeAttribute('disabled')
        wa.source.stop(0)
        //wa.source.buffer = null
      }
      isPlaying = !isPlaying
      toggle_display_time(seek_bar_callback)
    })
  }

  main()

})()


