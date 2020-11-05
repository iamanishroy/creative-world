productId = 0;
totalStock = 0;

firebase.database().ref('products').once('value', function (snapshot) {
    snapshot.forEach(function (childSnpshot) {
        prod = childSnpshot.val();
        sessionStorage.setItem(prod.id, JSON.stringify([prod.image, prod.bName, prod.pName, prod.desc, prod.qty, prod.nPrice, prod.dPrice]));
        totalStock += parseInt(prod.qty);
        productId++;
        
        document.querySelector('.view tbody').innerHTML += `<tr>
            <td class="column1">${prod.id}</td>
            <td class="column2">${prod.bName}</td>
            <td class="column3">${prod.pName}</td>
            <td class="column4">${prod.dPrice}</td>
            <td class="column5">${prod.qty}</td>
            <td class="column6">
            <button onclick="openDet('${prod.id}')">
            more</button></td></tr>`;

        document.querySelector('.delItem tbody').innerHTML += `<tr>
            <td class="column1">${prod.id}</td>
            <td class="column2">${prod.bName}</td>
            <td class="column3">${prod.pName}</td>
            <td class="column4">${prod.dPrice}</td>
            <td class="column5">${prod.qty}</td>
            <td class="column6">
            <button onclick="delItem('${prod.id}')" style="background-color: red;">
            delete</button></td></tr>`;
    });
}).then(() => {
    document.querySelector('#totalStok').innerHTML = totalStock;
    document.querySelector('#totalProd').innerHTML = productId;
});