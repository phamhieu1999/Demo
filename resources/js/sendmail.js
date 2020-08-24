var mailer = require('nodemailer');

var acc = require('../accountMail')
var option = {
    service: 'gmail',
    auth: {
        user: acc.user,
        pass: acc.pass
    }
}

var transporter = mailer.createTransport(option);

//check and connect data
transporter.verify(function(err, success) {
    if (err)
        console.log(err);
    else
        console.log(success);
})

// register to day yyyy/mm/dd
Date.prototype.vietISFormat = function() {
    var d = this.getDate();
    var m = this.getMonth() + 1;
    var y = this.getFullYear();
    return y + '/' + m + '/' + d;
}
function getTask() {
  let allTask = require('../data/list.json');
  let text = `1. Plan
                `;
  allTask.completedList.forEach(e => {
    text += `- ${e.content}
                            `;
  })
  allTask.workList.forEach(e => {
    text += `- ${e.content}
              `;
  })
  allTask.doLaterList.forEach(e => {
    text += `- ${e.content}
              `;
  })
  text += `2. Actual
            `;
  allTask.completedList.forEach(e => {
    text += `- ${e.content}
              `;
  })
  text += `3. Issue:
            - Error  todolsit`
  text += `4. Next Plan
            `;
  allTask.doLaterList.forEach(e => {
    text += `- ${e.content}
              `;
  })
  return text;
}
var report = {
    from: 'hieupv@vietis.com.vn',
    to: 'anhpd@vietis.com.vn',
    subject: '[NodeJS_Training] Daily Report' + new Date().vietISFormat(),
   text: getTask()
}


module.exports = {
  sendMail : () => {
    transporter.sendMail(report, function(err, info) {
              if (err)
                  console.log(err);
            else
                  console.log("Sending successfully: " + info.response);
          });
  }
}