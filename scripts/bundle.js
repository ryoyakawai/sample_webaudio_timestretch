(()=>{"use strict";const e=(e,t,a,r,n=!1)=>{var o=t.length/r,s=4096*r,i=new Kali(r);i.setup(e.sampleRate,a,n);for(var c=new Float32Array(Math.floor(o/a*r+1)),l=0,u=0,d=0,f=!1;u<c.length;){if(d%100==0&&console.log("Stretching",u/c.length),u+=i.output(c.subarray(u,Math.min(u+s,c.length))),l<t.length){var _=t.subarray(l,Math.min(l+s,t.length));l+=_.length,i.input(_),i.process()}else f||(i.flush(),f=!0);d++}return c},t=async(e={})=>{const t=e.a_ctx.createBufferSource(),a=e.arrayBuffer.slice();return new Promise((r=>{e.a_ctx.decodeAudioData(a,(e=>{t.buffer=e,t.loop=!1,console.log("[info] completed to load audio"),r(t)}))}))},a=(e=null)=>{Array.isArray(e)?e.forEach((t=>{t.disabled=!e.disabled})):e.disabled=!e.disabled},r=(e=0)=>[("00"+parseInt(e/3600)).substr(-2),("00"+parseInt(e/60%60)).substr(-2),("00"+parseInt(e%60)).substr(-2),String(e).split(".").pop().substr(0,2)],n="./mp3/eine.mp3",o={a_ctx:null,source:null,file_name:"",arrayBuffer:null,a_ctx_start_time:0,a_ctx_paused_time:0};let s=!1,i=0;const c=window.AudioContext||window.webkitAudioContext;(async()=>{const l=document.querySelector("input#seek_bar"),u=document.querySelector("span#seek_bar_text"),d=document.querySelector("button#loadaudio_button"),f=document.querySelector("button#start_stop_button"),_=document.querySelector("input#playback_rate"),p=document.querySelector("span#playback_rate_text"),g=()=>{o.a_ctx_start_time=o.a_ctx.currentTime-o.a_ctx_start_time},m=(e=0,t=0)=>{l.value=100*e/t;const[a,n,o,s]=r(e);u.innerHTML=`${a}:${n}:${o}:${s}`};a([f,l,_]),l.addEventListener("input",(async e=>{if(void 0!==typeof o.source.buffer.duration){const t=o.source.buffer.duration*e.target.value/100;o.a_ctx_paused_time=t;const[a,n,s,i]=r(t);u.innerHTML=`${a}:${n}:${s}:${i}`}})),_.addEventListener("input",(async e=>{p.innerHTML=Number(e.target.value).toFixed(2)})),_.addEventListener("change",(async t=>{f.innerHTML=`Processing ${o.file_name}...`,a([f,l,_]),o.source=await(async(t={},a=1,r=!0)=>{const n=t.a_ctx.createBufferSource(),o=t.arrayBuffer.slice();return new Promise((s=>{t.a_ctx.decodeAudioData(o,(o=>{console.log("[info] begin stretch and load audio");const i=o.getChannelData(0),c=o.getChannelData(1),l=e(t.a_ctx,i,parseFloat(a),1,r),u=e(t.a_ctx,c,parseFloat(a),1,r),d=t.a_ctx.createBuffer(2,l.length,t.a_ctx.sampleRate);d.getChannelData(0).set(l),d.getChannelData(1).set(u),n.buffer=d,n.loop=!1,console.log("[info] completed to strech and load audio"),s(n)}))}))})(o,t.target.value,!1),f.innerHTML=`▶ Start : ${o.file_name}`,a([f,l,_])})),d.addEventListener("dragover",(e=>{e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy",e.target.setAttribute("disabled","disabled")}),!1),d.addEventListener("dragleave",(e=>{e.stopPropagation(),e.preventDefault(),e.target.removeAttribute("disabled")}),!1),d.addEventListener("drop",(e=>{e.stopPropagation(),e.preventDefault();const r=e.dataTransfer.files[0];o.file_name=r.name;const n=new FileReader;n.onload=async e=>{o.arrayBuffer=e.target.result,o.a_ctx=new c,console.log(`[message] ${r.name} is loaded.`),o.source=await t(o),f.innerHTML=`▶ Start : ${o.file_name}`,a([f]),d.innerHTML="Reload Page To Change Music"},n.readAsArrayBuffer(r)}),!1),d.addEventListener("mousedown",(async()=>{a(d);try{await(async()=>{o.a_ctx=new c;try{o.arrayBuffer=await(async(e=null)=>{if(null==e)throw new Error(`[ERROR] fetchAudio: File Path is not Defined. file_location=[${e}]`);try{const t=await fetch(e);return await t.arrayBuffer()}catch(t){throw new Error(`[ERROR] fetchAudio: Something Occured during fetchg file. file_location=[${e}]`)}})(n),o.file_name=n.split("/").pop(),f.innerHTML=`▶ Start : ${o.file_name}`,console.log(`[message] ${n} is loaded.`),o.source=await t(o),a(l),d.innerHTML="🔄 Reload Page To Change Music"}catch(e){console.error(`[ERROR] allow_play: msg=[${JSON.stringify(e)}]`)}})(),a([f,_])}catch(e){console.error(`[ERROR] loadaudio_button: msg=[${JSON.stringify(e)}]`)}})),f.addEventListener("mousedown",(async()=>{s?(a(f),f.innerHTML=`Processing : ${o.file_name}...`,g(),clearInterval(i),o.source.stop(0),o.source.buffer=null,o.source=await t(o),f.innerHTML=`▶ Start : ${o.file_name}`,a([f,l,_])):(a([l,_]),f.innerHTML=`■ Stop : ${o.file_name}`,o.source.connect(o.a_ctx.destination),o.source.start(0,o.a_ctx_paused_time+o.a_ctx_start_time),g(),((e=(()=>{}))=>{i=setInterval((()=>{if(null!==o.source.buffer){const t=o.source.buffer.duration.toFixed(2),a=(o.a_ctx_paused_time+o.a_ctx.currentTime-o.a_ctx_start_time).toFixed(4);e(a,t)}}),30)})(m)),s=!s}))})()})();