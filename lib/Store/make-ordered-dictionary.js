function makeOrderedDictionary(idGetter) {
    const dict = {};
    const list = [];

    const add = (item) => {
        const id = idGetter(item);
        if (dict[id]) {
            const idx = list.indexOf(dict[id]);
            if (idx >= 0) list.splice(idx, 1);
        }
        dict[id] = item;
        list.push(item);
        return true;
    };

    return {
        get: (id) => dict[id],
        all: () => list.slice(),
        add,
        update: (item) => {
            const id = idGetter(item);
            if (!dict[id]) return false;
            Object.assign(dict[id], item);
            return true;
        },
        remove: (item) => {
            const id = idGetter(item);
            const existing = dict[id];
            if (!existing) return false;
            delete dict[id];
            const idx = list.indexOf(existing);
            if (idx >= 0) list.splice(idx, 1);
            return true;
        },
        clear: () => {
            for (const k of Object.keys(dict)) delete dict[k];
            list.length = 0;
        },
        get length() { return list.length; }
    };
}

export default makeOrderedDictionary;
