totalOrder = 0;
bringOrderList();
function bringOrderList() {
    document.querySelector('.viewIncOrd tbody').innerHTML = '';
    document.querySelector('.viewOrd tbody').innerHTML = '';
    firebase.database().ref('orders').once('value', function (snapshot) {
        var counter1 = 0;
        var counter2 = 0;
        snapshot.forEach(function (childSnpshot) {
            ord = childSnpshot.val();
            if (!ord.completed) {
                totalOrder++;
                document.querySelector('.viewIncOrd tbody').innerHTML += `<tr>
                    <td class="column1">${++counter1}</td>
                    <td class="column2">${ord.name}&nbsp;&nbsp;<button style="background-color: #136a8a22;
                    color: #136a8a;transform: rotateZ(-45deg);border-radius: 50%;" onclick="openUser('${ord.uid}', '${ord.name}', '${ord.email}')">--></button></td>
                    <td class="column3">${ord.email}</td>
                    <td class="column4">${ord.product}&nbsp;&nbsp;<button style="background-color: #136a8a22;
                    color: #136a8a;transform: rotateZ(-45deg);border-radius: 50%;" onclick="openDet(${ord.productid})">--></button></td>
                    <td class="column5">${ord.price}</td>
                    <td class="column6">
                    <button onclick="complete('${ord.orderid}')">complete</button></td></tr>`;
            }
            document.querySelector('.viewOrd tbody').innerHTML += `<tr>
                <td class="column1">${++counter2}</td>
                <td class="column2">${ord.name}&nbsp;&nbsp;<button style="background-color: #136a8a22;
                color: #136a8a;transform: rotateZ(-45deg);border-radius: 50%;" onclick="openUser('${ord.uid}', '${ord.name}', '${ord.email}')">--></button></td>
                <td class="column3">${ord.email}</td>
                <td class="column4">${ord.product}&nbsp;&nbsp;<button style="background-color: #136a8a22;
                color: #136a8a;transform: rotateZ(-45deg);border-radius: 50%;" onclick="openDet(${ord.productid})">--></button></td>
                <td class="column5">${ord.price}</td>
                <td class="column6">${ord.completed ? '&#10003;' : ''}</td></tr>`;
        });
    }).then(() => {
        document.querySelector('#totalOrd').innerHTML = totalOrder;
    });
}

function openUser(uid, name, email) {
    document.querySelector('.details_user_container').removeAttribute('style');
    document.querySelector('#cus_name').innerHTML = name;
    document.querySelector('#cus_cont').innerHTML = email;
    firebase.database().ref('address/' + uid).once('value', function (snapshot) {
        snapshot.forEach(function (childSnpshot) {
            document.querySelector('#cus_addr').innerHTML = childSnpshot.val();
        });
    });
}

function complete(ordId) {
    if (confirm('Are you sure you want to mark this order as completed??')) {
        firebase.database().ref('orders/' + ordId).update({
            completed: true
        }).then(() => {
            bringOrderList();
        });
    }
}