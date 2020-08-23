const fs = require('fs')
const path = require('path')
var filepath = path.join(__dirname, '../resources/data/list.json')
var allList = fs.existsSync(filepath) ? require(filepath) : {
  workList: [],
  doLaterList: [],
  completedList: []
}
module.exports = {
    getAllList: allList,
    getDoingList: allList.workList,
    getDoLaterList: allList.doLaterList,
    getCompletedList: allList.completedList,
    getLen: {
      doing: allList.workList.length,
      doLater: allList.doLaterList.length,
      completed: allList.completedList.length,
      total: allList.workList.length + allList.doLaterList.length + allList.completedList.length
    }
  }