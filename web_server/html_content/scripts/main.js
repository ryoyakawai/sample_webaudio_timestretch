"use strict";

import { fetchAudio } from './loadaudio.js';

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
    console.log('Playback resumed successfully!')
    wa.arrayBuffer = await fetchAudio(_MP3_URL)
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
    const seek_bar = document.querySelector('#seek_bar')
    const seek_bar_val = document.querySelector('span#seek_bar_val')
    const seek_bar_text = document.querySelector('span#seek_bar_text')
    seek_bar.addEventListener('input', (event) => {
      //seek_bar_val.innerHTML = event.target.value
    })

    const loadaudio_button = document.querySelector('#loadaudio_button')
    loadaudio_button.addEventListener('mousedown', async () => {
      loadaudio_button.setAttribute('disabled', 'disabled')
      await allow_play()
      toggle_button.removeAttribute('disabled')
    })

    const setPausedTime = () => {
      wa.a_ctx_start_time = wa.a_ctx.currentTime - wa.a_ctx_start_time //- (SEEK_DURATION_MSEC/1000)
    }

    const seek_bar_callback = (current_position=0, duration=0) => {
      seek_bar.value = (100 * current_position/duration)
      let hour = ('00' + parseInt(current_position / 3600)).substr(-2)
      let min = ('00' + parseInt((current_position / 60) % 60)).substr(-2)
      let sec = ('00' + parseInt(current_position % 60)).substr(-2)
      let msec = (String(current_position).split('.').pop()).substr(0, 2)
      seek_bar_text.innerHTML=`${hour}:${min}:${sec}:${msec}`
    }
    const toggle_button = document.querySelector('#toggle_button')
    toggle_button.setAttribute('disabled', 'disabled')
    toggle_button.addEventListener('mousedown', async (event) => {
      if (!isPlaying) {
        toggle_button.innerHTML = '■ Stop'
        wa.source = wa.a_ctx.createBufferSource()
        await new Promise((resolve) => {
          wa.a_ctx.decodeAudioData(wa.arrayBuffer.slice(), (buf) => {
            wa.source.buffer = buf
            wa.source.loop = false;
            resolve()
          })
        })
        wa.source.connect(wa.a_ctx.destination)
        wa.source.start(0, wa.a_ctx_paused_time + wa.a_ctx_start_time)
      } else {
        toggle_button.innerHTML = '▶ Start'
        setPausedTime()
        wa.source.buffer = null
        wa.source.stop(0)
      }
      isPlaying = !isPlaying
      toggle_display_time(seek_bar_callback)
    })
  }


  main()

})()


