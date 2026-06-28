/* ── ACCORDION ── */
document.querySelectorAll('.acc-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item   = btn.parentElement;
    var isOpen = item.classList.contains('open');

    // Ferme tous
    document.querySelectorAll('.acc-item').forEach(function (i) {
      i.classList.remove('open');
      i.querySelector('.acc-btn').setAttribute('aria-expanded', 'false');
    });

    // Ouvre si était fermé
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── CAROUSEL ── */
document.querySelectorAll('[data-car]').forEach(function (car) {
  var track        = car.querySelector('.ct');
  var total        = track.querySelectorAll('img, video').length;
  var counter      = car.querySelector('.cc');
  var bar          = car.querySelector('.cpbar');
  var prev         = car.querySelector('.prev');
  var next         = car.querySelector('.next');
  var idx          = 0;
  var touchStartX  = 0;
  var drag         = false;
  var dragStartX   = 0;
  var dragStartIdx = 0;

  function go(n) {
    idx = (n % total + total) % total;
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    if (counter) counter.textContent = (idx + 1) + ' / ' + total;
    if (bar)     bar.style.width     = ((idx + 1) / total * 100) + '%';
  }
  go(0);

  // Masque les contrôles si un seul visuel
  if (total === 1) {
    if (prev)    prev.style.display              = 'none';
    if (next)    next.style.display              = 'none';
    if (counter) counter.parentElement.style.display = 'none';
    if (bar)     bar.parentElement.style.display     = 'none';
  }

  car.querySelector('.prev').addEventListener('click', function (e) { e.stopPropagation(); go(idx - 1); });
  car.querySelector('.next').addEventListener('click', function (e) { e.stopPropagation(); go(idx + 1); });

  car.setAttribute('tabindex', '0');
  car.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(idx + 1);
    if (e.key === 'ArrowLeft')  go(idx - 1);
  });
  
  // Touch swipe
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var d = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 36) go(d > 0 ? idx + 1 : idx - 1);
  });

  // Mouse drag
  track.addEventListener('mousedown', function (e) {
    drag = true;
    dragStartX   = e.clientX;
    dragStartIdx = idx;
  });

  window.addEventListener('mouseup', function (e) {
    if (!drag) return;
    drag = false;
    var d = dragStartX - e.clientX;
    if (Math.abs(d) > 48) go(d > 0 ? dragStartIdx + 1 : dragStartIdx - 1);
  });
});

/* ── SCROLL REVEAL ── */
var mainEl   = document.getElementById('main');
var isMobile = window.innerWidth <= 680;

var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      observer.unobserve(e.target);
    }
  });
}, {
  root:       isMobile ? null : mainEl,
  threshold:  0.06,
  rootMargin: '0px 0px -20px 0px'
});

document.querySelectorAll('.pj').forEach(function (pj, i) {
  pj.style.transitionDelay = (i % 2 ? 80 : 0) + 'ms';
  observer.observe(pj);
});


/* MODALE VIDÉO */
var modal       = document.getElementById('modal');
var modalIframe = document.getElementById('modal-iframe');

document.querySelectorAll('.video-thumb').forEach(function(thumb) {
  thumb.addEventListener('click', function() {
    modalIframe.src = thumb.dataset.video + '?autoplay=1';
    modal.classList.add('open');
  });
});

document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', function(e) {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.remove('open');
  modalIframe.src = ''; // coupe le son en fermant
}