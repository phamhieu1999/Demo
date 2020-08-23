
$(document).ready(() => {

  var listTask = {
    workList: [],
    doLaterList: [],
    completedList: []
  }
  var g_len = {
    doing: 0,
    doLater: 0,
    completed: 0,
    total: 0
  }
  // var lens = getLen();
  //Add english month name
  Date.locale = {
    en: {
      month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };
  Date.prototype.getDayOfWeek = function () {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()];
  };

  // Set date for app
  var date = new Date();
  $('.day').text(date.getDate());
  $('.month').text(Date.locale['en'].month_names_short[date.getMonth()]);
  $('.year').text(date.getFullYear());
  $('.day-of-week').text(date.getDayOfWeek());

  function setLen() {
    g_len = ipcRenderer.sendSync('request-get-len', [])
  }
  // Progress
  var progress = function () {
    let len1 = g_len.doing;
    let len2 = g_len.doLater;
    let len3 = g_len.completed;
    let total = len1 + len2 + len3;
    if (!total) {
      $('#progress-task .compl').css({
        "width": "0%"
      })
      $('#progress-task .dolte').css({
        "width": "0%"
      })
    } else {
      $('#progress-task .compl').css({
        "width": Math.floor(100 * len3 / total) + "%"
      })
      $('#progress-task .dolte').css({
        "width": Math.floor(100 * len2 / total) + "%"
      })
    }

  }

  // set data to doing list
  var setDoingHTML = () => {
    // Get doing list
    ipcRenderer.once('get-doing-list', (e, tasks) => {
      // console.log(tasks)
      let html = ``;
      tasks.forEach(e => {
        let { content } = e;
        html += `
        <div class="bg-secondary item d-flex flex-row align-items-center justify-content-between">
            <div class="txt">
                ${content}
            </div>
            <div>
                <i class="fa fa-times text-danger"></i>
                <i class="fa fa-pause text-warning"></i>
                <i class="fa fa-check text-success"></i>
            </div>
        </div>
    `;
      });
      $('#work-list').html(html);
    })
    ipcRenderer.send('request-get-doing-list', [])
  }

  // set data to do later list
  var setDoLaterHTML = () => {
    // Get lo later list
    ipcRenderer.once('get-do-later-list', (e, tasks) => {
      // console.log(tasks)
      let html = ``;
      tasks.forEach(e => {
        let { content } = e;
        html += `
        <div class="bg-secondary item d-flex flex-row align-items-center justify-content-between">
            <div class="txt">
                ${content}
            </div>
            <div>
                <i class="fa fa-times text-danger"></i>
                <i class="fa fa-play text-warning"></i>
                <i class="fa fa-check text-success"></i>
            </div>
        </div>
    `;
      });
      $('#do-later-list').html(html);
    })
    ipcRenderer.send('request-get-do-later-list', [])
  }

  // set data to complated list
  var setCompletedHTML = () => {
    // Get completed list
    ipcRenderer.once('get-completed-list', (e, tasks) => {
      // console.log(tasks)
      let html = ``;
      tasks.forEach(e => {
        let { content } = e;
        html += `
        <div class="bg-secondary item d-flex flex-row align-items-center justify-content-between">
            <div class="txt">
                ${content}
            </div>
            <div>
                <i class="fa fa-times text-danger"></i>
            </div>
        </div>
    `;
      });
      $('#completed-list').html(html);
    })
    ipcRenderer.send('request-get-completed-list', [])
  }
 
  // Them task
  var addToDoing = function (e) {
    let code = e.key;
    let content = $('#add-work').val().trim();
    if ((e.type === 'click' || code === 'Enter') && content.length) {
      // console.log(code);
      $('#add-work').val("");
      let html = `
            <div class="bg-secondary item d-flex flex-row align-items-center justify-content-between">
                <div class="txt">
                    ${content}
                </div>
                <div>
                    <i class="fa fa-times text-danger"></i>
                    <i class="fa fa-pause text-warning"></i>
                    <i class="fa fa-check text-success"></i>
                </div>
            </div>
        `;
      $('#work-list').append(html);
      g_len.doing++;
      progress();
      const { port1, port2 } = new MessageChannel
      let task = { content: content }
      let req = { task: task, type: 1 }
      ipcRenderer.postMessage('add-task-to-file', req, [port1])
    }
  }

  // delete task
  var removeAnTask = function () {
    let item = $(this).parents('.item');
    let content = item.children(".txt").text().trim();
    let typeTask = item.parents('.work-list').attr('id');
    let type = 0;
    item.remove();
    switch (typeTask) {
      case 'work-list': 
        type = 1;
        g_len.doing--;
        break;
      case 'do-later-list':
        type = 2;
        g_len.doLater--;
        break;
      case 'completed-list':
        type = 3;
        g_len.completed--;
        break;
    }
    progress();
    const { port1, port2 } = new MessageChannel
    ipcRenderer.postMessage("request-remove-task-from-file", { content, type }, [port1]);
  }
  // reset task
  const resetTask = () => {
    progress();
    g_len.doing;
    g_len.doLater--;
    g_len.completed--;
     $('#completed-list').remove()
    $('#do-later-list').remove()
    const { port1, port2 } = new MessageChannel
    ipcRenderer.postMessage("resetTask",[], [port1]);
  }

  function taskPause() {
    g_len.doing--;
    g_len.doLater++;
    let item = $(this).parents('.item');
    let content = item.children(".txt").text().trim();
    item.remove();
    progress();
    let item2 = `
                <div class="bg-secondary item d-flex flex-row align-items-center justify-content-between">
                      <div class="txt">
                          ${content}
                      </div>
                      <div>
                          <i class="fa fa-times text-danger"></i>
                          <i class="fa fa-play text-warning"></i>
                          <i class="fa fa-check text-success"></i>
                      </div>
                  </div>
              `;
    $("#do-later-list").append(item2);
    const { port1, port2 } = new MessageChannel
    ipcRenderer.postMessage("request-swap-task", { content, from: 1, to: 2 }, [port1]);
  }

  function taskPlay() {
    g_len.doing++;
    g_len.doLater--;
    let item = $(this).parents('.item');
    let content = item.children(".txt").text().trim();
    item.remove();
    progress();
    let item2 = `
                <div class="bg-secondary item d-flex flex-row align-items-center justify-content-between">
                      <div class="txt">
                          ${content}
                      </div>
                      <div>
                          <i class="fa fa-times text-danger"></i>
                          <i class="fa fa-pause text-warning"></i>
                          <i class="fa fa-check text-success"></i>
                      </div>
                  </div>
              `;
    $("#work-list").append(item2);
    const { port1, port2 } = new MessageChannel
    ipcRenderer.postMessage("request-swap-task", { content, from: 2, to: 1 }, [port1]);
  }

  function taskCompleted() {
    g_len.completed++;
    let item = $(this).parents('.item');
    let content = item.children(".txt").text().trim();
    let typeTask = item.parents('.work-list').attr('id');
    let type = 0;
    // debugger
    item.remove();
    switch (typeTask) {
      case 'work-list':
        type = 1;
        g_len.doing--;
        break;
      case 'do-later-list':
        type = 2;
        g_len.doLater--;
        break;
    }
    progress();
    item.remove();
    let item2 = `
                <div class="bg-secondary item d-flex flex-row align-items-center justify-content-between">
                      <div class="txt">
                          ${content}
                      </div>
                      <div>
                          <i class="fa fa-times text-danger"></i>
                      </div>
                  </div>
              `;
    $("#completed-list").append(item2);
    const { port1, port2 } = new MessageChannel
    ipcRenderer.postMessage("request-swap-task", { content, from: type, to: 3 }, [port1]);
  }

  setLen();
  $('.work-list').on('click', '.item .fa-times', removeAnTask)
  $('.work-list').on('click', '.item .fa-pause', taskPause)
  $('.work-list').on('click', '.item .fa-check', taskCompleted)
  $('.work-list').on('click', '.item .fa-play', taskPlay)
  $('#reset-task').on('click',resetTask)

  progress();
  setDoingHTML();
  setDoLaterHTML();
  setCompletedHTML();
  // $('.fa').on('click', progress);
  // getLen()
  $('#add-work').keyup(addToDoing);
  $('#icon-add-task').click(addToDoing);



})