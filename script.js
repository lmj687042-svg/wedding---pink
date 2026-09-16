(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  let CONFIG = null;
  let dateObj = null;

  function showToast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      showToast("복사되었습니다.");
    } catch {
      showToast("복사하지 못했습니다.");
    }
  }

  function initConfig() {
    $("#groomName").textContent = CONFIG.groom;
    $("#brideName").textContent = CONFIG.bride;
    $("#groomFullName").textContent = CONFIG.groom;
    $("#brideFullName").textContent = CONFIG.bride;

    $("#venueName").textContent = CONFIG.wedding.venue;
    $("#venueAddress").innerHTML = `${CONFIG.wedding.address}<br>02-000-0000`;
    $("#subway").textContent = CONFIG.location.subway;
    $("#bus").textContent = CONFIG.location.bus;
    $("#kakaoMap").href = CONFIG.location.kakao;
    $("#naverMap").href = CONFIG.location.naver;

    document.title = `${CONFIG.groom} & ${CONFIG.bride} · OUR WEDDING`;
  }

  const galleryImages = [];
  function loadGalleryImages() {
    const grid = $("#gallery");
    let current = 1;
    let fails = 0;
    const max = 30;

    function tryNext() {
      if (current > max || fails >= 3) return;

      const src = `images/gallery/${current}.jpg`;
      const probe = new Image();

      probe.onload = () => {
        galleryImages.push(src);

        const figure = document.createElement("div");
        figure.className = "photo-item reveal";

        const img = document.createElement("img");
        img.src = src;
        img.alt = `웨딩 사진 ${current}`;
        img.loading = "lazy";

        figure.appendChild(img);
        figure.addEventListener("click", () => openModal(galleryImages.indexOf(src)));

        grid.appendChild(figure);
        observer.observe(figure);

        fails = 0;
        current++;
        tryNext();
      };

      probe.onerror = () => {
        fails++;
        current++;
        tryNext();
      };

      probe.src = src;
    }

    tryNext();
  }

  function buildCalendar() {
    const grid = $("#calendarGrid");
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const weddingDay = dateObj.getDate();

    const dows = ["S", "M", "T", "W", "T", "F", "S"];
    dows.forEach((d, i) => {
      const el = document.createElement("div");
      el.className = `dow ${i === 0 ? "sun" : ""}`;
      el.textContent = d;
      grid.appendChild(el);
    });

    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= lastDate; day++) {
      const el = document.createElement("div");
      el.textContent = day;
      const dow = new Date(year, month, day).getDay();
      if (dow === 0) el.classList.add("sun");
      if (day === weddingDay) el.classList.add("wedding-day");
      grid.appendChild(el);
    }
  }

  let modalIndex = 0;
  const modal = $("#photoModal");
  const modalImage = $("#modalImage");
  const modalCount = $("#modalCount");

  function updateModal() {
    if (!galleryImages.length) return;
    modalImage.src = galleryImages[modalIndex];
    modalCount.textContent = `${modalIndex + 1} / ${galleryImages.length}`;
  }

  function openModal(index) {
    modalIndex = index;
    updateModal();
    modal.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  function initReveal() {
    $$(".reveal").forEach(el => observer.observe(el));
  }

  function initAccounts() {
    $$(".account-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".account-group").classList.toggle("open");
      });
    });

    $$(".copy-btn").forEach(btn => {
      btn.addEventListener("click", () => copyText(btn.dataset.copy));
    });
  }

  $(".modal-close").addEventListener("click", closeModal);
  $(".modal-next").addEventListener("click", () => {
    modalIndex = (modalIndex + 1) % galleryImages.length;
    updateModal();
  });
  $(".modal-prev").addEventListener("click", () => {
    modalIndex = (modalIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModal();
  });

  async function loadConfigAndInit() {
    try {
      const res = await fetch("config.json");
      if (!res.ok) throw new Error("config.json 로드 실패");
      CONFIG = await res.json();
    } catch (err) {
      CONFIG = {
        groom: "Groom",
        bride: "Bride",
        wedding: { date: "2026-12-31", time: "12:00", venue: "예식장 이름", address: "서울특별시 강남구" },
        location: { subway: "지하철역 도보 5분", bus: "지선/간선 버스 이용", kakao: "#", naver: "#" }
      };
    }

    dateObj = new Date(`${CONFIG.wedding.date}T12:00:00`);

    initConfig();
    buildCalendar();
    loadGalleryImages();
    initAccounts();
    initReveal();
  }

  loadConfigAndInit();
})();