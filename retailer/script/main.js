function openTab(t) {
    var div = '';
    for (var i = 1; i <= 6; i++) {
        document.querySelector('#tab_' + i).removeAttribute('class');
    }
    document.querySelectorAll('.retailer .main .div').forEach((el) => {
        el.setAttribute('style', 'display: none;');
    });
    switch (t) {
        case 1: div = 'upload';
            break;
        case 2: div = 'view';
            break;
        case 3: div = 'delItem';
            break;
        case 4: div = 'viewIncOrd';
            break;
        case 5: div = 'viewOrd';
            break;
        case 6: div = 'sendEmail';
            break;
    }
    document.querySelector('.retailer .main .' + div).removeAttribute('style');
    document.querySelector('#tab_' + t).setAttribute('class', 'active');
}

function openDet(id) {
    productArr = JSON.parse(sessionStorage.getItem(id));
    image = productArr[0];
    bName = productArr[1];
    pName = productArr[2];
    desc = productArr[3];
    qty = productArr[4];
    nPrice = productArr[5];
    dPrice = productArr[6];
    document.querySelector('.details_container .details').innerHTML = `
    <div class="image">
        <img src="${image}" alt="">
    </div>
    <div class="others">
        <div class="about">
            <h5>${bName}</h5>
            <h1>${pName}</h1>
            <div class="rating">
                <b>&#9733;&#9733;&#9733;&#9733;&#9734;</b>
                &nbsp;&nbsp;&nbsp;
                <a href="">4 Reviews</a>
            </div>
            <p>${desc}</p>
            Available QTY <span>${qty} pieces</span>
            <div class="price">
                <b><s>&#x20B9; ${nPrice}</s><br>
                    &#x20B9; ${dPrice}</b>
            </div>
        </div>
    </div>`;
    document.querySelector('.details_container').removeAttribute('style');
}