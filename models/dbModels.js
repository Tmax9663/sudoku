let db = require('../data/db')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const dbFile='./data/db.json';

function writeDataToFile(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content,null,4), 'utf8', (err) => {
        if(err) {
            console.log(err)
        }
    })
}

function findAll() {
    return new Promise((resolve, reject) => {
        db.sort((a, b) => parseInt(b.score) - parseInt(a.score));
        resolve(db)
    })
}

function findById(id) {
    return new Promise((resolve, reject) => {
        const Data = db.find((p) => p.id === id)
        resolve(Data)
    })
}

function create(Data) {
    return new Promise((resolve, reject) => {
        const newData = {id: uuidv4(), ...Data}    
        db.push(newData)
        if (process.env.NODE_ENV !== 'test') {
            writeDataToFile(dbFile, db);
        }
        resolve(newData)
    })
}

function update(id, Data) {
    return new Promise((resolve, reject) => {
        const index = db.findIndex((p) => p.id === id)
        db[index] = {id, ...Data}
        if (process.env.NODE_ENV !== 'test') {
            writeDataToFile(dbFile, db);
        }
        resolve(db[index])
    })
}

function remove(id) {
    return new Promise((resolve, reject) => {
        db = db.filter((p) => p.id !== id)
        if (process.env.NODE_ENV !== 'test') {
            writeDataToFile(dbFile, db);
        }
        resolve(db);
    })
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
}