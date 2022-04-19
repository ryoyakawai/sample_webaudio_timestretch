# sample_webaudio_timestretch
Sample of playing Mp3 file with specifying start time.

## How to build and develor
``bash
$ npm install;

// for development
// these two commands must be run in different terminal
$ npm run serve;
$ npm run develop;

// build for development
$ npm run build;

// build for production
$ npm run build-prod;
```

## Directory Structure

```
├── dist
│   ├── index.html
│   ├── mp3
│   │   ├── README.md
│   │   └── eine.mp3
│   ├── scripts
│   │   └── bundle.js
│   └── styles
│       └── main.css
├── package-lock.json
├── package.json
├── src
│   └── scripts
│       ├── loadaudio.js
│       ├── main.js
│       └── mainlib.js
├── web_server
│   ├── index.js
│   └── server.js
└── webpack.config.js
```

# Author

**Ryoya Kawai**

* [github/ryoyakawai](https://github.com/ryoyakawai)

# License

Copyright © 2022, [Ryoya Kawai](https://github.com/ryoyakawai).
Released under the [The Apache License Version 2.0](LICENSE).

