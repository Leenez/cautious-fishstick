const config = require("../config");
const api_key = config.chatgpt_key
const { Configuration, OpenAIApi } = require('openai')

const openai = new OpenAIApi(new Configuration({
    apiKey: api_key
}))

const askReply = async (chatPost) => {
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: `Imagine that you are a person in public chat and someone posts a message. Give a fun reply to following message: ${chatPost}` 
            },],
        });
        const reply = completion.data.choices[0].message.content
        return reply
    } catch(err) {
        return {"Message":"ChatGPT error"}
    }
}

module.exports = {askReply};