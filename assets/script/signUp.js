function createAccount() {
  var email = document.getElementById("email").value.trim();
  var pass = document.getElementById("pass").value.trim();
  if (email != "" && pass != "") {
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
                    firebase
                      .auth()
                      .currentUser.sendEmailVerification()
                      .then(function () {
                        alert(
                          "Your Account Created Successfully!! Please Check your email to activate account!"
                        );
                        window.location.replace("index.html");
                      })
                      .catch(function (error) {
                        alert(error);
                      });
                  });
              }
            });
          });
      })
      .catch((error) => {
        alert(error);
      });
  } else {
    alert("Some field is missing..");
  }
}

// var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// if(inputText.value.match(mailformat));
