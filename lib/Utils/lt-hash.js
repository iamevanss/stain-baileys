const { createHash } = await import('crypto');

export class LTHash {
    constructor() {
        this.hash = Buffer.alloc(128);
    }

    subtractThenAdd(oldPoints, newPoints) {
        for (const p of oldPoints) this.subtract(p);
        for (const p of newPoints) this.add(p);
        return this;
    }

    add(buf) {
        const h = createHash('sha512').update(buf).digest();
        for (let i = 0; i < 128; i++) {
            this.hash[i] = (this.hash[i] + h[i]) & 0xff;
        }
        return this;
    }

    subtract(buf) {
        const h = createHash('sha512').update(buf).digest();
        for (let i = 0; i < 128; i++) {
            this.hash[i] = (this.hash[i] - h[i] + 256) & 0xff;
        }
        return this;
    }

    finish() {
        return Buffer.from(this.hash);
    }
}

export default LTHash;
