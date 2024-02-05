import eventManager from "../../core/event"
import log from "../../core/logger"
import profileManager from "../../core/profile"
import ui from "../../core/ui"

const expbar = {
    name: "Expbar Tweaks",
    description: "Hide experience bar",
    state: {
        lvl: false
    },
    settings: {
        lvl: { control: "checkbox", desc: "Level 45 only", comment: "Show expbar for low levels.", onupdate: "handle"},
    },
    start() {
        eventManager.on("ui.expbar", this.handle, this)
        ui.expbar?.element && this.handle()
    },
    stop() {
        log(stop)
        eventManager.off("ui.expbar", this.handle, this)
        ui.expbar.element.style.display = "block"
    },
    handle(expbar) {
        expbar = expbar.element
        const shouldHideExpBar = profileManager.playerLevel !== 45 && !this.state.lvl
        expbar.style.display = shouldHideExpBar ? "none" : "block"
    },
}

export default expbar