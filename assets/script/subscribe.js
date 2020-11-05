function subscribe() {
    var email = document.getElementById('sub_email').value.trim();
    if (email != '') {

        console.log('subscribing');
        firebase.database().ref('subscribedEmail/' + +new Date()).set({
            email: email
        }).then(() => {
            alert('Your email has been registered sucessfully for more offers');
            document.getElementById('sub_email').value = '';
        });
    }
}

