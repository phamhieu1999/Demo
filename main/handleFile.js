const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom');
let $ = require('jquery')(new jsdom.JSDOM().window);
var filePath = path.join(__dirname, '../resources/data/list.json')
var allTask = fs.existsSync(filePath) ? require(filePath) : { workList: [], doLaterList: [], completedList: [] }

module.exports = {
  readFile: (path) => {
    return fs.readFileSync(path).toString();
  },
  saveFile: (path) => {
    fs.writeFile(path, (err) => {
      if (err)
        throw err;
    })
  },
  addToFile : (task,type) => {
      allTask = require(filePath)
      switch(type){
        case 1:
          allTask.workList.push(task);
          break;
        case 2:
          allTask.doLaterList.push(task);
        case 3:
          allTask.completedList.push(task)    
      }
      fs.writeFileSync(filePath,JSON.stringify(allTask))
  },
  resetTask : () => {
    allTask = require(filePath)
    allTask.doLaterList = []
    allTask.completedList = []
    fs.writeFileSync(filePath,JSON.stringify(allTask))
  },
  removeTaskFromFile : (content,type) => {
    allTask = require(filePath)
    switch (type) {
      case 1:
        allTask.workList = $.grep(allTask.workList,function(e){
          return e.content != content; 
        });
        break;
      case 2:
        allTask.doLaterList = $.grep(allTask.doLaterList,function(e){
          return e.content != content;
        });
        break;
      case 3:
        allTask.completedList = $.grep(allTask.completedList,function(e){
          return e.content != content;
        });
        break;   
    }
    fs.writeFileSync(filePath,JSON.stringify(allTask))
  },
  swap: (content, from, to) => {
    allTask = require(filePath)
    let task = { content: content }
    switch (from) {
      case 1:
        allTask.workList = $.grep(allTask.workList, function (e) {
          return e.content != content;
        });
        break;
      case 2:
        allTask.doLaterList = $.grep(allTask.doLaterList, function (e) {
          return e.content != content;
        });
        break;
      case 3:
        allTask.completedList = $.grep(allTask.completedList, function (e) {
          return e.content != content;
        });
        break;
    }
    switch (to) {
      case 1:
        allTask.workList.push(task);
        break;
      case 2:
        allTask.doLaterList.push(task);
        break;
      case 3:
        allTask.completedList.push(task);
        break;
    }
    fs.writeFileSync(filePath, JSON.stringify(allTask))
  }
}