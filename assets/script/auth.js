let mainNav = document.getElementById('js-menu');
let navBarToggle = document.getElementById('js-navbar-toggle');
navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
});
var edit = true;
function editBox() {
    if (edit) {
        document.querySelector('.profile .buttons').firstElementChild.innerHTML = 'Hide';
        document.querySelector('.edit').removeAttribute('style');
    } else {
        document.querySelector('.profile .buttons').firstElementChild.innerHTML = 'Edit';
        document.querySelector('.edit').setAttribute('style', 'display: none;');
    }
    edit = !edit;
}
var userName;
var userAdd;
var email;
var uid;
var imgChanged = false;
function change() {
    if (imgChanged) {
        document.querySelector('.profile .edit button').innerHTML = 'saving...';
        const ref = firebase.storage().ref();
        const file = document.querySelector("#changeImg").files[0];
        const metadata = {
            contentType: file.type
        };
        ref.child(+new Date() + "-" + file.name).put(file, metadata)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                firebase.auth().currentUser.updateProfile({
                    photoURL: url
                }).then(() => {
                    document.querySelector('.main-nav').lastElementChild.innerHTML = `<img src="${url}" alt="${userName}">`;
                    document.querySelector('.user .image').innerHTML = `<img src="${url}" alt="${userName}">`;
                    imgChanged = false;
                    document.querySelector('.profile .edit button').innerHTML = 'save';
                }).catch(console.error);
            });
    }
    if (userName != document.querySelector('#changeName').value) {
        userName = document.querySelector('#changeName').value;
        firebase.auth().currentUser.updateProfile({
            displayName: userName
        }).then(() => {
            document.querySelector('.user .data h3').innerHTML = userName;
            document.querySelector('.profile .edit button').innerHTML = 'save';
        })
    }
    if (userAdd != document.querySelector('#changeAdd').value) {
        userAdd = document.querySelector('#changeAdd').value;
        firebase.database().ref('address/' + firebase.auth().currentUser.uid).update({
            address: userAdd
        }).then(() => {
            document.querySelector('.user .data .location div p').innerHTML = '<b>Address : </b>' + userAdd;
            document.querySelector('#changeAdd').innerHTML = userAdd;
            document.querySelector('.profile .edit button').innerHTML = 'save';
        });
    }
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var user = firebase.auth().currentUser;
        if (user != null) {
            authenticated = true;
            uid = user.uid;
            document.querySelector('.main-nav').lastElementChild.removeAttribute('class');
            document.querySelector('.main-nav').lastElementChild.setAttribute('onclick', `document.querySelector('.profile').removeAttribute('style')`);
            userName = user.displayName;
            document.querySelector('.main-nav').lastElementChild.innerHTML = `<img src="${user.photoURL}" alt="${userName}">`;
            document.querySelector('.user .image').innerHTML = `<img src="${user.photoURL}" alt="${userName}">`;
            document.querySelector('.user .data h3').innerHTML = userName;
            email = user.email;
            document.querySelector('.user .data h6').innerHTML = email;
            document.querySelector('#changeName').value = userName;
            firebase.database().ref('address/' + user.uid).on('value', function (snapshot) {
                if (snapshot.val()) {
                    userAdd = snapshot.val().address;
                    document.querySelector('.user .data .location div p').innerHTML = '<b>Address : </b>' + userAdd;
                    document.querySelector('#changeAdd').innerHTML = userAdd;
                }
            });
        }
    } else {
        document.querySelector('.main-nav').lastElementChild.removeAttribute('onclick');
        document.querySelector('.main-nav').lastElementChild.setAttribute('href', 'login.html');
        document.querySelector('.main-nav').lastElementChild.innerHTML = '<a href="login.html" class="nav-links btn">Login</a>';
    }
});

