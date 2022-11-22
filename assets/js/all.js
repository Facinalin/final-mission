"use strict";

// ~作業預設
document.addEventListener('DOMContentLoaded', function () {
  var ele = document.querySelector('.recommendation-wall');
  ele.style.cursor = 'grab';
  var pos = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
  };

  var mouseDownHandler = function mouseDownHandler(e) {
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';
    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var mouseMoveHandler = function mouseMoveHandler(e) {
    // How far the mouse has been moved
    var dx = e.clientX - pos.x;
    var dy = e.clientY - pos.y; // Scroll the element

    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  var mouseUpHandler = function mouseUpHandler() {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }; // Attach the handler


  ele.addEventListener('mousedown', mouseDownHandler);
}); // menu 切換

var menuOpenBtn = document.querySelector('.menuToggle');
var linkBtn = document.querySelectorAll('.topBar-menu a');
var menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);
linkBtn.forEach(function (item) {
  item.addEventListener('click', closeMenu);
});

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}

function closeMenu() {
  menu.classList.remove('openMenu');
} // ~作業預設


var productWrap = document.querySelector('.productWrap');
var productSelect = document.querySelector('.productSelect');
var api_Url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/2022nov";
var shoppingCartTable = document.querySelector('.shoppingCart-table');
var cardItemTitle = document.querySelector('.cardItem-title');
var perItemCart = document.querySelector('.perItemCart');
var jsTotal = document.querySelector('.js-total');
var orderInfoBtn = document.querySelector('.orderInfo-btn'); //axios.get資料

var wData = [];
init(); //get一般product

function axiosGet() {
  axios.get("".concat(api_Url, "/products")).then(function (response) {
    wData = response.data.products;
    console.log(wData);
    renderData(wData, productWrap);
  })["catch"](function (err) {
    console.log(err);
  });
} //渲染一般product


function renderData(data, domElement) {
  var str = "";
  data.forEach(function (item) {
    if (data.length > 0) {
      str += productHTML(item);
    } else {
      return "";
    }

    domElement.innerHTML = str;
  });
} //篩選一般product


productSelect.addEventListener('change', function (e) {
  var categorySelect = e.target.value;
  var filterData = wData.filter(function (el) {
    return el.category === categorySelect;
  });
  categorySelect === "全部" ? renderData(wData) : renderData(filterData);
}); //初始化

function init() {
  axiosGet();
  getCart();
  productSelect.value = "全部";
}

var subtotal = 0; //函式消除重複

function cartHTML(item) {
  var _item$product = item.product,
      title = _item$product.title,
      images = _item$product.images,
      price = _item$product.price;
  var quantity = item.quantity,
      id = item.id;
  subtotal = price * quantity;
  return "<tr class=\"perItem\"><td>\n    <div class=\"cardItem-title\">\n        <img src=\"".concat(images, "\" alt=\"\">\n        <p>").concat(title, "</p>\n    </div>\n</td>\n<td>NT$").concat(price, "</td>\n<td>").concat(quantity, "</td>\n<td class=\"subtotal\">NT$").concat(subtotal, "</td>\n<td class=\"discardBtn\">\n<a href=\"#\" class=\"material-icons\" data-id=\"").concat(id, "\"> \n    clear\n</a>\n</td></tr>");
} //注意取用cart的id還是product的id


function productHTML(item) {
  var id = item.id,
      images = item.images,
      title = item.title,
      origin_price = item.origin_price,
      price = item.price;
  return " <li class=\"productCard\">\n    <h4 class=\"productType\">\u65B0\u54C1</h4>\n    <img src=\"".concat(images, "\" alt=\"\">\n    <a href=\"#\" class=\"addCardBtn\" data-id=\"").concat(id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n    <h3>").concat(title, "</h3>\n    <del class=\"originPrice\">NT$").concat(origin_price, "</del>\n    <p class=\"nowPrice\">NT$").concat(price, "</p>\n    </li> ");
} //get購物車carts


var cData = [];

function getCart() {
  axios.get("".concat(api_Url, "/carts")).then(function (response) {
    cData = response.data.carts;
    var finalTot = response.data.finalTotal;
    rendercData(cData, perItemCart);
    jsTotal.textContent = finalTot;
  })["catch"](function (err) {
    console.log(err);
  });
} //渲染購物車 carts


