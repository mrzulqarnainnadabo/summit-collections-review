const WHATSAPP_NUMBER = '2347082812850';
const pieces = [
  {id:'01',file:'IMG_3979.png',tone:'neutral'},
  {id:'02',file:'IMG_3980.png',tone:'neutral'},
  {id:'03',file:'IMG_3981.png',tone:'dark'},
  {id:'04',file:'IMG_3982.png',tone:'dark'},
  {id:'05',file:'IMG_3983.png',tone:'colour'},
  {id:'06',file:'IMG_3984.png',tone:'neutral'},
  {id:'07',file:'IMG_3985.png',tone:'neutral'},
  {id:'08',file:'IMG_3986.png',tone:'colour'},
  {id:'09',file:'IMG_3987.png',tone:'colour'},
  {id:'10',file:'IMG_3988.png',tone:'colour'},
  {id:'11',file:'IMG_3989.png',tone:'colour'},
  {id:'12',file:'IMG_3990.png',tone:'colour'},
  {id:'13',file:'IMG_3991.png',tone:'colour'},
  {id:'14',file:'IMG_3992.png',tone:'dark'},
  {id:'15',file:'IMG_3993.png',tone:'dark'},
  {id:'16',file:'IMG_3994.png',tone:'colour'},
  {id:'17',file:'IMG_3995.png',tone:'dark'},
  {id:'18',file:'IMG_3996.png',tone:'colour'},
  {id:'19',file:'IMG_3997.png',tone:'neutral'}
];
const $ = (selector) => document.querySelector(selector);
const grid = $('#productGrid');
const dialog = $('#productDialog');
const overlay = $('#overlay');
let activePiece = null;
let quantity = 1;
let cart = [];
let activeFilter = 'all';
let searchTerm = '';
let restoreFocus = null;
try { cart = JSON.parse(localStorage.getItem('summit-selection') || '[]'); } catch (_) { cart = []; }

