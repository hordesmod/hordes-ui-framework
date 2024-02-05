import eventManager from "../../core/event"
import log from "../../core/logger"
import chatArticleParser from "../../core/parsers/chatArticle"
import ui from "../../core/ui"
import element from "../../core/widgets/element"

const chatTweaks = {
    name: "Chat Tweaks",
    description: "Different chat enhancements",
    state: {
        chatDark: 30,
        fontSize: 14,
        isShortChannel: 1,
        hideSupporterIcon: 1,
        isColoredNames: 1,
        width: 450,
        height: 240,
        darkenPvp: 1,
        pvpSide: 0,
        hideTime: 1,
        colorFaction: "#f68e7a",
        colorParty: "#2ed3f6",
        colorClan: "#ee960b",
        colorWhisper: "#ef3eff",
        colorGM: "#00ffa1",
        colorYell: "#d64417",
    },
    style: `
        .channelselect .btn:nth-child(7) {
            margin-left: auto;
        }

    `,
    settings: {
        chatDark: { control: "range", desc: "Chat Background", comment: "Adjust the transparency of the chat", step:10, onupdate: "updateChat" },
        fontSize: { control: "range", desc: "Font Size", comment: "Default: 14", min:12, max:24, onupdate: "updateChat" },
        isShortChannel: { control: "checkbox", desc: "Shorten channel names", comment: "Condense channel names to single letter", onupdate: "updateAllArticles" },
        hideSupporterIcon: { control: "checkbox", desc: "Remove supporter icons", comment: "Supporter icon remove", onupdate: "updateAllArticles" },
        isColoredNames: { control: "checkbox", desc: "Colored Names", comment: "Remove class icon", onupdate: "updateAllArticles" },
        width: { control: "range", desc: "Width", comment: "Default: 450", min:300, max:1000, onupdate: "updateChat" },
        height: { control: "range", desc: "Height", comment: "Default: 240", min:240, max:2000, onupdate: "updateChat" },
        darkenPvp: { control: "checkbox", desc: "Darken PVP", comment: "Reduces the brightness of PvP messages", onupdate: "updateAllArticles" },
        pvpSide: { control: "checkbox", desc: "Move PVP", comment: "Moves PvP messages to the right side", onupdate: "updateAllArticles" },
        hideTime: { control: "checkbox", desc: "Remove Time", comment: "Hide timestamps", onupdate: "updateAllArticles" },
        colorFaction: { control: "color", desc: "Faction", comment: "Faction channel color", default: "#f68e7a", onupdate: "updateAllArticles" },
        colorParty: { control: "color", desc: "Party", comment: "Party channel color", default: "#2ed3f6", onupdate: "updateAllArticles" },
        colorClan: { control: "color", desc: "Clan", comment: "Clan channel color", default: "#ee960b", onupdate: "updateAllArticles" },
        colorWhisper: { control: "color", desc: "Whisper", comment: "Whisper channel color", default: "#ef3eff", onupdate: "updateAllArticles" },
        colorGM: { control: "color", desc: "GM", comment: "GM channel color", default: "#00ffa1", onupdate: "updateAllArticles" },
        colorYell: { control: "color", desc: "Yell", comment: "Yell channel color", default: "#d64417", onupdate: "updateAllArticles" },

    },
    start() {
        eventManager.on("ui.chatPanel", this.uiHook, this)
        eventManager.on("ui.chatArticle", this.handleArticle, this)
        eventManager.on("ui.channelSelect", this.fixchannelSelect, this)
    },
    stop() {
    },
    uiHook(){
        this.fixAutocomplete()
        this.updateAllArticles()
        this.updateChat()
    },
    fixchannelSelect(channelSelect) {
        channelSelect.element.style.width = "100%"
        channelSelect.element.style.marginTop = "2px"
    },
    fixAutocomplete() {
        const chatInput = document.getElementById("chatinputelement")
        chatInput && chatInput.setAttribute("autocomplete", "off")
    },
    updateChat(){
        const chat = document.getElementById("chat")
        chat.style.background = `rgb(0 0 0 / ${this.state.chatDark}%)`
        chat.style.fontSize = `${this.state.fontSize}px`
        chat.parentNode.style.maxHeight = "100%"
        chat.parentNode.style.width = `${this.state.width}px`
        chat.parentNode.style.height = `${this.state.height}px`
    },
    updateAllArticles() {
        for (const article of ui.chatPanel.element.children) {
            this.handleArticle({obj:chatArticleParser(article)})
        }
    },
    handleArticle(chatArticle) {
        const obj = chatArticle.obj

        if (!obj?.channel) return

        const {article, channel, sender_supporter, sender_icon, sender_info, sender_name, text } = obj
        const { isShortChannel, hideSupporterIcon, isColoredNames, hideTime} = this.state
        const channelText = channel.innerText.toLowerCase()

        const setStyles = (element, styles) => element && Object.assign(element.style, styles)

        if (["faction", "party", "clan", "from", "to", "yell", "pvp"].includes(channelText)) {
            const isPvpChannel = channelText === "pvp";
            
            isPvpChannel && setStyles(article, {
                filter: this.state.darkenPvp ? "brightness(0.7)" : "",
                marginLeft: this.state.pvpSide ? "auto" : "",
                width: this.state.pvpSide ? "fit-content" : "",
            })

            setStyles(channel, {
                width: isShortChannel && (isPvpChannel ? "0" : "0.55em"),
                display: isShortChannel ? (isPvpChannel ? "none" : "inline-flex") : "",
                overflow: isShortChannel ? "hidden" : "",
                textOverflow: isShortChannel ? "ellipsis" : "",
                whiteSpace: isShortChannel ? "nowrap" : ""
            })

            if (sender_icon) {
                setStyles(sender_icon, { display: isColoredNames ? "none" : "" })
                setStyles(sender_info, { paddingLeft: isColoredNames && sender_info.innerText < 10 ? "10px" : "" })

                //1C51FF shaman more dark
                setStyles(sender_name, { color: isColoredNames ? ["#C7966F", "#21A9E1", "#98CE64", "#4f78ff"][sender_icon.attributes.src.nodeValue[17]] : "" })
            }


            setStyles(sender_supporter, { display: hideSupporterIcon ? "none" : "" })

        }

        obj.time.style.display = hideTime && "none" || "inline-block"

        const { colorFaction, colorParty, colorClan, colorWhisper, colorGM, colorYell } = this.state

        const colorMap = {
            faction: colorFaction,
            party: colorParty,
            clan: colorClan,
            to: colorWhisper,
            from: colorWhisper,
            gm: colorGM,
            yell: colorYell
        }

        setStyles(text, { color: colorMap[channelText] || "" })
    }


}

export default chatTweaks



