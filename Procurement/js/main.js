AOS.init({
    duration: 680,
    once: true,
    offset: 55
});

function initializeTeamSlider(selector, paginationSelector, paginationType) {
    new Swiper(selector, {
        slidesPerView: 1,
        spaceBetween: 18,
        loop: true,
        autoplay: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        pagination: {
            el: paginationSelector,
            clickable: true,
            type: 'bullets',
            dynamicBullets: paginationType === 'dynamic'
        },
        breakpoints: {
            576: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 3
            }
        }
    });
}

initializeTeamSlider('.mainTeamSwiper', '.team-pagination', 'dynamic');

var endUserTeams = [
    { code: 'ORD', name: 'Office of the Regional Director', icon: 'bi-building' },
    { code: 'OARD', name: 'Office of the Assistant Regional Director', icon: 'bi-person-badge' },
    { code: 'ASD', name: 'Administrative Division', icon: 'bi-gear-wide-connected' },
    { code: 'CLMD', name: 'Curriculum & Learning Management Division', icon: 'bi-journal-bookmark-fill' },
    { code: 'HRDD', name: 'Human Resource Development Division', icon: 'bi-person-gear' },
    { code: 'ESSD', name: 'Education Support Services Division', icon: 'bi-life-preserver' },
    { code: 'PPRD', name: 'Policy, Planning, & Research Division', icon: 'bi-bar-chart-line-fill' },
    { code: 'QAD', name: 'Quality Assurance Division', icon: 'bi-clipboard2-check-fill' },
    { code: 'FD', name: 'Finance Division', icon: 'bi-cash-stack' },
    { code: 'FTAD', name: 'Field Technical Assistance Division', icon: 'bi-tools' },
    { code: 'LU', name: 'Legal Unit', icon: 'bi-journal-text' },
    { code: 'ICTU', name: 'Information and Communications Technology Unit', icon: 'bi-laptop' },
    { code: 'PAU', name: 'Public Affairs Unit', icon: 'bi-megaphone-fill' },
    { code: 'PS', name: 'Personnel Section', icon: 'bi-person-lines-fill' },
    { code: 'CS', name: 'Cash Section', icon: 'bi-coin' },
    { code: 'RS', name: 'Records Section', icon: 'bi-archive-fill' },
    { code: 'AMS', name: 'Asset Management Section', icon: 'bi-boxes' },
    { code: 'GSU', name: 'General Service Unit', icon: 'bi-wrench-adjustable' },
    { code: 'LRMS', name: 'Learning Resource Management Section', icon: 'bi-book-half' },
    { code: 'LRPS', name: 'Learner Rights & Protection Section', icon: 'bi-shield-check' },
    { code: 'SHNU', name: 'School Health & Nutrition Unit', icon: 'bi-heart-pulse-fill' },
    { code: 'RPSU', name: 'Regional Payroll Services Unit', icon: 'bi-calculator-fill' }
];

var endUserTeamWrapper = document.querySelector('.endUserSwiper .swiper-wrapper');
if (endUserTeamWrapper) {
    endUserTeams.forEach(function(team) {
        var slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = '<article class="team-card"><div class="team-avatar"><i aria-hidden="true"></i></div><div class="team-card-body"><span class="team-label"></span><h4></h4></div></article>';
        slide.querySelector('.team-avatar i').className = 'bi ' + team.icon;
        slide.querySelector('.team-label').textContent = team.code;
        slide.querySelector('h4').textContent = team.name;
        endUserTeamWrapper.appendChild(slide);
    });
}

initializeTeamSlider('.endUserSwiper', '.end-user-pagination', 'dynamic');

/* NAVBAR SCROLL & ACTIVE LINK  */
window.addEventListener('scroll', function() {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('btt').classList.toggle('show', window.scrollY > 300);
    document.querySelectorAll('section[id]').forEach(function(sec) {
        var top = sec.offsetTop - 110,
            bot = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bot) {
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            var lnk = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (lnk) lnk.classList.add('active');
        }
    });
});

/*  SMOOTH SCROLL + MOBILE NAV CLOSE  */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var t = document.querySelector(href);
        if (t) {
            e.preventDefault();
            // Close Bootstrap mobile navbar if open
            var navCollapse = document.getElementById('navmenu');
            if (navCollapse && navCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    navCollapse.classList.remove('show');
                }
            }
            // Scroll after slight delay to let navbar close
            setTimeout(function() {
                window.scrollTo({
                    top: t.offsetTop - 78,
                    behavior: 'smooth'
                });
            }, 50);
        }
    });
});


var searchOv = document.getElementById('searchOv');

document.getElementById('navSearchBtn').addEventListener('click', function() {
    searchOv.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
        document.getElementById('searchInput').focus();
    }, 220);
});

