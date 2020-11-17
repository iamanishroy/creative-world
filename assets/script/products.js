/*
product.js - This is made to handel the product page of the Application. 
It has functions for :-
==> fetching and displaying all the products in the form of cards.
==> filtering products from the fetched product list
==> ordering a product
==> rating a product
*/

var allItem = new Array();
var itemIds = new Array();
firebase
  .database()
  .ref("products")
  .once("value", function (snapshot) {
    snapshot.forEach(function (childSnpshot) {
      prod = childSnpshot.val();
      prodRate = 0;
      rateCount = 0;
      if (prod.rate) {
        var rates = Object.values(prod.rate);
        var totalRates = 0;
        rateCount = rates.length;
        for (var i = 0; i < rates.length; i++) {
          totalRates += parseInt(rates[i].rate);
        }
        prodRate = Math.round(totalRates / rates.length);
      }
      sessionStorage.setItem(
        prod.id,
        JSON.stringify([
          prod.image,
          prod.bName,
          prod.pName,
          prod.desc,
          prod.qty,
          prod.nPrice,
          prod.dPrice,
          prodRate,
          rateCount,
        ])
      );
      allItem.push(["~-~" + prod.pName, prod.id]);
      allItem.push(["~-~" + prod.bName, prod.id]);
      itemIds.push(prod.id);
      var stars = "";
      for (var i = 1; i <= 5; i++) {
        if (i <= prodRate) {
          stars += "&#9733;";
        } else {
          stars += "&#9734;";
        }
      }
      document.querySelector(".searchResult").innerHTML += `
            <div class="card">
                <img src="${prod.image}" alt="">
                <div class="detail">
                    <h3>${prod.pName}<span>new</span></h3>
                    <p class="description">${prod.bName}</p>
                    <p class="star">${stars}</p>
                    <s>&#x20B9; ${prod.nPrice}</s>
                    <br>
                    <p class="price">&#x20B9; ${prod.dPrice} 
                    <span onclick="openDet('${prod.id}', '${prod.image}', '${prod.bName}', '${prod.pName}', '${prod.desc}', '${prod.qty}', '${prod.nPrice}', '${prod.dPrice}', '${prodRate}', '${rateCount}')">
                    Buy now</span></p>
                </div>
            </div>`;
    });
  });

var authenticated = false;

