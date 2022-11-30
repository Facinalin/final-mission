
// ~作業預設

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

//utility js
//千分位
 
function toThousands(x) {
    let parts = x.toString().split("."); 
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    return parts.join("."); 
}