document.getElementById('searchClose').addEventListener('click', closeSearch);

// Close when clicking backdrop
searchOv.addEventListener('click', function(e) {
    if (e.target === searchOv) closeSearch();
});

function closeSearch() {
    searchOv.classList.remove('open');
    document.body.style.overflow = '';
}

function openProviderDirectory(category, query) {
    var url = new URL('providers.html', window.location.href);
    url.searchParams.set('category', category || 'all');
    if (query) url.searchParams.set('q', query);
    window.location.href = url.toString();
}

document.querySelectorAll('.sovcat').forEach(function(btn) {
    btn.addEventListener('click', function() {
        openProviderDirectory(this.getAttribute('data-cat'), '');
    });
});

document.getElementById('providerSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    openProviderDirectory('all', document.getElementById('searchInput').value.trim());
});

$(document).ready(function() {
	$('.magnific_popup').magnificPopup({
	  disableOn: 700,
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  removalDelay: 160,
	  preloader: false,
	  fixedContentPos: false,
	  disableOn: 300
	});	
});


/*  ESC key closes everything */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        if (typeof $.magnificPopup !== 'undefined') $.magnificPopup.close();
    }
});
var calendarMonthFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    }),
    calendarDateFormatter = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeZone: 'UTC'
    });

function getManilaDateParts() {
    var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }).formatToParts(new Date());
    var values = {};

    parts.forEach(function(part) {
        if (part.type !== 'literal') values[part.type] = Number(part.value);
    });

    return {
        year: values.year,
        month: values.month,
        day: values.day
    };
}

var currentManilaDate = getManilaDateParts(),
    calendarYear = currentManilaDate.year,
    calendarMonth = currentManilaDate.month;

function renderCalendar() {
    var today = getManilaDateParts(),
        monthStart = new Date(Date.UTC(calendarYear, calendarMonth - 1, 1)),
        firstWeekday = monthStart.getUTCDay(),
        daysInMonth = new Date(Date.UTC(calendarYear, calendarMonth, 0)).getUTCDate(),
        weekCount = Math.ceil((firstWeekday + daysInMonth) / 7),
        calendarDays = document.getElementById('calendarDays'),
        todayDate = new Date(Date.UTC(today.year, today.month - 1, today.day));

    document.getElementById('calendarMonth').textContent = calendarMonthFormatter.format(monthStart);
    document.getElementById('calendarToday').textContent = 'Today: ' + calendarDateFormatter.format(todayDate);
    calendarDays.textContent = '';

    for (var week = 0; week < weekCount; week++) {
        var row = document.createElement('tr');

        for (var weekday = 0; weekday < 7; weekday++) {
            var day = week * 7 + weekday - firstWeekday + 1,
                cell = document.createElement('td');

            if (day < 1 || day > daysInMonth) {
                cell.className = 'calendar-outside-month';
                cell.setAttribute('aria-hidden', 'true');
            } else {
                cell.textContent = String(day);
                if (calendarYear === today.year && calendarMonth === today.month && day === today.day) {
                    cell.setAttribute('aria-current', 'date');
                    cell.setAttribute('aria-label', 'Today, ' + calendarDateFormatter.format(todayDate));
                }
            }

            row.appendChild(cell);
        }

        calendarDays.appendChild(row);
    }
}

function changeCalendarMonth(amount) {
    var newMonth = new Date(Date.UTC(calendarYear, calendarMonth - 1 + amount, 1));
    calendarYear = newMonth.getUTCFullYear();
    calendarMonth = newMonth.getUTCMonth() + 1;
    renderCalendar();
}

document.getElementById('calendarPrev').addEventListener('click', function() {
    changeCalendarMonth(-1);
});
document.getElementById('calendarNext').addEventListener('click', function() {
    changeCalendarMonth(1);
});
document.getElementById('calendarTodayButton').addEventListener('click', function() {
    var today = getManilaDateParts();
    calendarYear = today.year;
    calendarMonth = today.month;
    renderCalendar();
});

renderCalendar();
setInterval(renderCalendar, 60000);

/*  NUMBER COUNTER ANIMATION*/
var numAnimated = false;
window.addEventListener('scroll', function() {
    var hero = document.getElementById('hero');
    if (!numAnimated && hero && window.scrollY > hero.offsetHeight - 300) {
        numAnimated = true;
        document.querySelectorAll('.snum').forEach(function(el) {
            var txt = el.textContent;
            var num = parseInt(txt);
            var suf = txt.replace(/[0-9]/g, '');
            if (isNaN(num)) return;
            var start = 0;
            var step = Math.ceil(num / 55);
            var iv = setInterval(function() {
                start += step;
                if (start >= num) {
                    start = num;
                    clearInterval(iv);
                }
                el.textContent = start + suf;
            }, 1400 / 55);
        });
    }
});