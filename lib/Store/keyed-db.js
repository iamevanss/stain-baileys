export default class KeyedDB {
    constructor(key, idGetter) {
        this.key = key;
        this.idGetter = idGetter;
        this.dict = {};
        this.list = [];
    }

    get(id) {
        return this.dict[id];
    }

    all() {
        return this.list.slice();
    }

    upsert(item) {
        const id = this.idGetter(item);
        const existing = this.dict[id];
        if (existing) {
            const idx = this.list.indexOf(existing);
            if (idx >= 0) this.list.splice(idx, 1);
        }
        this.dict[id] = item;
        this.list.push(item);
        this.list.sort((a, b) => this.key.compare(this.key.key(a), this.key.key(b)));
        return !!existing;
    }

    remove(item) {
        const id = this.idGetter(item);
        const existing = this.dict[id];
        if (!existing) return false;
        delete this.dict[id];
        const idx = this.list.indexOf(existing);
        if (idx >= 0) this.list.splice(idx, 1);
        return true;
    }

    clear() {
        this.dict = {};
        this.list = [];
    }

    get length() {
        return this.list.length;
    }
}
