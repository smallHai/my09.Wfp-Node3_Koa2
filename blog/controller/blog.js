const xss = require("xss")
const { exec } = require("../db/mysql.js")

const getList = async (author, keyword)=>{
    let sql = `select * from blogs where 1=1 ` //1=1为了避免author和keyword都无值会出错
    if(author){
        sql += `and author="${author}" `
    }
    if(keyword){
        sql += `and title like "%${keyword}%" `
    }
    sql += `order by createtime desc;`
    return await exec(sql)
}

const getDetail = async (id)=>{
    let sql = `select * from blogs where 1=1 and id="${id}" `
    let rows = await exec(sql)
    return rows[0]
}

const addBlog = async (data={})=>{
    let title = xss(data.title)
    let content = data.content
    let author = data.author
    let createtime = Date.now()
    let sql = `
        insert into blogs (title,content,author,createtime)
        values ("${title}","${content}","${author}","${createtime}")
    `
    let insertData = await exec(sql)
    return { id: insertData.insertId }
}

const updateBlog = async (id, data={})=>{
    let title = data.title
    let content = data.content
    let sql = `update blogs set title="${title}", content="${content}" where id="${id}" `
    let updateData = await exec(sql)
    if(updateData.affectedRows >0){
        return true
    }else{
        return false
    }
}

const deleteBlog = async (id, author)=>{
    let sql = `delete from blogs where id="${id}" and author="${author}" `
    let deleteData = await exec(sql)
    if(deleteData.affectedRows >0){
        return true
    }else{
        return false
    }
}


module.exports = {
    getList,
    getDetail,
    addBlog,
    updateBlog,
    deleteBlog
}