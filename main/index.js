const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const path = require('path')
const jsdom = require('jsdom');
let $ = require('jquery')(new jsdom.JSDOM().window);
function createWindow() {
  let win = new BrowserWindow({
    width: 500,
    height: 650,
    center: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: true,
      preload: path.join(__dirname, "../preload/preload.js")
    }
  });
  win.loadFile('./index.html');
  win.setMenu(null);
  win.webContents.openDevTools();

}

// get data from a file
ipcMain.on('request-save-file', (e, filename) => {
    e.reply('save-file', require('./handleFile.js').saveFile(path.join(__dirname, `../resources/data/${filename}`)))
  })
  
  // add task to file
  ipcMain.on("add-task-to-file", (event, msg) => {
    require('./handleFile.js').addToFile(msg.task, msg.type);
    event.returnValue = true;
  })
  //reset task
  ipcMain.on('resetTask',(event,msg)=> {
    require('./handleFile.js').resetTask(msg)
    event.returnValue = true;
  })
  // remove task from file .json
  ipcMain.on("request-remove-task-from-file", (event, msg) => {
    require('./handleFile.js').removeTaskFromFile(msg.content, msg.type)
    event.returnValue = true;
  })
  //send task from doing to dolater or doing to complete or dolater to complete
  ipcMain.on("request-swap-task", (event, msg) => {
    require('./handleFile.js').swap(msg.content, msg.from, msg.to);
    event.returnValue = true;
  })
  
  //get all data
  ipcMain.on('request-get-all-list', (e, d) => {
    e.reply('get-all-list', require('./listData.js').getAllList
    )
  })
  //get doing data
  ipcMain.on('request-get-doing-list', (e, d) => {
    e.reply('get-doing-list', require('./listData.js').getDoingList
    )
  })
  
  //get do later data
  ipcMain.on('request-get-do-later-list', (e, d) => {
    e.reply('get-do-later-list', require('./listData.js').getDoLaterList
    )
  })
  
  //get completed data
  ipcMain.on('request-get-completed-list', (e, d) => {
    e.reply('get-completed-list', require('./listData.js').getCompletedList
    )
  })
  
  //get len
  ipcMain.on('request-get-len', (e, d) => {
    e.returnValue = require("./listData.js").getLen
  })
  //send mail
  ipcMain.on('send-mail',(e,args)=>{
    require('../resources/js/sendmail').sendMail();
  })
  ipcMain.on('export-excel',(e,args)=>{
    require('../resources/js/excel').exportExcel()
    .then((res) => {
      if (res) {
        console.log(res)
        let btnN = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
          title: "Open File",
          type: "question",
          message: "Do you want to open excel file to be 've exported?",
          buttons: ["Ok", "No", "Cancel"]
        })
        if (!btnN) {
          let open = spawn(`start "" "${res}"`, [], {
            shell: true,
            detached: true
          })
          open.on("error", () => {
            let filename = res.split(`\\`).pop();
            console.log(filename)
            dialog.showErrorBox("Warning!", `${filename} is opening ...`);
          })
        }
      }
    })
  })
  ipcMain.on('import-excel',(e,args)=>{
    require('../resources/js/excel').importExcel();
  })

app.whenReady().then(createWindow);

