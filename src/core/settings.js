import eventManager from "./event";
import keyManager from "./key";
import log from "./logger";
import moduleManager from "./modules";
import styleManager from "./style";
import element from "./widgets/element";

class SettingsManager {
    constructor() {
        this.menu = {
            mod: {
                name: "[KEK] Mods",
                callback: "showMods"
            },
            key: {
                name: "[KEK] Hotkeys",
                callback: "showModKeys"
            },
            set: {
                name: "[KEK] Settings",
                callback: "showModSettings"
            },
            pro: {
                name: "[KEK] Pro",
                callback: "showPro"
            },
        }
    }
    init() {
        eventManager.on("ui.settingsParent", this.inject.bind(this))

        styleManager.add(`
            .kek-settings {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: 8px;
                align-items: center;
            }
            .kek-settings.mods{
                grid-template-columns: 4fr 1fr;
            }
            .title-grid{
                display: grid;
                grid-template-columns: auto 1fr;
                grid-gap: 8px;
                align-items: center;
            }
            .kek-settings .color {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 10px;
                justify-content: center;
                align-items: center;
            }
            .sticky {
                position: sticky;
                top: 0;
                background-color: #10131d;
            }
        `)
    }

    inject(wnd) {
        const settings = wnd.element.children[0].children[1].children[0]

        this.panel = element("div").css("menu panel-black scrollbar").style({ display: "none", paddingLeft: "12px", paddingTop: 0 }).text("test")
        settings.appendChild(this.panel.element)

        let settingsMenu = settings.children[0]
        let settingsPanel = settings.children[1]

        for (const [key, value] of Object.entries(this.menu)) {
            const menuName = element("div").css("choice").text(value.name).data("id", key)
            settingsMenu.appendChild(menuName.element)
        }

        settingsMenu.addEventListener("mouseup", e => {
            if (e.target.className !== "choice") return

            settingsMenu.childNodes.forEach(e => e.classList.remove("active"))
            if (e.target.dataset.id) {
                e.target.classList.add("active")
                settingsPanel.style.display = "none"
                this.panel.style({ display: "block" })
                this[this.menu[e.target.dataset.id].callback]()
            }
            else {
                settingsPanel.style.display = "block"
                this.panel.style({ display: "none" })
            }
        })
    }
    showMods() {
        const title = element("h3").css("textprimary").text("KEK mods")
        const settings = element("div").css("kek-settings mods")
        this.panel
            .clear()
            .add(title)
            .add(settings)

        for (const mod of moduleManager) {
            const modName = element("div").css("").text(mod.name)

            modName.add(element("br"))
            modName.add(element("small").css("textgrey").text(mod.description || "<no description>"))

            settings.add(modName)

            const modField = element("div").css(`btn checkbox${moduleManager.status(mod.name) && " active" || ""}`)
                .on("click", () => {
                    moduleManager.toggle(mod.name)
                    modField.toggle("active")
                })
            settings.add(modField)
        }
    }
    showModKeys() {
        const title = element("h3").css("textprimary").text("KEK Hotkeys")
        const settings = element("div").css("kek-settings")
        this.panel
            .clear()
            .add(title)
            .add(settings)

        for (const [modName, objs] of keyManager) {

            if (moduleManager.get(modName)._enabled) {
                const modTitle = element("div").css("textprimary").text(modName)
                settings.add(modTitle).add(element("div"))

                for (const keyDescription in objs) {
                    if (Object.prototype.hasOwnProperty.call(objs, keyDescription)) {
                        const fieldName = element("div").text(keyDescription)

                        const fieldControl = element("input").type("text").value(objs[keyDescription]).attr("maxlength", 1)
                            .on("keyup", e => {
                                e.target.value = e.key.toLowerCase()
                                keyManager.updateKey(modName, keyDescription, e.target.value)
                            })
                        settings.add(fieldName).add(fieldControl)
                    }
                }
            }
        }
    }

