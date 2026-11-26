var PRODUCTS=[
 {id:1,name:"Кружка «Морская»",cat:"Кружки",note:"300 мл",price:1200,color:"#1f6f6b",shape:"mug"},
 {id:2,name:"Кружка «Охра»",cat:"Кружки",note:"300 мл",price:1200,color:"#e0a82e",shape:"mug"},
 {id:3,name:"Ваза «Капля»",cat:"Вазы",note:"высота 22 см",price:2800,color:"#c5524a",shape:"vase"},
 {id:4,name:"Ваза «Туман»",cat:"Вазы",note:"высота 18 см",price:2400,color:"#7d8fa9",shape:"vase"},
 {id:5,name:"Тарелка «Дюна»",cat:"Тарелки",note:"диаметр 24 см",price:1500,color:"#b98a5b",shape:"plate"},
 {id:6,name:"Тарелка «Ночь»",cat:"Тарелки",note:"диаметр 24 см",price:1500,color:"#2a3560",shape:"plate"}
];
var SHAPES={
 mug:'<svg viewBox="0 0 100 100"><path d="M18 24h52v40a20 20 0 0 1-20 20H38a20 20 0 0 1-20-20z" fill="currentColor"/><path d="M70 34h8a12 12 0 0 1 0 28h-8" fill="none" stroke="currentColor" stroke-width="7"/></svg>',
 vase:'<svg viewBox="0 0 100 100"><path d="M34 10h32l-4 22c18 8 20 30 8 50-4 6-8 8-14 8h-12c-6 0-10-2-14-8-12-20-10-42 8-50z" fill="currentColor"/></svg>',
 plate:'<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="44" ry="14" fill="currentColor"/><ellipse cx="50" cy="56" rx="30" ry="8" fill="rgba(255,255,255,.3)"/></svg>'
};
var cart={},filter="Все";

function money(n){return n.toLocaleString("ru-RU")+" сом"}

function renderFilters(){
  var cats=["Все"].concat(PRODUCTS.map(function(p){return p.cat}).filter(function(c,i,a){return a.indexOf(c)===i}));
  var box=document.querySelector(".filters");box.innerHTML="";
  cats.forEach(function(c){
    var b=document.createElement("button");
    b.textContent=c;
    b.setAttribute("aria-pressed",c===filter);
    b.onclick=function(){filter=c;renderFilters();renderGrid()};
    box.appendChild(b);
  });
}

function renderGrid(){
  var g=document.getElementById("grid");g.innerHTML="";
  PRODUCTS.filter(function(p){return filter==="Все"||p.cat===filter}).forEach(function(p){
    var d=document.createElement("article");d.className="card";
    d.innerHTML='<div class="pic" style="background:'+p.color+'22;color:'+p.color+'">'+SHAPES[p.shape]+'</div><div class="info"><h3>'+p.name+'</h3><small>'+p.note+'</small><div class="row"><span class="price">'+money(p.price)+'</span><button class="add">В корзину</button></div></div>';
    d.querySelector(".add").onclick=function(){cart[p.id]=(cart[p.id]||0)+1;renderCart();open(true)};
    g.appendChild(d);
  });
}

function renderCart(){
  var ul=document.getElementById("items"),n=0,sum=0;ul.innerHTML="";
  PRODUCTS.forEach(function(p){
    var q=cart[p.id];if(!q)return;n+=q;sum+=q*p.price;
    var li=document.createElement("li");
    li.innerHTML='<div><div>'+p.name+'</div><small style="color:var(--muted)">'+money(p.price)+'</small></div><div class="qty"><button aria-label="Меньше">−</button><span>'+q+'</span><button aria-label="Больше">+</button></div>';
    var b=li.querySelectorAll("button");
    b[0].onclick=function(){cart[p.id]--;if(!cart[p.id])delete cart[p.id];renderCart()};
    b[1].onclick=function(){cart[p.id]++;renderCart()};
    ul.appendChild(li);
  });
  if(!n){ul.innerHTML='<li class="empty">Корзина пуста. Добавьте что-нибудь из каталога.</li>'}
  document.getElementById("count").textContent=n;
  document.getElementById("sum").textContent=money(sum);
  document.getElementById("checkout").disabled=!n;
}

function open(v){
  document.getElementById("drawer").classList.toggle("open",v);
  document.getElementById("veil").classList.toggle("open",v);
  document.getElementById("drawer").setAttribute("aria-hidden",!v);
  if(v)document.getElementById("msg").textContent="";
}

document.getElementById("openCart").onclick=function(){open(true)};
document.getElementById("closeCart").onclick=function(){open(false)};
document.getElementById("veil").onclick=function(){open(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape")open(false)});
document.getElementById("checkout").onclick=function(){
  cart={};renderCart();
  document.getElementById("msg").textContent="Заказ принят. Мы свяжемся с вами для подтверждения.";
};

renderFilters();renderGrid();renderCart();