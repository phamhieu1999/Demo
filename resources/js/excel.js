const xlsx = require('xlsx-populate')
const fs = require('fs');
const path = require('path');
const { dialog, BrowserWindow } = require('electron')
const win = BrowserWindow.getAllWindows()[0];
let option = {
  title: "Save As",
  defaultPath: path.join(__dirname, '../data/abc.xlsx'),
  buttonLabel: "Save",
  filters: [
    { name: 'Excel Workbook', extensions: ['xlsx'] }
  ]
}
module.exports = {
  exportExcel: () => {
    let pathfile = path.join(__dirname, '../data/list.json');
    let allTask;
    if (!fs.existsSync(pathfile)) {
      dialog.showErrorBox("Warning!", "Please add task before exporting ...")
      return "File khong ton tai";
    }
    allTask = require(pathfile)
    let doing = [];      
    let doLater = []; 
    let completed = [];
    allTask.workList.forEach(e => {
      doing.push(e.content)
    })
    allTask.doLaterList.forEach(e => {
      doLater.push(e.content)
    })
    allTask.completedList.forEach(e => {
      completed.push(e.content)
    })
    return dialog.showSaveDialog(win, option)
      .then(value => {
        return xlsx.fromFileAsync(path.join(__dirname, "../data/abc.xlsx"))
        
          .then(workbook => {
            for (let i = 2; i < 2 + doing.length; i++) {
              workbook.sheet(0).cell(`A${i}`).value(doing[i - 2])
            }
            for (let i = 2; i < 2 + doLater.length; i++) {
              workbook.sheet(0).cell(`B${i}`).value(doLater[i - 2])
            }
            for (let i = 2; i < 2 + completed.length; i++) {
              workbook.sheet(0).cell(`C${i}`).value(completed[i - 2])
            }
            return value.filePath;
          })
          .catch(err => {
            if (err.code == "EBUSY") {
              let filename = value.filePath.split(`\\`).pop();
              console.log(filename)
              dialog.showErrorBox("Warning!", `Please close ${filename} beforing save changes ...`);
            }
            return false;
          })
      })
  },
  importExcel: () => {
    dialog.showOpenDialog(win, {
      properties: ["openFile"]
    })
      .then(({ filePaths }))
  }
}