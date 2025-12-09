// Data
const PRODUCTS = [
  {id:1,title:'Наушники беспроводные',price:2500,img:'https://extremecomp.ru/media/img/2020000/2023795_v01_b.webp'},
  {id:2,title:'Механическая клавиатура',price:4200,img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=60'},
  {id:3,title:'Игровая мышь',price:1900,img:'https://avatars.mds.yandex.net/i?id=2baf109cd753f8be3bb470951880ce95dcc5a454-5234939-images-thumbs&n=13'},
  {id:4,title:'Монитор 24”',price:14500,img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60'},
  {id:5,title:'Микрофон стримера',price:3300,img:'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=800&q=60'},
  {id:6,title:'SSD 1TB',price:7600,img:'https://avatars.mds.yandex.net/i?id=c37c0c5a82c88f3a11766a685ccbd83088410534-5233270-images-thumbs&n=13'}
];

let cart = [];

// Render products
const productsGrid = document.getElementById('products-grid');
function renderProducts(){
  productsGrid.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div class="price">${p.price} сом</div>
      <div class="actions">
        <button class="btn ghost" data-id="${p.id}" onclick="viewProduct(${p.id})">Подробнее</button>
        <button class="btn primary" data-id="${p.id}" onclick="addToCart(${p.id})">Купить</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}
window.viewProduct = function(id){
  const p = PRODUCTS.find(x=>x.id===id);
  alert(p.title + '\nЦена: ' + p.price + ' сом\nЭто простой макет страницы товара.');
}

// Cart functions
function addToCart(id){
  const it = PRODUCTS.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({...it,qty:1});
  updateCartUI();
  flashCart();
}
function updateCartUI(){
  document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
  const itemsWrap = document.getElementById('cart-items');
  itemsWrap.innerHTML = '';
  if(cart.length===0){ itemsWrap.innerHTML = '<p>Корзина пуста</p>'; document.getElementById('cart-total').textContent = '0'; return; }
  cart.forEach(item=>{
    const row = document.createElement('div'); row.className='cart-row';
    row.innerHTML = `
      <img src="${item.img}" alt="">
      <div class="meta">
        <strong>${item.title}</strong>
        <div class="muted">${item.price} сом</div>
      </div>
      <div class="qty">
        <button class="btn ghost" onclick="changeQty(${item.id},-1)">-</button>
        <div>${item.qty}</div>
        <button class="btn ghost" onclick="changeQty(${item.id},1)">+</button>
        <button class="btn ghost" style="margin-left:8px" onclick="removeFromCart(${item.id})">Удалить</button>
      </div>
    `;
    itemsWrap.appendChild(row);
  });
  document.getElementById('cart-total').textContent = cart.reduce((s,i)=>s+i.price*i.qty,0);
}
function changeQty(id,delta){
  const it = cart.find(c=>c.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty<=0) removeFromCart(id);
  updateCartUI();
}
function removeFromCart(id){
  cart = cart.filter(c=>c.id!==id);
  updateCartUI();
}
function flashCart(){
  const btn = document.getElementById('cart-btn');
  btn.animate([{transform:'scale(1.0)'},{transform:'scale(1.05)'},{transform:'scale(1.0)'}],{duration:300});
}

// Modal controls
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
document.getElementById('cart-btn').addEventListener('click', (e)=>{
  e.preventDefault();
  cartModal.setAttribute('aria-hidden','false');
});
document.getElementById('cart-close').addEventListener('click', ()=>cartModal.setAttribute('aria-hidden','true'));
document.getElementById('checkout-btn').addEventListener('click', ()=>{ cartModal.setAttribute('aria-hidden','true'); checkoutModal.setAttribute('aria-hidden','false'); });
document.getElementById('checkout-close').addEventListener('click', ()=>checkoutModal.setAttribute('aria-hidden','true'));

// Checkout form
document.getElementById('checkout-form').addEventListener('submit', function(e){
  e.preventDefault();
  // fake processing
  const form = e.target;
  form.hidden = true;
  document.getElementById('checkout-thanks').hidden = false;
  cart = [];
  updateCartUI();
});

// Initial render
renderProducts();
updateCartUI();
document.getElementById('year').textContent = new Date().getFullYear();

// HERO slider logic
(function slider(){
  const slidesWrap = document.querySelector('.slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const left = document.getElementById('slide-left');
  const right = document.getElementById('slide-right');
  const dotsWrap = document.getElementById('slider-dots');
  let idx = 0;
  let autoplay = true;
  let timer = null;

  function go(i){
    idx = (i + slides.length) % slides.length;
    slidesWrap.style.transform = `translateX(-${idx*100}%)`;
    Array.from(dotsWrap.children).forEach((b,bi)=>b.classList.toggle('active', bi===idx));
  }
  slides.forEach((s, i)=>{
    const b = document.createElement('button');
    if(i===0) b.classList.add('active');
    b.addEventListener('click', ()=>{ go(i); resetTimer();});
    dotsWrap.appendChild(b);
  });
  left.addEventListener('click', ()=>{ go(idx-1); resetTimer();});
  right.addEventListener('click', ()=>{ go(idx+1); resetTimer();});

  function auto(){
    if(!autoplay) return;
    timer = setInterval(()=> go(idx+1), 4500);
  }
  function resetTimer(){
    autoplay = true;
    if(timer) clearInterval(timer);
    auto();
  }
  go(0);
  auto();

  // pause on hover
  const hero = document.getElementById('hero-slider');
  hero.addEventListener('mouseenter', ()=>{ autoplay = false; if(timer) clearInterval(timer);});
  hero.addEventListener('mouseleave', ()=>{ autoplay = true; auto();});
})();