    showPro() {
        const titleGrid = element("div").css("title-grid sticky")

        const title = element("h3").css("textprimary").text("KEK Profiles")

        const modSelectContainer = element("div").css("panel-black")
        const modSelect = element("select").css("btn grey")
            .on("change", e => {
                const selectedOption = document.getElementById(e.target.value)
                const scrollableElement = this.panel.element

                if (selectedOption) {
                    const offset = -90
                    const targetPosition = selectedOption.offsetTop + offset

                    scrollableElement.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    })
                }

            })
            
        modSelectContainer.add(modSelect)

        titleGrid.add(title).add(modSelectContainer)

        this.settings = element("div").css("kek-settings")

        this.panel
            .clear()
            .add(titleGrid)
            .add(this.settings)
    }

    showModSettings() {
        const titleGrid = element("div").css("title-grid sticky")

        const title = element("h3").css("textprimary").text("KEK Settings")

        const modSelectContainer = element("div").css("panel-black")
        const modSelect = element("select").css("btn grey")
            .on("change", e => {
                const selectedOption = document.getElementById(e.target.value)
                const scrollableElement = this.panel.element

                if (selectedOption) {
                    const offset = -90
                    const targetPosition = selectedOption.offsetTop + offset

                    scrollableElement.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    })
                }

            })

        modSelectContainer.add(modSelect)

        titleGrid.add(title).add(modSelectContainer)

        this.settings = element("div").css("kek-settings")

        this.panel
            .clear()
            .add(titleGrid)
            .add(this.settings)

        for (const mod of moduleManager) {
            if (mod._enabled && mod.settings) {

                const modOption = element("option").attr("value", mod.name).text(mod.name)
                modSelect.add(modOption)

                const modTitle = element("div").css("textprimary").text(mod.name).attr("id", mod.name)
                this.settings.add(modTitle).add(element("div"))

                for (const [fieldName, field] of Object.entries(mod.settings)) {
                    this.makeField(mod, fieldName, field)
                }

                // empty line
                this.settings.add(element("br")).add(element("div"))

            }
        }

    }

    makeField(mod, fieldName, field) {
        // log(mod.state, fieldName, field)

        const fieldValue = element("div").text(field.desc)

        let control

        if (field.control === "checkbox") {
            control = element("div")
                .css(`btn checkbox${mod.state[fieldName] ? " active" : ""}`)
                .on("pointerup", e => {
                    if (e.button === 0) {
                        e.target.classList.toggle("active")
                        mod.state[fieldName] ^= 1
                        field.onupdate && mod[field.onupdate]()
                    }
                })
        }
        else if (field.control === "range") {

            let cur = element("span").css("textgrey").text(mod.state[fieldName])

            fieldValue.element.appendChild(document.createTextNode(" "))
            fieldValue.add(cur)

            control = element("input").type("range").value(mod.state[fieldName])

            control.element.step = field.step || 1
            control.element.min = field.min || 0
            control.element.max = field.max || 100

            control.on("input", e => {
                cur.text(e.target.value)
                mod.state[fieldName] = e.target.value
                field.onupdate && mod[field.onupdate]()
            })
        }
        else if (field.control === "text") {
            control = element("input").type("text").value(mod.state[fieldName])
            control.on("input", e => {
                mod.state[fieldName] = e.target.value
                field.onupdate && mod[field.onupdate]()
            })
        }
        else if (field.control === "number") {
            control = element("input").type("number").value(mod.state[fieldName])
            control.on("input", e => {
                mod.state[fieldName] = parseInt(parseFloat(e.target.value))
                field.onupdate && mod[field.onupdate]()
            })
        }
        else if (field.control === "select") {
            control = element("select")

            for (let [v, t] of Object.entries(field.options)) {
                let option = element("option").value(v).selected(v == mod.state[fieldName]).text(t)
                control.add(option)
            }
            control.on("change", e => {
                mod.state[fieldName] = e.target.value
                field.onupdate && mod[field.onupdate]()
            })
        }
        else if (field.control === "info") {
            control = element("span").text(mod.state[fieldName])
        }
        else if (field.control === "color") {
            control = element("div").css("color")
            const colorpicker = element("input").type("color").value(mod.state[fieldName])
                .on("input", e => {
                    mod.state[fieldName] = e.target.value
                    field.onupdate && mod[field.onupdate]()
                })
            const reset = element("div").css("btn black").text("default color").style({ color: field.default })
                .on("click", () => {
                    colorpicker.element.value = field.default
                    mod.state[fieldName] = field.default
                    field.onupdate && mod[field.onupdate]()
                })
            control.add(colorpicker).add(reset)
        }
        else {
            control = element("div").text(field.control)
        }

        if (field.comment) {
            fieldValue.add(element("br"))
            fieldValue.add(element("small").css("textgrey").text(field.comment))
        }
        this.settings.add(fieldValue)


        this.settings.add(control)


    }
}

const settingsManager = new SettingsManager()

export default settingsManager