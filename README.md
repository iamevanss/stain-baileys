# @stain/baileys

**Stain Baileys** — Custom WhatsApp Web API built on Baileys.

A powerful, feature-rich fork focused on stability, advanced messaging, and modern store options.

> **Not affiliated with WhatsApp or Meta.** Use at your own risk. Do not use for spam.

---

## Features

### Core
- Multi-device support
- QR login
- Pairing code (including custom 8-character codes)
- Session self-healing / better reconnection
- Reduced proto size
- **WhatsApp Rust Bridge** integration (`whatsapp-rust-bridge@^0.5.4`)
- `jimp` support for image processing

### Messaging & UX
- Advanced **message-builder**
- `richMenu` (buttons + carousel + image header + open-URL)
- `sendHtml`
- Device targeting: `participant` / `isSecret` / `protected`
- Albums, Polls, Quizzes, Products, Orders, Payments, Events
- Newsletter / Channel support

### Extra Socket Layers
- `communities`
- `interop`
- `privacy`
- `graphql`
- `newsletter`
- `mex`
- `luxu`

### Store & Auth
- `makeInMemoryStore` + file persistence
- Cache-manager store
- SQL auth support

---

## Installation

```bash
npm install @stain/baileys
# or
yarn add @stain/baileys
```

### Drop-in replacement for official Baileys

```json
{
  "dependencies": {
    "@whiskeysockets/baileys": "npm:@stain/baileys",
    "jimp": "^1.6.1",
    "whatsapp-rust-bridge": "^0.5.4"
  }
}
```

Or install directly:

```json
{
  "dependencies": {
    "@stain/baileys": "latest",
    "jimp": "^1.6.1",
    "whatsapp-rust-bridge": "^0.5.4"
  }
}
```

---

## Quick Start

### QR Login

```js
import makeWASocket, { useMultiFileAuthState, Browsers } from '@stain/baileys'
import pino from 'pino'

const { state, saveCreds } = await useMultiFileAuthState('auth_info_stain')

const sock = makeWASocket({
  auth: state,
  browser: Browsers.ubuntu('Chrome'),
  logger: pino({ level: 'silent' }),
  printQRInTerminal: true
})

sock.ev.on('creds.update', saveCreds)
```

### Pairing Code (custom 8-char supported)

```js
const sock = makeWASocket({
  auth: state,
  printQRInTerminal: false
})

if (!sock.authState.creds.registered) {
  const phoneNumber = '628XXXXXXXXXX' // country code + number, no +
  const code = await sock.requestPairingCode(phoneNumber)
  // custom code:
  // const code = await sock.requestPairingCode(phoneNumber, 'STAIN123')
  console.log('Pairing code:', code)
}
```

---

## Store Examples

```js
import { makeInMemoryStore } from '@stain/baileys'

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent' }) })
store.bind(sock.ev)

// Auto-save every 10s
const stop = store.writeToFileInterval('./stain-store.json')
```

---

## License

MIT — Based on [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) and community forks (wbails, vansnowi, etc.).

---

**Author:** Stain (`iamevanss`)  
**Contact:** https:t.me/heisevanss
