const WHATSAPP_NUMBER = '2347082812850';
const pieces = [
  {id:'01',file:'IMG_3979.png',tone:'neutral',title:"Eid Kid's Abayas",price:52500,sizes:['38','40','42','44','46','48','50']},
  {id:'02',file:'IMG_3980.png',tone:'neutral',price:null,sizes:['58','60']},
  {id:'03',file:'IMG_3981.png',gallery:['IMG_3982.png'],tone:'dark',price:70000,sizes:['56','58','60','62']},
  {id:'04',file:'IMG_3983.png',tone:'colour',price:70000,sizes:['56','58','60','62']},
  {id:'05',file:'IMG_3984.png',tone:'neutral',price:70000,sizes:['56','58','60','62']},
  {id:'06',file:'IMG_3985.png',tone:'colour',price:70000,sizes:['56','58','60','62']},
  {id:'07',file:'IMG_3986.png',tone:'colour',price:70000,sizes:['56','58','60','62']},
  {id:'08',file:'IMG_3987.png',tone:'colour',price:null,sizes:[]},
  {id:'09',file:'IMG_3988.png',tone:'colour',price:480000,sizes:['58','60','62']},
  {id:'10',file:'IMG_3989.png',gallery:['IMG_3990.png'],tone:'colour',title:'Closed Abaya',price:65000,sizes:['54','56','58','60','62']},
  {id:'11',file:'IMG_3991.png',tone:'colour',price:165000,sizes:[]},
  {id:'12',file:'IMG_3992.png',tone:'dark',price:165000,sizes:['54','56']},
  {id:'13',file:'IMG_3993.png',tone:'dark',price:null,sizes:[]},
  {id:'14',file:'IMG_3994.png',tone:'colour',price:330000,sizes:['58','60','62']},
  {id:'15',file:'IMG_3995.png',tone:'colour',price:330000,sizes:['58','60']},
  {id:'16',file:'IMG_3996.png',tone:'colour',price:70000,sizes:['56','58','60','62']},
  {id:'17',file:'IMG_3997.png',tone:'neutral',colourLabel:'Peach',price:null,sizes:['58']}
];
const $ = (selector) => document.querySelector(selector);
const grid = $('#productGrid');
const dialog = $('#productDialog');
const overlay = $('#overlay');
let activePiece = null;
let activeGalleryIndex = 0;
let quantity = 1;
let cart = [];
let activeFilter = 'all';
let searchTerm = '';
let restoreFocus = null;
try { cart = JSON.parse(localStorage.getItem('summit-selection') || '[]'); } catch (_) { cart = []; }

