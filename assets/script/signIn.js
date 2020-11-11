function signIn() {
  document.querySelector("button").innerHTML = "Signing In..";
  var email = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, pass)
    .catch(function (error) {
      var errorCode = error.code;
      if (errorCode == "auth/user-not-found") {
        document.querySelector("button").innerHTML = "Sign In";
        alert("This email is not registered!!");
      } else if (errorCode == "auth/wrong-password") {
        document.querySelector("button").innerHTML = "Sign In";

        alert("Wrong Password!!");
      } else if (errorCode == "auth/too-many-requests") {
        document.querySelector("button").innerHTML = "Sign In";

        alert("Too many invalid requests try again later!!");
      } else {
        document.querySelector("button").innerHTML = "Sign In";

        alert("Something went wrong!!");
      }
    });
}
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      window.location.replace("index.html");
    }
  }
});
