  document.querySelectorAll('.site-nav .dropdown-toggle, .site-nav .dropdown-submenu > .dropdown-item')
    .forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (window.innerWidth < 992 && el.nextElementSibling) {
          e.preventDefault();
          el.nextElementSibling.classList.toggle('show');
        }
      });
    });
    

  // فلترة المعرض بحركة سلسة
  var filterBtns = document.querySelectorAll('.gallery-filters button');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var galleryGrid = document.querySelector('.gallery-grid');
  var galleryBusy = false;

  function filterGallery(filter) {
    var toHide = [], toShow = [], staying = [];

    galleryItems.forEach(function (item) {
      var match = filter === 'all' || item.dataset.cat === filter;
      var visible = !item.classList.contains('d-none');

      if (match && visible) staying.push(item);
      else if (match && !visible) toShow.push(item);
      else if (!match && visible) toHide.push(item);
    });

    galleryBusy = true;

    // 1) اللي هيختفي: fade out الأول وهو لسه في مكانه
    toHide.forEach(function (item) { item.classList.add('is-hidden'); });
    var wait = toHide.length ? 350 : 0;

    setTimeout(function () {
      // 2) FIRST: مكان الصور اللي فاضلة قبل التغيير
      var first = staying.map(function (item) {
        return item.getBoundingClientRect();
      });

      // 3) تغيير الشبكة
      toHide.forEach(function (item) { item.classList.add('d-none'); });
      toShow.forEach(function (item) {
        item.classList.add('is-hidden');
        item.classList.remove('d-none');
      });

      // 4) INVERT: رجّع كل صورة لمكانها القديم بالـ transform
      staying.forEach(function (item, i) {
        var last = item.getBoundingClientRect();
        var dx = first[i].left - last.left;
        var dy = first[i].top - last.top;
        if (dx || dy) {
          item.style.transition = 'none';
          item.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        }
      });

      galleryGrid.offsetWidth; // إجبار المتصفح يحسب التغيير

      // 5) PLAY: سيبها تنزلق لمكانها الجديد
      staying.forEach(function (item) {
        item.style.transition = 'transform .65s cubic-bezier(.22, .61, .36, 1)';
        item.style.transform = '';
      });

      // الصور الجديدة تظهر واحدة ورا التانية
      toShow.forEach(function (item, i) {
        setTimeout(function () {
          item.classList.remove('is-hidden');
        }, 250 + i * 70);
      });

      // تنضيف
      setTimeout(function () {
        staying.forEach(function (item) { item.style.transition = ''; });
        galleryBusy = false;
      }, 700 + toShow.length * 70);
    }, wait);
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (galleryBusy || btn.classList.contains('active')) return;

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      filterGallery(btn.dataset.filter);
    });
  });


  // العناصر بتظهر واحد ورا التاني أول ما توصلي لها بالـ scroll
const els = document.querySelectorAll('.reveal');
els.forEach((el, i) => el.style.transitionDelay = (i % 8) * 0.09 + 's');

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });

els.forEach(el => io.observe(el));


