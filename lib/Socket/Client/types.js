export class AbstractSocketClient {
    constructor(url, config) {
        this.url = url;
        this.config = config;
        this.isOpen = false;
        this.isClosing = false;
        this.isConnecting = false;
        this.isClosed = true;
    }
}