function imagePath(file, width){ return '/.netlify/images?url=%2F' + encodeURIComponent(file) + '&w=' + (width || 960) + '&fm=webp&q=74'; }
function setImage(img, file, width){ img.dataset.original = file; img.src = imagePath(file, width); }
function fallbackBrokenImages(){ document.querySelectorAll('img[data-original]').forEach(img => { if(img.complete && img.naturalWidth === 0){ const fallback = img.dataset.original; delete img.dataset.original; img.src = fallback; } }); }
function titleOf(piece){ return piece.title || 'Piece ' + piece.id; }
function priceOf(piece){ return piece.price ? '₦' + piece.price.toLocaleString('en-NG') : 'Price on enquiry'; }
function toneOf(piece){ return ({neutral:'Soft neutral',dark:'Dark tone',colour:'Colour story'})[piece.tone] || 'Original collection'; }
function whatsappUrl(message){ return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message); }
function allImages(piece){ return [piece.file].concat(piece.gallery || []); }
function renderPieces(){
  const filtered = pieces.filter((piece) => {
    const matchesTone = activeFilter === 'all' || piece.tone === activeFilter;
    const haystack = (titleOf(piece) + ' piece ' + piece.id + ' ' + (piece.colourLabel || '')).toLowerCase();
    const matchesSearch = haystack.includes(searchTerm) || piece.id.includes(searchTerm);
    return matchesTone && matchesSearch;
  });
  $('#pieceCount').textContent = filtered.length;
  grid.innerHTML = filtered.map((piece) => (
    '<article class="product-card" data-piece="' + piece.id + '">' +
      '<div class="product-media" role="button" tabindex="0" data-open="' + piece.id + '" aria-label="View ' + escapeHtml(titleOf(piece)) + '">' +
        '<img src="' + imagePath(piece.file,760) + '" data-original="' + piece.file + '" alt="Original Summit Collections garment photograph, ' + escapeHtml(titleOf(piece)) + '" loading="lazy" decoding="async">' +
        '<span class="product-number">SC / ' + piece.id + '</span>' +
        '<button class="quick-view" type="button" data-open="' + piece.id + '">View piece ↗</button>' +
      '</div>' +
      '<div class="product-info"><div><h3>' + escapeHtml(titleOf(piece)) + '</h3><p>' + escapeHtml(piece.colourLabel || toneOf(piece)) + (piece.gallery && piece.gallery.length ? ' · ' + (piece.gallery.length+1) + ' views' : '') + '</p></div><span class="product-price">' + priceOf(piece) + (piece.price ? '<small>Listed price*</small>' : '') + '</span></div>' +
    '</article>'
  )).join('') || '<p class="empty-results">No pieces match that search. Try another number or filter.</p>';
  observeCards();
}
function observeCards(){
  const cards = document.querySelectorAll('.product-card');
  if (!('IntersectionObserver' in window)) { cards.forEach(card => card.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, {threshold:.08});
  cards.forEach((card) => observer.observe(card));
}
function renderGallery(){
  const thumbs = $('#dialogThumbs');
  const images = allImages(activePiece);
  thumbs.innerHTML = '';
  thumbs.hidden = images.length < 2;
  images.forEach((file,index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dialog-thumb' + (index === activeGalleryIndex ? ' is-active' : '');
    button.dataset.galleryIndex = String(index);
    button.setAttribute('aria-label','View image ' + (index+1));
    const img = document.createElement('img');
    img.src = imagePath(file,180);
    img.dataset.original = file;
    img.alt = titleOf(activePiece) + ' view ' + (index+1);
    button.appendChild(img);
    thumbs.appendChild(button);
  });
}
function renderSizeOptions(){
  const wrap = $('#dialogSizes');
  const list = $('#sizeOptions');
  list.innerHTML = '';
  wrap.hidden = !activePiece.sizes || !activePiece.sizes.length;
  (activePiece.sizes || []).forEach(size => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'size-chip';
    button.textContent = size;
    button.dataset.size = size;
    list.appendChild(button);
  });
}
function openPiece(id){
  activePiece = pieces.find(piece => piece.id === id);
  if(!activePiece) return;
  restoreFocus = document.activeElement;
  quantity = 1;
  activeGalleryIndex = 0;
  setImage($('#dialogImage'),activePiece.file,1200);
  $('#dialogImage').alt = 'Original Summit Collections garment photograph, ' + titleOf(activePiece);
  $('#dialogTitle').textContent = titleOf(activePiece);
  $('#dialogCategory').textContent = 'THE COLLECTION · SC / ' + activePiece.id;
  $('#dialogDescription').textContent = activePiece.title ? 'A listed piece from the original Summit Collections edit. Contact our team to confirm the current details.' : 'An original piece from the supplied Summit Collections edit. Ask our team for fabric, fit and styling details.';
  $('#dialogPriceLabel').textContent = activePiece.price ? 'PRICE IN ORIGINAL POST' : 'PRICE';
  $('#dialogPrice').textContent = priceOf(activePiece);
  $('#dialogSize').value = '';
  $('#dialogQty').textContent = quantity;
  renderGallery();
  renderSizeOptions();
  $('#dialogEnquire').href = whatsappUrl('Hello The Summit Collections, I would like to enquire about ' + titleOf(activePiece) + ' (SC / ' + activePiece.id + '). Please confirm the current price, available sizes and availability.');
  if(typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
  fallbackBrokenImages();
}
function closePiece(){ if(dialog.open) dialog.close(); else dialog.removeAttribute('open'); if(restoreFocus && restoreFocus.focus) restoreFocus.focus(); }
function persistCart(){ try { localStorage.setItem('summit-selection', JSON.stringify(cart)); } catch (_) {} renderCart(); }
function addToCart(){
  if(!activePiece) return;
  const size = $('#dialogSize').value.trim();
  const found = cart.find(item => item.id === activePiece.id && item.size === size);
  if(found) found.qty += quantity; else cart.push({id:activePiece.id,size:size,qty:quantity});
  persistCart(); closePiece(); openBag();
}
function renderCart(){
  const count = cart.reduce((sum,item) => sum + item.qty, 0);
  $('#bagCount').textContent = count;
  $('#drawerCount').textContent = '(' + count + ')';
  $('#bagEmpty').hidden = cart.length > 0;
  $('#enquiryForm').hidden = cart.length === 0;
  $('#bagItems').innerHTML = cart.map((item) => {
    const piece = pieces.find(p => p.id === item.id);
    if(!piece) return '';
    return '<div class="bag-line">' +
      '<img src="' + imagePath(piece.file,260) + '" data-original="' + piece.file + '" alt="' + escapeHtml(titleOf(piece)) + '" loading="lazy">' +
      '<div><h3>' + escapeHtml(titleOf(piece)) + '</h3><p>' + (item.size ? 'Preferred size: ' + escapeHtml(item.size) : 'Size to be confirmed') + '</p><div class="line-qty">Qty ' + item.qty + '</div></div>' +
      '<button type="button" data-remove="' + piece.id + '" data-size="' + escapeHtml(item.size) + '">Remove</button>' +
    '</div>';
  }).join('');
  fallbackBrokenImages();
}
function escapeHtml(value){ return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function openBag(){
  overlay.hidden = false;
  requestAnimationFrame(() => { overlay.classList.add('is-visible'); $('#bagDrawer').classList.add('is-open'); $('#bagDrawer').setAttribute('aria-hidden','false'); });
  document.body.classList.add('no-scroll');
  $('#bagClose').focus();
}
function closeBag(){
  $('#bagDrawer').classList.remove('is-open');
  $('#bagDrawer').setAttribute('aria-hidden','true');
  overlay.classList.remove('is-visible');
  setTimeout(() => { overlay.hidden = true; }, 400);
  document.body.classList.remove('no-scroll');
  $('#bagOpen').focus();
}
function submitEnquiry(event){
  event.preventDefault();
  if(!cart.length) return;
  const name = $('#customerName').value.trim();
  const location = $('#customerLocation').value.trim();
  const lines = cart.map(item => {
    const piece = pieces.find(p => p.id === item.id);
    return '• ' + titleOf(piece) + ' (SC / ' + piece.id + ') — Qty ' + item.qty + ' — Preferred size: ' + (item.size || 'Please advise') + ' — Listed price: ' + priceOf(piece);
  });
  const message = ['Hello The Summit Collections, I would like to place an order enquiry.','','Name: ' + name,'Delivery location: ' + location,'','My selection:',lines.join('\n'),'','Please confirm the current prices, available sizes, stock and delivery details before payment.'].join('\n');
  window.open(whatsappUrl(message),'_blank','noopener,noreferrer');
}
function setFilter(filter){
  activeFilter = filter;
  document.querySelectorAll('.filter-button').forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  renderPieces();
}
document.addEventListener('error',(event) => {
  const img = event.target;
  if(img && img.tagName === 'IMG' && img.dataset.original){ const fallback = img.dataset.original; delete img.dataset.original; img.src = fallback; }
},true);
document.addEventListener('click',(event) => {
  const galleryButton = event.target.closest('[data-gallery-index]');
  if(galleryButton && activePiece){
    activeGalleryIndex = Number(galleryButton.dataset.galleryIndex);
    const file = allImages(activePiece)[activeGalleryIndex];
    setImage($('#dialogImage'),file,1200);
    document.querySelectorAll('.dialog-thumb').forEach((button,index)=>button.classList.toggle('is-active',index===activeGalleryIndex));
    return;
  }
  const sizeButton = event.target.closest('[data-size]');
  if(sizeButton && activePiece){
    $('#dialogSize').value = sizeButton.dataset.size;
    document.querySelectorAll('.size-chip').forEach(button=>button.classList.toggle('is-selected',button===sizeButton));
    return;
  }
  const open = event.target.closest('[data-open]');
  if(open){ event.preventDefault(); openPiece(open.dataset.open); return; }
  const remove = event.target.closest('[data-remove]');
  if(remove){ cart = cart.filter(item => !(item.id === remove.dataset.remove && item.size === remove.dataset.removeSize)); persistCart(); }
});
document.addEventListener('keydown',(event) => {
  const open = event.target.closest('[data-open]');
  if(open && (event.key === 'Enter' || event.key === ' ')){ event.preventDefault(); openPiece(open.dataset.open); }
  if((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'){ event.preventDefault(); $('#productSearch').focus(); }
});
document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.filter)));
$('#productSearch').addEventListener('input',event=>{searchTerm=event.target.value.trim().toLowerCase();renderPieces();});
$('#bagOpen').addEventListener('click',openBag);
$('#bagClose').addEventListener('click',closeBag);
$('#continueShopping').addEventListener('click',closeBag);
overlay.addEventListener('click',closeBag);
$('#dialogClose').addEventListener('click',closePiece);
$('#dialogAdd').addEventListener('click',addToCart);
$('#qtyDown').addEventListener('click',()=>{quantity=Math.max(1,quantity-1);$('#dialogQty').textContent=quantity;});
$('#qtyUp').addEventListener('click',()=>{quantity=Math.min(20,quantity+1);$('#dialogQty').textContent=quantity;});
$('#enquiryForm').addEventListener('submit',submitEnquiry);
dialog.addEventListener('click',event=>{if(event.target===dialog)closePiece();});
$('#menuToggle').addEventListener('click',()=>{
 const open=$('#mainNav').classList.toggle('is-open');
 $('#menuToggle').setAttribute('aria-expanded',String(open));
 $('#menuToggle').setAttribute('aria-label',open?'Close navigation':'Open navigation');
});
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{
 $('#mainNav').classList.remove('is-open');$('#menuToggle').setAttribute('aria-expanded','false');
}));
$('#year').textContent=new Date().getFullYear();
renderPieces();renderCart();fallbackBrokenImages();