function openDet(
  id,
  image,
  bName,
  pName,
  desc,
  qty,
  nPrice,
  dPrice,
  prodRate,
  rateCount
) {
  var stars = "";
  for (var i = 1; i <= 5; i++) {
    if (i <= prodRate) {
      stars += "&#9733;";
    } else {
      stars += "&#9734;";
    }
  }
  document.querySelector(".details_container .details").innerHTML = `
    <div class="image">
        <img src="${image}" alt="">
    </div>
    <div class="others">
        <div class="about">
            <h5>${bName}</h5>
            <h1>${pName}</h1>
            <div class="rating">
                <b>${stars}</b>
                &nbsp;&nbsp;&nbsp;
                <a href="">${rateCount} Reviews</a>
            </div>
            <p>${desc}</p>
            Available QTY <span>${qty} pieces</span>
            <div class="price">
                <b><s>&#x20B9; ${nPrice}</s><br>
                    &#x20B9; ${dPrice}
                </b>
                <div class="button">
                    <button onclick="order('${id}', '${pName}', '${dPrice}', '${qty}')">Purchase</button>
                    <button onclick="document.querySelector('.rates').removeAttribute('style')">&#9734;</button>
                </div>
            </div>
            <div class="rates" style="display: none;">
                <ul>
                    <li onmouseover="fill(1)" onmouseout="unFill()" onclick="rateItem('${id}', 1)">&#9734;</li>
                    <li onmouseover="fill(2)" onmouseout="unFill()" onclick="rateItem('${id}', 2)">&#9734;</li>
                    <li onmouseover="fill(3)" onmouseout="unFill()" onclick="rateItem('${id}', 3)">&#9734;</li>
                    <li onmouseover="fill(4)" onmouseout="unFill()" onclick="rateItem('${id}', 4)">&#9734;</li>
                    <li onmouseover="fill(5)" onmouseout="unFill()" onclick="rateItem('${id}', 5)">&#9734;</li>
                </ul>
            </div>
        </div>
    </div>`;
  document.querySelector(".details_container").removeAttribute("style");
}
function rateItem(id, r) {
  if (authenticated) {
    firebase
      .database()
      .ref("products/" + id + "/rate/" + uid)
      .update({
        rate: r,
      })
      .then(() => {
        alert("Thank You for rating!!");
      });
  }
  document.querySelector(".rates").setAttribute("style", "display: none;");
}
var last = 0;
function fill(o) {
  if (last != o) {
    liCounter = 1;
    document.querySelectorAll(".rates ul li").forEach((li) => {
      if (liCounter <= o) {
        li.innerHTML = "&#9733;";
      }
      liCounter++;
    });
    last = o;
  }
}
function unFill() {
  document.querySelectorAll(".rates ul li").forEach((li) => {
    li.innerHTML = "&#9734;";
  });
}
function order(id, pName, price, qty) {
  if (authenticated) {
    if (confirm("You want to order " + pName)) {
      var oId =
        String.fromCharCode(Math.floor(Math.random() * 26) + 97) +
        Math.random().toString(16).slice(2) +
        Date.now().toString(16).slice(4);
      firebase
        .database()
        .ref("orders/" + oId)
        .set({
          orderid: oId,
          productid: id,
          product: pName,
          price: price,
          uid: uid,
          name: userName,
          email: email,
          completed: false,
        })
        .then(() => {
          firebase
            .database()
            .ref("products/" + id)
            .update({
              qty: parseInt(qty) - 1 + "",
            })
            .then(() => {
              alert(
                "Thank You! Your order sucssfully completed. Our representative will contact you within 24 hours."
              );
              document
                .querySelector(".details_container")
                .setAttribute("style", "display: none;");
            });
        });
    }
  } else {
    alert(
      "You are not verified kindly create account or check your email for verification link."
    );
  }
}

function filter() {
  var txt = document.getElementById("fiterTxt").value.trim();
  if (txt != "") {
    shownList = new Array();
    document.querySelector(".searchResult").innerHTML = "";
    allItem.forEach((item) => {
      if (
        (item[0] + "").toLowerCase().includes("~-~" + txt.toLowerCase()) &&
        !shownList.includes(item[1])
      ) {
        shownList.push(item[1]);
        display(item[1]);
      }
    });
  } else {
    itemIds.forEach((id) => {
      display(id);
    });
  }
}

function display(id) {
  productArr = JSON.parse(sessionStorage.getItem(id));
  image = productArr[0];
  bName = productArr[1];
  pName = productArr[2];
  desc = productArr[3];
  qty = productArr[4];
  nPrice = productArr[5];
  dPrice = productArr[6];
  prodRate = parseInt(productArr[7]);
  rateCount = parseInt(productArr[8]);
  var stars = "";
  for (var i = 1; i <= 5; i++) {
    if (i <= prodRate) {
      stars += "&#9733;";
    } else {
      stars += "&#9734;";
    }
  }
  document.querySelector(".searchResult").innerHTML += `
         <div class="card">
            <img src="${image}" alt="">
            <div class="detail">
                <h3>${pName}<span>new</span></h3>
                <p class="description">${bName}</p>
                <p class="star">${stars}</p>
                <s>&#x20B9; ${nPrice}</s>
                <br>
                <p class="price">&#x20B9; ${dPrice} 
                <span onclick="openDet('${id}', '${image}', '${bName}', '${pName}', '${desc}', '${qty}', '${nPrice}', '${dPrice}', '${prodRate}', '${rateCount}')">
                    Buy now</span></p>
            </div>
        </div>`;
}