const swiper = new Swiper('.testi-swiper', {
  effect: 'cube',
  cubeEffect: {
    shadow: false,
    slideShadows: false
  },
  loop: true,
  speed: 900,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  navigation: {
    nextEl: '.t-next',
    prevEl: '.t-prev'
  }
});


  // سلايدر المقالات: صفحة كروت بتختفي وبعدها اللي بعدها تظهر
  var blogTrack = document.querySelector('.blog-track');
  var blogCards = Array.prototype.slice.call(blogTrack.querySelectorAll('.blog-card'));
  var blogPage = 0;
  var blogPer = 3;
  var blogBusy = false;

  // كام كارت يظهر حسب عرض الشاشة (نفس نقاط الـ CSS)
  function getBlogPer() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 576) return 2;
    return 1;
  }

  function showBlogPage(page, animate) {
    blogPer = getBlogPer();
    var pages = Math.ceil(blogCards.length / blogPer);
    blogPage = (page + pages) % pages; // بيلف من الآخر للأول

    var visible = blogCards.filter(function (c) {
      return !c.classList.contains('d-none');
    });

    function swap() {
      // إخفاء الكل
      blogCards.forEach(function (c) { c.classList.add('d-none', 'is-out'); });

      // إظهار كروت الصفحة الجديدة واحد ورا التاني
      var start = blogPage * blogPer;
      blogCards.slice(start, start + blogPer).forEach(function (c, i) {
        c.classList.remove('d-none');
        setTimeout(function () { c.classList.remove('is-out'); }, 60 + i * 120);
      });

      setTimeout(function () { blogBusy = false; }, 600 + blogPer * 120);
    }

    if (animate && visible.length) {
      blogBusy = true;
      visible.forEach(function (c) { c.classList.add('is-out'); });
      setTimeout(swap, 450); // استنى الـ fade out يخلص
    } else {
      swap();
    }
  }


  // سلايدر المقالات: صفحة كروت بتختفي وبعدها اللي بعدها تظهر
  var blogTrack = document.querySelector('.blog-track');
  var blogCards = Array.prototype.slice.call(blogTrack.querySelectorAll('.blog-card'));
  var blogDots = document.querySelector('.blog-dots');
  var blogPage = 0;
  var blogPer = 3;
  var blogBusy = false;

  // كام كارت يظهر حسب عرض الشاشة (نفس نقاط الـ CSS)
  function getBlogPer() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 576) return 2;
    return 1;
  }

  // بناء الشرط حسب عدد الصفحات
  function buildBlogDots() {
    var pages = Math.ceil(blogCards.length / blogPer);
    blogDots.innerHTML = '';

    for (var i = 0; i < pages; i++) {
      var dot = document.createElement('button');
      dot.className = 'blog-dot';
      dot.setAttribute('aria-label', 'Page ' + (i + 1));

      (function (index) {
        dot.addEventListener('click', function () {
          if (!blogBusy && index !== blogPage) showBlogPage(index, true);
        });
      })(i);

      blogDots.appendChild(dot);
    }
  }

  // تلوين الشرطة المفعّلة
  function updateBlogDots() {
    Array.prototype.forEach.call(blogDots.children, function (dot, i) {
      dot.classList.toggle('active', i === blogPage);
    });
  }

  function showBlogPage(page, animate) {
    blogPer = getBlogPer();
    var pages = Math.ceil(blogCards.length / blogPer);
    blogPage = (page + pages) % pages; // بيلف من الآخر للأول

    // لو عدد الصفحات اتغير (ريسبونسيف) نعيد بناء الشرط
    if (blogDots.children.length !== pages) buildBlogDots();
    updateBlogDots();

    var visible = blogCards.filter(function (c) {
      return !c.classList.contains('d-none');
    });

    function swap() {
      blogCards.forEach(function (c) { c.classList.add('d-none', 'is-out'); });

      var start = blogPage * blogPer;
      blogCards.slice(start, start + blogPer).forEach(function (c, i) {
        c.classList.remove('d-none');
        setTimeout(function () { c.classList.remove('is-out'); }, 60 + i * 120);
      });

      setTimeout(function () { blogBusy = false; }, 600 + blogPer * 120);
    }

    if (animate && visible.length) {
      blogBusy = true;
      visible.forEach(function (c) { c.classList.add('is-out'); });
      setTimeout(swap, 450);
    } else {
      swap();
    }
  }

  document.querySelector('.blog-prev').addEventListener('click', function () {
    if (!blogBusy) showBlogPage(blogPage - 1, true);
  });

  document.querySelector('.blog-next').addEventListener('click', function () {
    if (!blogBusy) showBlogPage(blogPage + 1, true);
  });

  // لما حجم الشاشة يتغير: نعيد الترتيب ونفضل عند نفس الكارت الأول
  var blogResizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(blogResizeTimer);
    blogResizeTimer = setTimeout(function () {
      var firstIndex = blogPage * blogPer;
      var newPer = getBlogPer();
      if (newPer !== blogPer) {
        showBlogPage(Math.floor(firstIndex / newPer), false);
      }
    }, 200);
  });

  showBlogPage(0, false);


  // ظهور العناوين كلمة كلمة
  function splitWords(el) {
    var index = 0;

    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {                       // نص
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();

          parts.forEach(function (part) {
            if (!part) return;

            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
            } else {
              var word = document.createElement('span');
              word.className = 'word';
              word.style.transitionDelay = (index * 0.12) + 's';
              word.textContent = part;
              frag.appendChild(word);
              index++;
            }
          });

          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {                // عنصر (زي span)
          walk(child);
        }
      });
    }

    walk(el);
  }

  var revealTitles = document.querySelectorAll('.reveal-words');

  revealTitles.forEach(function (title) {
    splitWords(title);
  });

  var titleObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        titleObserver.unobserve(entry.target);            // مرة واحدة بس
      }
    });
  }, { threshold: 0.4 });

  revealTitles.forEach(function (title) {
    titleObserver.observe(title);
  });

  var testiSection = document.querySelector('.testi');

  new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 }).observe(testiSection);


