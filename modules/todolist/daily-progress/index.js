const Repository = require('../../../database/repository.js')

class DailyProgress {
    constructor() {
        this.dailyProgress = new Repository('dailyProgress')
        this.dailyProgress.createTable()
    }
    
    chert() {
        console.log('hi there')
    }
}

module.exports = DailyProgress