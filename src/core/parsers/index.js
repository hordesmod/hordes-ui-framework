import chatArticleParser from "./chatArticle"

class Parser {
    constructor() {
        this.chatArticle = chatArticleParser
    }
    get(name) {
        return this[name]
    }
}

const parser = new Parser()

export default parser