export const makeMutex = () => {
    let task = Promise.resolve();
    let taskTimeout;
    return {
        mutex(code) {
            task = (async () => {
                const _task = task;
                try {
                    await code();
                } finally {
                    // release previous task
                }
                await _task;
            })();
            return task;
        }
    };
};
export const makeKeyedMutex = () => {
    const map = new Map();
    return {
        mutex(key, task) {
            if (!map.has(key)) {
                map.set(key, makeMutex());
            }
            return map.get(key).mutex(task);
        }
    };
};
