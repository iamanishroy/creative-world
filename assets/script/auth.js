/*
auth.js - This module is made to handel the user authentication 
and some basic scripts which is common for all the pages, such as :-
==> opening and closing of toogle box
==> updating user data
==> toogling Navbar
*/

/*************** Navbar ****************/
let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");
navBarToggle.addEventListener("click", function () {
  mainNav.classList.toggle("active");
});
/************************************** */

/******************* Authentication *****************/
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      uid = user.uid;
      authenticated = user.emailVerified;
      document
        .querySelector(".main-nav")
        .lastElementChild.removeAttribute("class");
      document
        .querySelector(".main-nav")
        .lastElementChild.setAttribute(
          "onclick",
          `document.querySelector('.profile').removeAttribute('style')`
        );
      userName = user.displayName;
      document.querySelector(
        ".main-nav"
      ).lastElementChild.innerHTML = `<img src="${user.photoURL}" alt="${userName}">`; // Displaying user Image
      document.querySelector(
        ".user .image"
      ).innerHTML = `<img src="${user.photoURL}" alt="${userName}">`; // Displaying user Image
      document.querySelector(".user .data h3").innerHTML = userName; // Displaying user Name
      email = user.email;
      document.querySelector(".user .data h6").innerHTML = email; // Displaying user email
      document.querySelector("#changeName").value = userName; // Displaying user Name
      firebase
        .database()
        .ref("address/" + user.uid)
        .on("value", function (snapshot) {
          if (snapshot.val()) {
            userAdd = snapshot.val().address;
            document.querySelector(".user .data .location div p").innerHTML =
              "<b>Address : </b>" + userAdd; // Displaying user Address
            document.querySelector("#changeAdd").innerHTML = userAdd; // Displaying user Address
          }
        });
    }
  } else {
    // If the user is not authenticated a Login button appears on the top-right corner of the nav bar
    document
      .querySelector(".main-nav")
      .lastElementChild.removeAttribute("onclick");
    document
      .querySelector(".main-nav")
      .lastElementChild.setAttribute("href", "login.html");
    document.querySelector(".main-nav").lastElementChild.innerHTML =
      '<a href="login.html" class="nav-links btn">Login</a>';
  }
});
/******************************************************************/

/*************** Toogling Editbox ****************/
var edit = true;
function editBox() {
  if (edit) {
    document.querySelector(".profile .buttons").firstElementChild.innerHTML =
      "Hide";
    document.querySelector(".edit").removeAttribute("style");
  } else {
    document.querySelector(".profile .buttons").firstElementChild.innerHTML =
      "Edit";
    document.querySelector(".edit").setAttribute("style", "display: none;");
  }
  edit = !edit;
}
/********************************************** */

/*************** Update User Data ****************/
var userName; // user name
var userAdd; // user address
var email; // user registered email
var uid; // user unique id
var imgChanged = false; //initialising imgChanged with false, it will be true once user change their image, this is to prevent unnecessary update of image to save user data and server load and memory
function change() {
  if (imgChanged) {
    // checking image is changed or not
    document.querySelector(".profile .edit button").innerHTML = "saving..."; // changing 'save' to 'saving...'
    /************ Firebase Storing file method **************/
    const ref = firebase.storage().ref();
    const file = document.querySelector("#changeImg").files[0];
    const metadata = {
      contentType: file.type,
    };
    ref
      .child(+new Date() + "-" + file.name)
      .put(file, metadata)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        // After uploading image we are fetching the public URL to save it in database

        /************ Firebase database update method ************/
        firebase
          .auth()
          .currentUser.updateProfile({
            photoURL: url,
          })
          .then(() => {
            // After updating image we are replacing the URL with the newer one
            document.querySelector(
              ".main-nav"
            ).lastElementChild.innerHTML = `<img src="${url}" alt="${userName}">`;
            document.querySelector(
              ".user .image"
            ).innerHTML = `<img src="${url}" alt="${userName}">`;
            imgChanged = false;
            document.querySelector(".profile .edit button").innerHTML = "save"; // 'saving...' => 'save
          })
          .catch(console.error);
      });
  }
  // Updating User Data apart from image
  if (userName != document.querySelector("#changeName").value) {
    userName = document.querySelector("#changeName").value;
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: userName,
      })
      .then(() => {
        document.querySelector(".user .data h3").innerHTML = userName;
        document.querySelector(".profile .edit button").innerHTML = "save";
      });
  }
  if (userAdd != document.querySelector("#changeAdd").value) {
    userAdd = document.querySelector("#changeAdd").value;
    firebase
      .database()
      .ref("address/" + firebase.auth().currentUser.uid)
      .update({
        address: userAdd,
      })
      .then(() => {
        document.querySelector(".user .data .location div p").innerHTML =
          "<b>Address : </b>" + userAdd;
        document.querySelector("#changeAdd").innerHTML = userAdd;
        document.querySelector(".profile .edit button").innerHTML = "save";
      });
  }
}
/**************************************************************************** */