function imagePath(piece){ return piece.file; }
function whatsappUrl(message){ return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message); }
function renderPieces(){
  const filtered = pieces.filter((piece) => {
    const matchesTone = activeFilter === 'all' || piece.tone === activeFilter;
    const matchesSearch = ('piece ' + piece.id).includes(searchTerm) || piece.id.includes(searchTerm);
    return matchesTone && matchesSearch;
  });
  $('#pieceCount').textContent = filtered.length;
  grid.innerHTML = filtered.map((piece) => (
    '<article class="product-card" data-piece="' + piece.id + '">' +
      '<div class="product-media" role="button" tabindex="0" data-open="' + piece.id + '" aria-label="View Piece ' + piece.id + '">' +
        '<img src="' + imagePath(piece) + '" alt="Original Summit Collections garment photograph, Piece ' + piece.id + '" loading="lazy">' +
        '<span class="product-number">SC / ' + piece.id + '</span>' +
        '<button class="quick-view" type="button" data-open="' + piece.id + '">View piece ↗</button>' +
      '</div>' +
      '<div class="product-info"><div><h3>Piece ' + piece.id + '</h3><p>Original collection photograph</p></div><span class="product-price">Price on enquiry</span></div>' +
    '</article>'
  )).join('') || '<p class="empty-results">No pieces match that search. Try another number or filter.</p>';
  observeCards();
}
function observeCards(){
  const cards = document.querySelectorAll('.product-card');
  if (!('IntersectionObserver' in window)) { cards.forEach(card => card.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, {threshold:.08});
  cards.forEach((card) => observer.observe(card));
}
function openPiece(id){
  activePiece = pieces.find(piece => piece.id === id);
  if(!activePiece) return;
  restoreFocus = document.activeElement;
  quantity = 1;
  $('#dialogImage').src = imagePath(activePiece);
  $('#dialogImage').alt = 'Original Summit Collections garment photograph, Piece ' + activePiece.id;
  $('#dialogTitle').textContent = 'Piece ' + activePiece.id;
  $('#dialogCategory').textContent = 'THE COLLECTION · SC / ' + activePiece.id;
  $('#dialogSize').value = '';
  $('#dialogQty').textContent = quantity;
  $('#dialogEnquire').href = whatsappUrl('Hello The Summit Collections, I would like to enquire about Piece ' + activePiece.id + '. Please confirm the price, available sizes and current availability.');
  if(typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open','');
}
function closePiece(){ if(dialog.open) dialog.close(); else dialog.removeAttribute('open'); if(restoreFocus && restoreFocus.focus) restoreFocus.focus(); }
function persistCart(){ try { localStorage.setItem('summit-selection', JSON.stringify(cart)); } catch (_) {} renderCart(); }
function addToCart(){
  if(!activePiece) return;
  const size = $('#dialogSize').value.trim();
  const found = cart.find(item => item.id === activePiece.id && item.size === size);
  if(found) found.qty += quantity;
  else cart.push({id:activePiece.id,size:size,qty:quantity});
  persistCart();
  closePiece();
  openBag();
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
      '<img src="' + imagePath(piece) + '" alt="Piece ' + piece.id + '">' +
      '<div><h3>Piece ' + piece.id + '</h3><p>' + (item.size ? 'Preferred size: ' + escapeHtml(item.size) : 'Size to be confirmed') + '</p><div class="line-qty">Qty ' + item.qty + '</div></div>' +
      '<button type="button" data-remove="' + item.id + '" data-size="' + escapeHtml(item.size) + '">Remove</button>' +
    '</div>';
  }).join('');
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
  const lines = cart.map(item => '• Piece ' + item.id + ' — Qty ' + item.qty + ' — Preferred size: ' + (item.size || 'Please advise'));
  const message = [
    'Hello The Summit Collections, I would like to place an order enquiry.',
    '',
    'Name: ' + name,
    'Delivery location: ' + location,
    '',
    'My selection:',
    lines.join('\n'),
    '',
    'Please confirm the prices, available sizes, stock and delivery details before payment.'
  ].join('\n');
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
}
function setFilter(filter){
  activeFilter = filter;
  document.querySelectorAll('.filter-button').forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderPieces();
}
document.addEventListener('click', (event) => {
  const open = event.target.closest('[data-open]');
  if(open){ event.preventDefault(); openPiece(open.dataset.open); return; }
  const remove = event.target.closest('[data-remove]');
  if(remove){ cart = cart.filter(item => !(item.id === remove.dataset.remove && item.size === remove.dataset.size)); persistCart(); }
});
document.addEventListener('keydown', (event) => {
  const open = event.target.closest('[data-open]');
  if(open && (event.key === 'Enter' || event.key === ' ')){ event.preventDefault(); openPiece(open.dataset.open); }
  if((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'){ event.preventDefault(); $('#productSearch').focus(); }
});
document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
$('#productSearch').addEventListener('input', event => { searchTerm = event.target.value.trim().toLowerCase(); renderPieces(); });
$('#bagOpen').addEventListener('click', openBag);
$('#bagClose').addEventListener('click', closeBag);
$('#continueShopping').addEventListener('click', closeBag);
overlay.addEventListener('click', closeBag);
$('#dialogClose').addEventListener('click', closePiece);
$('#dialogAdd').addEventListener('click', addToCart);
$('#qtyDown').addEventListener('click', () => { quantity = Math.max(1, quantity - 1); $('#dialogQty').textContent = quantity; });
$('#qtyUp').addEventListener('click', () => { quantity = Math.min(20, quantity + 1); $('#dialogQty').textContent = quantity; });
$('#enquiryForm').addEventListener('submit', submitEnquiry);
dialog.addEventListener('click', event => { if(event.target === dialog) closePiece(); });
$('#menuToggle').addEventListener('click', () => {
  const open = $('#mainNav').classList.toggle('is-open');
  $('#menuToggle').setAttribute('aria-expanded', String(open));
  $('#menuToggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  $('#mainNav').classList.remove('is-open'); $('#menuToggle').setAttribute('aria-expanded','false');
}));
$('#year').textContent = new Date().getFullYear();
renderPieces();
renderCart();
