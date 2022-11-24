const api_Path = '2022nov';
const api_Src = "https://livejs-api.hexschool.io/api/livejs/v1";
const token = "BvRBbqadN2RAHi0hwsvYiN0VQAy1";
const js0rderList = document.querySelector('.js-orderList');

let orderData = [];


getOrderList();

// axios get訂單列表
function getOrderList(){
    axios.get(`${api_Src}/admin/${api_Path}/orders`,{
        headers:{
           "Authorization": token
        }
    })
  .then(function(response){
    orderData = response.data.orders;
    console.log(orderData);
    renderOrderList(orderData);
  })
  .catch(function(err){
    console.log(err);
  })
}

let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});

// 渲染訂單order list
function renderOrderList(data){
    let str ="";
    //組產品字串
    //判斷訂單狀態
    //組訂單字串
    data.forEach(el =>{
        const {user, id, createdAt, paid, products} = el;
        let productStr ="";
        products.forEach(item =>{
        productStr +=`<p>${item.title}x${item.quantity}</p>`;
        })
        let orderStatus ="";
        if(paid==true){
            orderStatus ="已處理";
        }else{
            orderStatus ="未付款";
        }
        str+= `<tr>
        <td width="10%">${id}</td>
        <td width="10%">
          <p>${user.name}</p>
          <p>${user.tel}</p>
        </td>
        <td width="10%">${user.address}</td>
        <td width="15%">${user.email}</td>
        <td width="25%">
        ${productStr}
        </td>
        <td width="10%">${createdAt}</td>
        <td width="10%" class="orderStatus">
          <a href="#" data-id="${id}" data-status="${paid}" class="orderStatus">${orderStatus}</a>
        </td>
        <td width="10%">
          <input type="button" class="delSingleOrder-Btn" data-id="${id}" value="刪除">
        </td>
    </tr>`;
  
    js0rderList.innerHTML = str; //放在forEach裡才渲染得出來
    }) 
    
    js0rderList.addEventListener('click',(e) =>{
        e.preventDefault();
        const targetClass = e.target.getAttribute('class'); //抓到未付款＆刪除的class
        const itemId = e.target.getAttribute('data-id'); //兩個id一樣，class不同去二分情況
        const paidStatus = e.target.getAttribute('data-status');
        if(targetClass =="orderStatus"){
            console.log(itemId);
            console.log(paidStatus);
            changeStatus(paidStatus,itemId);
            return;
        }else if(targetClass =="delSingleOrder-Btn"){
         deleteOrder(itemId);
        }
    })
}

//寫個別『刪除訂單資料』的函式axios delete

function deleteOrder(id){
  axios.delete(`${api_Src}/admin/${api_Path}/orders/${id}`,{
    headers:{
       "Authorization": token
    }
})
  .then(function(response){
    getOrderList();
  })
}

//寫個別『更改訂單狀態』的函式axios put -注意axios規定參數格式

function changeStatus(status,id){
    console.log(status);
    let updateStatus;
    if(status=="true"){
        updateStatus=false;
        console.log(`現在改成${updateStatus}`)
    }else{
        updateStatus=true;
        console.log(`現在改成${updateStatus}`)
    }
    axios.put(`${api_Src}/admin/${api_Path}/orders`,{
        "data": {
          "id": `${id}`,
          "paid": `${updateStatus}`
        }
      },{
        headers:{
           "Authorization": token
        }
    })
      .then(function(response){
        alert('修改訂單狀態成功！');
        getOrderList();
      })
      .catch(function(error){
        console.log(error);
      })
}




