// ~作業預設
document.addEventListener('DOMContentLoaded', function() {
    const ele = document.querySelector('.recommendation-wall');
    ele.style.cursor = 'grab';
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
});
// menu 切換
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
})

function menuToggle() {
    if(menu.classList.contains('openMenu')) {
        menu.classList.remove('openMenu');
    }else {
        menu.classList.add('openMenu');
    }
}
function closeMenu() {
    menu.classList.remove('openMenu');
}

// ~作業預設

const productWrap = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const api_Url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/2022nov";
const api_Urlm = "https://livejs-api.hexschool.io/api/livejs/v1/admin/2022nov";
const api_Path = '2022nov';
const api_Src = "https://livejs-api.hexschool.io/api/livejs/v1"
const shoppingCartTable = document.querySelector('.shoppingCart-table');
const cardItemTitle = document.querySelector('.cardItem-title');
const perItemCart = document.querySelector('.perItemCart');
const jsTotal = document.querySelector('.js-total');
const orderInfoBtn = document.querySelector('.orderInfo-btn');
const token = "BvRBbqadN2RAHi0hwsvYiN0VQAy1";

//axios.get資料

let wData = [];

init();

//get一般product
function axiosGet(){
  axios.get(`${api_Url}/products`)
  .then(function(response){
    wData = response.data.products;
    console.log(wData);

    renderData(wData,productWrap);
   
})
  .catch(function(err){
    console.log(err);
  })
}

//渲染一般product
function renderData(data,domElement){
    let str ="";
    data.forEach(item =>{
        if(data.length>0){
        str += productHTML(item) }
    else{
        return "";
    }
    domElement.innerHTML = str;
    })  
    
}

//篩選一般product

productSelect.addEventListener('change', e =>{
    let categorySelect = e.target.value;
    const filterData = wData.filter(el =>{
        return el.category === categorySelect;
    })
    categorySelect === "全部"?renderData(wData):renderData(filterData);
})

//初始化
function init(){
    axiosGet();
    getCart();
    productSelect.value = "全部";
}

let subtotal = 0;
//函式消除重複
function cartHTML(item){
    const {title,images,price} = item.product;
    const {quantity, id} = item;
    subtotal = price*quantity;
    return `<tr class="perItem"><td>
    <div class="cardItem-title">
        <img src="${images}" alt="">
        <p>${title}</p>
    </div>
</td>
<td>NT$${price}</td>
<td>${quantity}</td>
<td class="subtotal">NT$${subtotal}</td>
<td class="discardBtn">
<a href="#" class="material-icons" data-id="${id}"> 
    clear
</a>
</td></tr>`
} //注意取用cart的id還是product的id

function productHTML(item){
    const {id, images, title,origin_price, price} = item;
    return ` <li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${images}" alt="">
    <a href="#" class="addCardBtn" data-id="${id}">加入購物車</a>
    <h3>${title}</h3>
    <del class="originPrice">NT$${origin_price}</del>
    <p class="nowPrice">NT$${price}</p>
    </li> `
}

//get購物車carts

let cData = [];

function getCart(){
    axios.get(`${api_Url}/carts`)
  .then(function(response){
    cData = response.data.carts;
    let finalTot = response.data.finalTotal;
    rendercData(cData,perItemCart)
    jsTotal.textContent = finalTot;
  })
  .catch(function(err){
    console.log(err);
  })
}


//渲染購物車 carts
function rendercData(data,domElement){
    let str ="";
    data.forEach(item =>{
    if(data.length>0){
         str += cartHTML(item);  
 }
})   
    domElement.innerHTML = str;

    console.log('渲染購物車成功');
}

//『加入購物車』按鈕的監聽//技巧：監聽整個顯示商品的ul區域，可以限制監聽行為不會莫名其妙跑到其他區塊去，一個一個綁效能很差。缺點二：萬一寫到後面有一樣的li的class名稱，監聽會套用在你沒預期的地方。

productWrap.addEventListener('click', (e) => {
    e.preventDefault();
    let addBtnClass = e.target.getAttribute('class');
    if (addBtnClass !== 'addCardBtn') {
        return
    }
    let productId = e.target.getAttribute('data-id');
    let num = 1;
    cData.forEach(item =>{
        if(item.product.id===productId){
            num = item.quantity +=1;
        }else{
            item.quantity = num;
        }
    })
    console.log(num);
    axios.post(`${api_Url}/carts`,{
        "data": {
            "productId": productId,
            "quantity": num
          }
    }).then(function(response){
        alert('加入購物車成功！')
        getCart();
    })

})
//『刪除單筆』按鈕的監聽//多個按鈕，往上找父層，僅綁tbody

perItemCart.addEventListener('click', (e) =>{
    e.preventDefault();
    const cartId = e.target.getAttribute('data-id');
    console.log(cartId);
    if(cartId==null){
        return;
    }else{
        axios.delete(`${api_Url}/carts/${cartId}`)
        .then(function(response){
            console.log(response);
            alert('刪除購物車成功！')   
            getCart();    
        })  
    }
   
})

const discardAllBtn = document.querySelector('.discardAllBtn');

//『刪除全部』按鈕的監聽//單個按鈕，僅綁單個按鈕

discardAllBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    axios.delete(`${api_Url}/carts/`)
        .then(function(response){
            alert('購物車成功清空！')   
            getCart();    
        })
        .catch(function(err){
            alert('已清空，勿重複點擊');
        })  
    })

//『送出預定資料』按鈕的監聽//單個按鈕，僅綁單個按鈕
orderInfoBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    if(cData.length==0){
    alert("購物車裡尚未有品項，請加入至少一項再送出！");
    return;
    }
    let customerName = document.querySelector('#customerName').value;
    let customerPhone = document.querySelector('#customerPhone').value;
    let customerEmail = document.querySelector('#customerEmail').value;
    let customerAddress = document.querySelector('#customerAddress').value;
    let tradeWay = document.querySelector('#tradeWay').value;
    if(customerName==""||customerPhone==""|| customerAddress==""|| customerEmail==""){
        alert("資料不全，請檢查再送出！");
        return;
    }
    axios.post(`${api_Url}/orders`,{
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
        console.log(response.data);
        getOrder();
        getCart();
        customerName = "";
        customerPhone = "";
        customerEmail = "";
        customerAddress = "";
        tradeWay= "";
    })
}) 

//get購物車carts


function getOrder(){
    axios.get(`${api_Urlm}/orders`,{
        headers:{
           "Authorization": token
        }
    })
  .then(function(response){
    console.log(response.data);
  })
  .catch(function(err){
    console.log(err);
  })
}




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








