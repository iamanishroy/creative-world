function refreshOutput() {
    var html = document.querySelector('.sendEmail textarea').value.trim();
    if (html != '') {
        document.querySelector('.sendEmail .output').innerHTML = html;
    }
}
var temp;
function sendEmail() {
    var html = document.querySelector('.sendEmail textarea').value.trim();
    if (html != '') {
        if (confirm('Are you sure to send this email??')) {
            var emailAr = new Array();
            firebase.database().ref('subscribedEmail').once('value', function (snapshot) {
                snapshot.forEach(function (childSnpshot) {
                    emailAr.push(childSnpshot.val().email);
                });
            }).then(() => {
                emailAr.forEach((em) => {
                    Email.send({
                        SecureToken: "5634ae95-e315-4960-bddd-402b86966dc7",
                        To: em,
                        From: "verify.creativeworld@gmail.com",
                        Subject: "Creative World",
                        Body: html
                    });
                });
            }).then(() => {
                alert('Email sent to all..');
            })
        }
    }
}