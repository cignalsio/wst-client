# WebSocket Time Protocol (WST) Client

A simple client implementation of the WebSocket Time Protocol (WST) in JavaScript, based on the work by M. Gutbrod, et al. in [A light-weight time protocol based on common web standards](https://uhr.ptb.de/wst/paper).

Used on and sponsored by [Cignals footprint charts](https://cignals.io/) cryptocurrency charting platform.

## Install

```bash
node add wst-client
```

## Example

```javascript
const wst = new WST("ws://127.0.0.1:8080/wst")
wst.onmessage = (message, data) => {
    console.log(message, data)
}
wst.start()
```
