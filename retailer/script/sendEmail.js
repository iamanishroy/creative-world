/* 
The 'refreshOutput' function is used to show the output created from the typed HTML.
The function is called on keyUp occured the textarea.
Logic : On each keyUp take the value from the textarea and set it in the output div.
*/
function refreshOutput() {
  var html = document.querySelector(".sendEmail textarea").value.trim();
  if (html != "") {
    document.querySelector(".sendEmail .output").innerHTML = html;
  }
}
/*
The 'sendEmail' function is used to send Email.
The function is called on button click.
Logic:  1. Get the value
        2. Confirm It
        3. Fetch the email ids from the database
        4. Send it.
*/
function sendEmail() {
  var html = document.querySelector(".sendEmail textarea").value.trim();
  if (html != "") {
    if (confirm("Are you sure to send this email??")) {
      var emailAr = new Array();
      firebase
        .database()
        .ref("subscribedEmail")
        .once("value", function (snapshot) {
          snapshot.forEach(function (childSnpshot) {
            emailAr.push(childSnpshot.val().email);
          });
        })
        .then(() => {
          emailAr.forEach((em) => {
            const proxy = "https://cors-anywhere.herokuapp.com/";
            var api = `${proxy}https://mailer-mimify.herokuapp.com/mailer/${em}/${encodeURIComponent(
              html
            )}`;
            fetch(api).then((response) => {
              console.log(response.json());
            });
          });
        })
        .then(() => {
          alert("Email sent to all..");
        });
    }
  }
}
