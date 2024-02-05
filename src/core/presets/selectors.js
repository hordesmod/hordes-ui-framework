const svelteObj = {
    skillsMenu: "svelte-12nd8ce",
    statsMenu: "svelte-ggsnc",
    chat: "svelte-16y0b84",
    bag: "svelte-1axz35n",
    settingsParent: "svelte-ntyx09"
}

const selectors = {
    "body": { selector: "body", bruteForce: true },
    "layout": {
        selector: ".layout", bruteForce: true,
    },
    "mainContainer": {
        selector: ".layout .container", bruteForce: true,
        observe:
            [
                "skillsMenuParent",
                "statsMenuParent",
                "settingsParent",
                "bagParent",
                "pvpParent",
                "interactParent",
                "requestParent",
                "itemParent"
            ]
    },
    "skillbar": { selector: "#skillbar", bruteForce: true },
    "expbar": { selector: "#expbar", bruteForce: true },
    "sysbtnbar": { selector: ".btnbar.svelte-133q4bd", bruteForce: true },
    "sysbag": { selector: "#sysbag", bruteforce: true },
    "syscog": { selector: "#syscog", bruteforce: true },
    "partyBtnbar": { selector: ".btnbar", bruteForce: true },
    "minimap": { selector: "#minimapcontainer", bruteForce: true },
    "chatPanel":
    {
        selector: "#chat", bruteForce: true,
        observe: [
            "chatArticle"
        ]
    },
    "chatArticle": { selector: "article", bruteForce: false, ignore: true },
    "chatInput": { selector: "#chatinput", bruteForce: true },
    "channelSelect": {selector: ".channelselect", bruteForce: true},
    "partyframes":
    {
        selector: ".partyframes", bruteForce: true,
        observe:
            [
                "partyGrid"
            ]
    },
    "targetframes":
    {
        selector: ".targetframes", bruteForce: true,
        observe:
            [
                "uftarget"
            ]
    },

    "requestParent": { selector: ".window-pos", bruteForce: false, wName: "request" },
    "interactParent": { selector: ".window-pos", bruteForce: false, wName: "interaction" },
    "itemParent": { selector: ".window-pos", bruteForce: false, wName: "item" },
    "bagParent": { selector: ".window-pos", bruteForce: false, wName: "inventory" },
    "skillsMenuParent": { selector: ".window-pos", bruteForce: false, wName: "skills" },
    "statsMenuParent": { selector: ".window-pos", bruteForce: false, wName: "character" },
    "settingsParent": { selector: ".window-pos", bruteForce: false, wName: "settings" },
    "pvpParent": { selector: ".window-pos", bruteForce: false, wName: "pvp" },
    "ufplayer": { selector: "#ufplayer", bruteForce: true },
    "uftarget": { selector: "#uftarget", bruteForce: false },
    "partyGrid": { selector: ".partyframes .grid", bruteForce: false, ignore: true }

}

export default selectors