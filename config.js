const config = {
    mongo_url:process.env.MONGODB_URL,
    mongo_user:process.env.MONGODB_USER,
    mongo_password:process.env.MONGODB_PASSWORD,
    chatgpt_key:process.env.CHATGPT_KEY,
    database:"chatdatabase",
    time_to_live_diff:3600000,
    // server_port:3001,
}

module.exports = config

