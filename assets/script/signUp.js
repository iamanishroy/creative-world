const t = new Date().getTime();
function sendOTP() {
  var email = document.getElementById("email").value;
  var database = firebase.database();
  var unique_email = true;
  database
    .ref("emailVerify")
    .orderByChild("email")
    .equalTo(email)
    .once("value", function (snapshot) {
      snapshot.forEach(function (childSnpshot) {
        unique_email = false;
      });
      if (unique_email) {
        var pin = Math.floor(100000 + Math.random() * 900000);
        database.ref("emailVerify/" + t).set({ email: email, pin: pin });

        Email.send({
          SecureToken: "6c79fb2e-97a8-41da-9190-8b4a8153fe08",
          To: email,
          From: "creative.world.mailer@gmail.com",
          Subject: "Creative World Verification Code",
          Body: `Hey, Your Verification code for Creative World is ${pin}.`,
        }).then((message) => {
          if (message === "OK") {
            alert(
              "We have sent a mail to this email regarding Verification code. Please Check"
            );
            document.querySelector("button").remove();
            document.querySelectorAll(".afterOTP").forEach((e) => {
              e.classList.remove("afterOTP");
            });
          } else {
            alert(message);
          }
        });
      } else {
        alert("This Email is Already Registered!!");
        window.location.replace("login.html");
      }
    });
}

function createAccount() {
  var pin = document.getElementById("otp").value;
  var email = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;
  if (/^\d+$/.test(pin) && pin.length > 5) {
    firebase
      .database()
      .ref("emailVerify/" + t)
      .on("value", function (snapshot) {
        if (snapshot.val().pin == pin) {
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, pass)
            .then((t) => {
              firebase
                .auth()
                .currentUser.updateProfile({
                  displayName: email.split("@")[0],
                  photoURL: "assets/images/user.png",
                })
                .then(() => {
                  firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                      firebase
                        .database()
                        .ref("address/" + firebase.auth().currentUser.uid)
                        .update({
                          address: "Not Set",
                        })
                        .then(() => {
                          alert("Your Account Created Successfully");
                          window.location.replace("index.html");
                        });
                    }
                  });
                });
            });
        } else {
          alert("Invalid Verification Code");
        }
      });
  } else {
    alert("Invalid Verification Code");
  }
}

// var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// if(inputText.value.match(mailformat));
