import WebSocket from 'ws';
import { AbstractSocketClient } from './types.js';

export class WebSocketClient extends AbstractSocketClient {
    constructor(url, config) {
        super(url, config);
        this.socket = null;
    }

    get isOpen() {
        return this.socket?.readyState === WebSocket.OPEN;
    }
    get isClosed() {
        return this.socket === null || this.socket?.readyState === WebSocket.CLOSED;
    }
    get isClosing() {
        return this.socket === null || this.socket?.readyState === WebSocket.CLOSING;
    }
    get isConnecting() {
        return this.socket === null || this.socket?.readyState === WebSocket.CONNECTING;
    }

    connect() {
        if (this.socket) return;
        this.socket = new WebSocket(this.url, {
            origin: this.config.origin,
            headers: this.config.headers,
            handshakeTimeout: this.config.connectTimeoutMs,
            agent: this.config.agent
        });

        this.socket.setMaxListeners(0);

        const events = ['close', 'error', 'message', 'open', 'ping', 'pong', 'unexpected-response'];
        for (const event of events) {
            this.socket?.on(event, (...args) => this.emit(event, ...args));
        }
    }

    close() {
        this.socket?.close();
        this.socket = null;
    }

    send(data, opts) {
        this.socket?.send(data, opts);
    }
}
