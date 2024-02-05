import moduleManager from "./modules"
import eventManager from "./event"
import stateManager from "./state"
import log from "./logger"

class Cache {
    constructor(type = "queue", max = Infinity) {
        this.cache = []
        this.cacheType = this.mapCacheType(type)
        this.maxSize = max
    }

    mapCacheType(type) {
        const typeLowerCase = type.toLowerCase()
        const typeMap = {
            "queue": 0,
            "stack": 1,
        }

        if (typeMap.hasOwnProperty(typeLowerCase)) {
            return typeMap[typeLowerCase]
        } else {
            throw new Error("Invalid cache type")
        }
    }

    addItem(item) {
        const cacheOperations = {
            0: (cache, item) => cache.unshift(item),  // Queue
            1: (cache, item) => cache.push(item),     // Stack
        }
        if (this.cache.length >= this.maxSize) {
            this.removeItem()
        }
        const operation = cacheOperations[this.cacheType]
        if (!operation) {
            throw new Error("Invalid cache type!")
        }
        operation(this.cache, item)
    }

    removeItem() {
        const cacheOperations = {
            0: (cache, item) => cache.pop(item),  // Queue
            1: (cache, item) => cache.shift(item),     // Stack
        }
        if (this.cache.length === 0) {
            return null
        }
        const operation = cacheOperations[this.cacheType]
        if (!operation) {
            throw new Error("Invalid cache type!")
        }
        return operation(this.cache)
    }

    getItems() {
        return [...this.cache]
    }

    getSize() {
        return this.cache.length
    }
}

class CacheManager {
    #registry = {}
    constructor() {
        stateManager.register("cache")
        eventManager.on("state.load", this.onLoad, this)
        eventManager.on("state.save", this.onSave, this)
    }


}

const cacheManager = new CacheManager()

export default cacheManager