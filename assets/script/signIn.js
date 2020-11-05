function signIn() {
    var email = document.getElementById('email').value;
    var pass = document.getElementById('pass').value;
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function (error) {
        var errorCode = error.code;
        if (errorCode == 'auth/user-not-found') {
            alert('This email is not registered!!');
        } else if (errorCode == 'auth/wrong-password') {
            alert('Wrong Password!!');
        } else if (errorCode == 'auth/too-many-requests') {
            alert('Too many invalid requests try again later!!');;
        } else {
            alert('Something went wrong!!');
        }
    });
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var user = firebase.auth().currentUser;
        if (user != null) {
            window.location.replace('index.html')
        }
    }
});