function rendercData(data, domElement) {
  var str = "";
  data.forEach(function (item) {
    if (data.length == 0) {
      return str;
    } else {
      str += cartHTML(item);
    }

    domElement.innerHTML = str;
  });
  console.log('渲染購物車成功');
} //『加入購物車』按鈕的監聽//技巧：監聽整個顯示商品的ul區域，可以限制監聽行為不會莫名其妙跑到其他區塊去，一個一個綁效能很差。缺點二：萬一寫到後面有一樣的li的class名稱，監聽會套用在你沒預期的地方。


productWrap.addEventListener('click', function (e) {
  e.preventDefault();
  var addBtnClass = e.target.getAttribute('class');

  if (addBtnClass !== 'addCardBtn') {
    return;
  }

  var productId = e.target.getAttribute('data-id');
  var num = 1;
  cData.forEach(function (item) {
    if (item.product.id === productId) {
      num = item.quantity += 1;
    } else {
      item.quantity = num;
    }
  });
  console.log(num);
  axios.post("".concat(api_Url, "/carts"), {
    "data": {
      "productId": productId,
      "quantity": num
    }
  }).then(function (response) {
    alert('加入購物車成功！');
    getCart();
  });
}); //『刪除單筆』按鈕的監聽//多個按鈕，往上找父層，僅綁tbody

perItemCart.addEventListener('click', function (e) {
  e.preventDefault();
  var cartId = e.target.getAttribute('data-id');
  console.log(cartId);

  if (cartId == null) {
    return;
  } else {
    axios["delete"]("".concat(api_Url, "/carts/").concat(cartId)).then(function (response) {
      console.log(response);
      alert('刪除購物車成功！');
      getCart();
    });
  }
});
var discardAllBtn = document.querySelector('.discardAllBtn'); //『刪除全部』按鈕的監聽//單個按鈕，僅綁單個按鈕

discardAllBtn.addEventListener('click', function (e) {
  e.preventDefault();
  axios["delete"]("".concat(api_Url, "/carts/")).then(function (response) {
    alert('購物車成功清空！');
    getCart();
  })["catch"](function (err) {
    alert('已清空，勿重複點擊');
  });
}); //『送出預定資料』按鈕的監聽//單個按鈕，僅綁單個按鈕

orderInfoBtn.addEventListener('click', function (e) {
  e.preventDefault();

  if (cData.length == 0) {
    alert("購物車裡尚未有品項，請加入至少一項再送出！");
    return;
  }

  var customerName = document.querySelector('#customerName').value;
  var customerPhone = document.querySelector('#customerPhone').value;
  var customerEmail = document.querySelector('#customerEmail').value;
  var customerAddress = document.querySelector('#customerAddress').value;
  var tradeWay = document.querySelector('#tradeWay').value;

  if (customerName == "" || customerPhone == "" || customerAddress == "" || customerEmail == "") {
    alert("資料不全，請檢查再送出！");
  }

  axios.post("".concat(api_Url, "/orders"), {
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": tradeWay
      }
    }
  }).then(function (response) {
    alert('送出訂單成功！');
    customerName = "";
    customerPhone = "";
    customerEmail = "";
    customerAddress = "";
    tradeWay = "";
  });
  axios["delete"]("".concat(api_Url, "/carts/")).then(function (response) {
    getCart();
  });
});
/*async function clearAfterOrder(){
    await  axios.post(`${api_Url}/orders`,{
        "data": {
          "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress,
            "payment": tradeWay
          }
        }
      }).then(function(response){
        alert('送出訂單成功！')
        customerName = "";
        customerPhone = "";
        customerEmail = "";
        customerAddress = "";
        tradeWay= "";})

    await  axios.delete(`${api_Url}/carts/`)
      .then(function(response){
          getCart();
      })
}*/

/*|| 
addCardBtn.forEach((btn) =>{
      btn.addEventListener('click', (e) => {
      const idVal = e.target.getAttribute('id');
      let num = 1;
      //舊盲點：一直想要使用畫面上已有的元素，但沒想到依賴api的部分
      cData.forEach((el) =>{
          if(el.product.id===idVal){
              console.log("下方車已有");
              num = item.quantity +=1;
          }else{
          console.log("下方車未有");
           let print = document.createElement('tr');
           let lastCart = shoppingCartTable.lastChild;
           cData.filter(item =>{
              item.product.id === idVal;
              print.innerHTML = cartHTML(item); 
      print.setAttribute('id',idVal);
      shoppingCartTable.insertBefore(print,lastCart);//效能（？
           })
          
          }
      })
  })
})*/
//# sourceMappingURL=all.js.map
