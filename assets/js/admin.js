const api_Path = '2022nov';
const api_Src = "https://livejs-api.hexschool.io/api/livejs/v1";
const token = "BvRBbqadN2RAHi0hwsvYiN0VQAy1";
const js0rderList = document.querySelector('.js-orderList');

let orderData = [];

console.log('你還好嗎');

const deleteAllAdmin = document.querySelector('#deleteAllAdmin');

deleteAllAdmin.addEventListener('click', (e) => {
  e.preventDefault();
  axios.delete(`${api_Src}/admin/${api_Path}/orders`,{
    headers:{
       "Authorization": token
    }
})
  .then(function(response){
      alert('訂單列表成功清空！')   
      getOrderList();  
      console.log('成功渲染清空後的列表');
  })
  .catch(function(err){
      alert('已清空，勿重複點擊');
  })  
})


getOrderList();

// axios get訂單列表+順便執行c3
function getOrderList(){
    axios.get(`${api_Src}/admin/${api_Path}/orders`,{
        headers:{
           "Authorization": token
        }
    })
  .then(function(response){
    orderData = response.data.orders;
    renderOrderList(orderData);
    renderc3();
    console.log('渲染訂單成功');
  })
  .catch(function(err){
    console.log(err);
  })
}


//渲染c3圖表
function renderc3(){
    let total = {};
    orderData.forEach(item =>{
    const {products} = item;
    products.forEach(el =>{
    if(total[el.category]==undefined){
     total[el.category]=el.price*el.quantity;  
    }else{
     total[el.category]+=el.price*el.quantity;  
    }
    })
    })
    let categoryArr = Object.keys(total);
    let newData = [];
    categoryArr.forEach(el =>{
     let arr = [];
     arr.push(el);
     arr.push(total[el]);
     newData.push(arr);
    })
    newData.sort(function(a,b){
        return b[1]-a[1];
    })
    let otherTotal = 0;
    if(newData.length > 3){   
      newData.forEach((el,i) =>{
        if(i>2){
            otherTotal+=el[1];
        }
      })
    }
    newData.splice(3,newData.length-1)
    newData.push(['其他',otherTotal])


    let chart = c3.generate({
        bindto: '#chart', 
        data: {
            type: "pie",
            columns: newData,
            colors:{
                "窗簾":"#DACBFF",
                "床架":"#9D7FEA",
                "收納": "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
}

// 渲染訂單order list
function renderOrderList(data){
    let str ="";
    data.forEach(el =>{
        const {user, id, createdAt, paid, products} = el;
        //組成時間
        const timeStamp = new Date(createdAt*1000);
        const time = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`;
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
        <td width="10%">${time}</td>
        <td width="10%" class="orderStatus">
          <a href="#" data-id="${id}" data-status="${paid}" class="orderStatus">${orderStatus}</a>
        </td>
        <td width="10%">
          <input type="button" class="delSingleOrder-Btn" data-id="${id}" value="刪除">
        </td>
    </tr>`;
  
    js0rderList.innerHTML = str; //放在forEach裡才渲染得出來
    }) 
   
}

js0rderList.addEventListener('click',function(e){
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
          "id": id,
          "paid": updateStatus
        }
      },{
        headers:{
           "Authorization": token
        }
    })
      .then(function(response){
        getOrderList();
        console.log('修改訂單狀態成功！');
      })
      .catch(function(error){
        console.log(error);
      })
}

//刪除全部-補寫







