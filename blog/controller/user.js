const { exec,escape } = require("../db/mysql.js")
const { encrypt } = require("../utils/encrypt.js")

const login = async (username, password)=>{
    username = escape(username)
    password = escape(encrypt(password))
    let sql = `
        select username, realname from users where
        username=${username} and password=${password}
    `
    let rows = await exec(sql)
    return rows[0] || {}
}

module.exports = {
    login
}