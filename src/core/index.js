import config from "../config"

import apiManager from "./api"
import bootManager from "./boot"
import eventManager from "./event"
import keyManager from "./key"
import moduleManager from "./modules"
import profileManager from "./profile"
import settingsManager from "./settings"
import stateManager from "./state"
import storageManager from "./storage"
import styleManager from "./style"
import ui from "./ui"

class Core {
    constructor(){
        if (config.devMode) {
            Object.assign(window, {
                em: eventManager,
                api: apiManager,
                pm: profileManager,
                stm: storageManager,
                km: keyManager,
                sm: styleManager,
                st: stateManager,
                set: settingsManager,
                mm: moduleManager,
                ui: ui,
            })
        }
    }
    init() {
        const ufplayer = document.querySelector("#ufplayer")
        if(!ufplayer) {
            setTimeout(this.init.bind(this), 1)
        } else {
            this.initializeCoreModules()
            const body = document.body
            const observer = new MutationObserver((mutationsList, observer) => {
                mutationsList.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        // console.log(node, node.id)
                        if(node instanceof HTMLElement && node.matches(".layout")) {
                            ui.init()
                        }
                    })
                })
            })
            observer.observe(body, {childList: true})
        }
    }
    initializeCoreModules() {
        apiManager.init()
        bootManager.init()
        profileManager.init()
        if(!profileManager.playerName.endsWith("...")) {
            keyManager.init()
            styleManager.init()
            settingsManager.init()
            stateManager.init()
            moduleManager.init()
            ui.init()
            
            window.addEventListener("beforeunload", () => {
                stateManager.save()
            })
        } else {
            console.error("wrong profile found retrying...")
            setTimeout(this.initializeCoreModules.bind(this), 0)
        }
    }
}

const core = new Core()

export default core
