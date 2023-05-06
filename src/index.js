export class WST {
  constructor(url = "ws://127.0.0.1:8080/wst", period = 10000) {
    this.url = url
    this.period = period
    this.data = { latency: null, drift: null }
    this.onmessage = null
    this.socket = null
    this.connectRetries = 0
    this.timer = null
  }

  connect() {
    this.socket = new WebSocket(this.url);

    if (this.socket == null) {
      throw `Cannot create WebSocket connection to ${this.url}`
    }

    this.socket.onopen = (_e) => {
      this.connectRetries = 0
      this.send()
      this.timer = setInterval(() => { this.send() }, this.period)
    }

    this.socket.onerror = (_e) => {
      this.reconnect()
    }

    this.socket.onclose = (_e) => {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }

    this.socket.onmessage = (e) => {
      const now = new Date().getTime()
      const data = JSON.parse(e.data)

      const delta = now - data.c
      const drift = (now + data.c) / 2 - data.s

      this.data = {
        latency: delta,
        drift: drift
      }

      if (this.onmessage != null) {
        this.onmessage(data, this.data)
      }
    }
  }

  reconnect() {
    const delay = Math.pow(2, this.connectRetries)
    // console.debug(`WebSocket failed, reconnecting in ${delay}ms`)

    setTimeout(() => {
      this.connectRetries += 1
      this.connect()
    }, delay)
  }

  start() {
    this.connect()
  }

  send() {
    if (this.socket != null && this.socket.readyState == 1) {
      const msg = { c: new Date().getTime() }
      this.socket.send(JSON.stringify(msg))
    }
  }
}
