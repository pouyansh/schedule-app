const db = require('electron-db')
const path = require('path')
const fs = require('fs')
const data_location = path.join(__dirname, '/data')

class Repository {
  constructor (db_name) {
    this.db_name = db_name
  }

  createTable() {
    if(!fs.existsSync(data_location + '/' + this.db_name + ".json"))
      db.createTable(this.db_name, data_location, (succ, msg) => {console.log("Message: " + succ + msg);})
  }

  create(item) {
    db.insertTableContent(this.db_name, data_location, item, (succ, msg) => {console.log("Message: " + succ + msg);})
  }

  update(item) {
    db.updateRow(this.db_name, data_location, {id: item.id}, item, (succ, msg) => {console.log("Message: " + succ + msg);})
  }

  delete(id) {
    db.deleteRow(this.db_name, data_location, {id}, (succ, msg) => {console.log("Message: " + succ + msg);})
  }

  getById(id) {
    let all_data
    db.getRows(this.db_name, data_location, {id}, (_, data) => {
      all_data = data
    })
    return all_data
  }

  get(item) {
    let all_data
    db.getRows(this.db_name, data_location, item, (_, data) => {
      all_data = data
    })
    return all_data
  }

  getAll() {
    let all_data
    db.getAll(this.db_name, data_location, (_, data) => {all_data = data})
    return all_data
  }

  clearAll() {
    db.clearTable(this.db_name, data_location, () => {})
  }
}

module.exports = Repository