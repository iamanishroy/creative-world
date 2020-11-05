var reader = new FileReader();
reader.onloadend = function () {
    document.querySelector('.image img').src = reader.result;
}

var imgAdded = false;
var search_Ar = new Array();
function addProduct() {
    if (imgAdded) {
        var bName = document.getElementById('add_BName').value.trim();
        var pName = document.getElementById('add_PName').value.trim();
        var pDesc = document.getElementById('add_PDesc').value.trim();
        var qty = document.getElementById('add_Qty').value.trim();
        var nPrice = document.getElementById('add_nPrice').value.trim();
        var dPrice = document.getElementById('add_dPrice').value.trim();
        var search = document.getElementById('add_search').value.trim();
        if (bName != '' && pName != '' && pDesc != '' && qty != '' && nPrice != '' && dPrice != '' && search != '') {
            document.querySelector('#add').innerHTML = 'Adding...'
            search_Ar = search.split(' ');
            var p = 0;
            search_Ar.forEach(el => {
                if (el.trim() == '') {
                    console.log(search_Ar);
                    search_Ar.splice(p, p)
                }
                p++;
            });
            productId++;
            const ref = firebase.storage().ref();
            const file = document.querySelector('.image input').files[0];
            const metadata = {
                contentType: file.type
            };
            ref.child(productId + '').put(file, metadata)
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(url => {
                    firebase.database().ref('products/' + productId).set({
                        id: productId,
                        search: search_Ar,
                        image: url,
                        bName: bName,
                        pName: pName,
                        desc: pDesc,
                        qty: qty,
                        nPrice: nPrice,
                        dPrice: dPrice
                    }).then(() => {
                        window.location.reload();
                    }).catch(console.error);
                });
        }
    } else {
        alert('add Image')
    }
}