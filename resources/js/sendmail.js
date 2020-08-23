//send mail
$(document).ready(() => {
    // var option = {
    //   service: 'gmail',
    //   auth: {
    //       user: acc.user,
    //       pass: acc.pass
    //   }
    // }
    // var transporter = mailer.createTransport(option);
    // //kiem tra ket noi\
    // transporter.verify(function(err, success) {
    //   if (err)
    //       console.log(err);
    //   else
    //       console.log(success);
    // })
    // Date.prototype.vietISFormat = function() {
    //   var d = this.getDate();
    //   var m = this.getMonth() + 1;
    //   var y = this.getFullYear();
    //   return y + '/' + m + '/' + d;
    // }
    
    // var report = {
    //   from: 'hieupv@vietis.com.vn',
    //   to: 'anhpd@vietis.com.vn',
    //   subject: '[NodeJS_Training] Daily Report' + new Date().vietISFormat(),
    //   text: `
    //       1. Plan
    //           - Task: Make Todo App process event dom and get, set data to file json
    //       2. Actual:
    //           - 70%
    //       3. Issue:
    //           - Chưa làm phần reset progress, và complete
    //       4. Next plan:
    //           - Làm reset progress, và complete và tìm hiểu tiếp về electronjs cũng như nodejs.
    //   `
    // }
    
    $('#send-report').on('click', function() {
      console.log('data');
    //   transporter.sendMail(report, function(err, info) {
    //       if (err)
    //           console.log(err);
    //       else
    //           console.log("Sending successfully: " + info.response);
    //   });
    //   $(this).hide();
    })
  })