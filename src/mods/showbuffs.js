import eventManager from "../core/event"
import element from "../core/widgets/element"
import ui from "../core/ui"

const showbuffs = {
    name: "Your Buffs Only",
    description: "Button for quick toggling \"Show your buffs only\"",
    start() {
        eventManager.on("ui.partyBtnbar", this.addBtn, this)
        eventManager.on("ui.settingsParent", this.toggleSetting, this)
        ui.partyBtnbar && this.addBtn(ui.partyBtnbar)
    },
    stop() {
        eventManager.off("ui.partyBtnbar", this.addBtn, this)
        this.btn = this.btn.remove()
    },
    btn: 0,
    change: 0,
    addBtn(partyBtnbar) {
        const status = localStorage.getItem("buffsHideIrrelevant") === "true"
        this.btn = element("div")
            .css(`btn border black text${status ? "green" : "grey"}`)
            .text("Buffs")
            .on("click", this.toggleBtn.bind(this))
        partyBtnbar.element.appendChild(this.btn.element)
    },
    toggleBtn() {
        this.btn.toggle("textgreen").toggle("textgrey")
        this.change = 1
        if (!ui.settingsParent.onScreen) {
            ui.syscog.element.click()
        }
        else {
            this.toggleSetting()
        }
    },
    toggleSetting() {
        if (this.change) {
            ui.settingsParent.element.children[0].children[1].children[0].children[0].children[0].click() //kek
            ui.settingsParent.element.children[0].children[1].children[0].children[1].children[1].children[59].click() //kek^2
            ui.syscog.element.click()
            this.change = 0
        }
    },
}

export default showbuffs