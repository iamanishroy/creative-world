function checkForm() {
  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("co-email").value.trim();
  var messege = document.getElementById("messege").value.trim();
  if (name == "") {
    alert("please check your name");
  } else if (messege == "") {
    alert("please check your messege");
  } else if (!emailValidator(email)) {
    alert("please check your email");
  } else {
    alert("Thank You for contacting us...");
  }
}

function emailValidator(email) {
  if (email == "") {
    return false;
  } else if (email.indexOf("@") <= 0) {
    return false;
  } else if (email.indexOf(".") <= 0) {
    return false;
  } else if (email.indexOf(".") < email.indexOf("@")) {
    return false;
  } else if (email.indexOf(".") == email.length - 1) {
    return false;
  }
  var counter = 0;
  for (var i = 0; i < email.length; i++) {
    if (email.charAt(i) == "@") {
      counter++;
    }
    if (counter > 1) {
      return false;
    }
  }
  return true;
}
