
/* ==========================================
   웨딩 데이터 설정
   ========================================== */
const weddingData = {
  groom: {
    name: "용재",
    fullName: "이용재",
    parents: "이종수 · 김영희"
  },
  bride: {
    name: "민진",
    fullName: "이민진",
    parents: "이철수 · 박순자"
  },

  date: {
    year: 2027,
    month: 1,
    day: 2,
    weekday: "토요일",
    time: "오후 12:00",
    headerDateText: "JANUARY 02, 2027 SAT 12:00 PM",
    coverDateText: "2027.01.02 토요일 오후 12:00"
  },

  venue: {
    name: "아펠가모 선릉",
    subkicker: "AT APELGAMO SEONLLEUNG",
    address: "서울특별시 강남구 테헤란로 322 한신인터밸리24 빌딩 4층",
    phone: "02-2186-6888",
    subway: "2호선 / 수인분당선 선릉역 4번 출구에서 도보 3분",
    bus: "선릉역 정류장 하차 (간선: 146, 341, 360 / 지선: 4412)",
    parking: "건물 내 지하 주차장 이용 (하객 2시간 무료 주차)",
    naverMapUrl: "https://map.naver.com",
    kakaoMapUrl: "https://map.kakao.com",
    tmapUrl: "https://tmap.co.kr"
  },

  galleryImages: [
    "images/hero/1.jpg",
    "images/hero/2.jpg",
    "images/hero/3.jpg",
    "images/hero/4.jpg",
    "images/hero/5.jpg",
    "images/hero/6.jpg"
  ]
};

/* ==========================================
   페이지 로드 시 초기화 실행
   ========================================== */
document.addEventListener("DOMContentLoaded", function () {
  // 0. 오프닝 화면 버튼 이벤트
  initOpeningOverlay();

  // 1. 첫 화면 및 텍스트 데이터 바인딩
  initPageData();

  // 2. 캘린더 생성
  renderCalendar(weddingData.date.year, weddingData.date.month, weddingData.date.day);

  // 3. 갤러리 이미지 및 모달 초기화
  initGallery();

  // 4. 계좌번호 아코디언 토글 이벤트
  initAccountToggle();

  // 5. 계좌번호 복사 기능
  initCopyButtons();

  // 6. 스크롤 애니메이션
  initScrollAnimation();
});

/* ==========================================
   0. 오프닝 랜딩 이벤트 (초대장 열기 버튼)
   ========================================== */
function initOpeningOverlay() {
  const openBtn = document.getElementById("openBtn");
  const overlay = document.getElementById("openingOverlay");

  if (openBtn && overlay) {
    openBtn.addEventListener("click", function () {
      overlay.classList.add("fade-out");
      // 스크롤 맨 위로 보장
      window.scrollTo(0, 0);
    });
  }
}

/* ==========================================
   1. 첫 화면 및 텍스트 데이터 바인딩 함수
   ========================================== */
function initPageData() {
  // 오프닝 화면 신랑 신부 이름
  setText("openingGroom", weddingData.groom.fullName);
  setText("openingBride", weddingData.bride.fullName);

  // 커버 / 첫 화면 영역
  setText("coverKicker", weddingData.date.headerDateText);
  setText("coverSubkicker", weddingData.venue.subkicker);
  setText("coverDate", weddingData.date.coverDateText);
  setText("coverVenue", weddingData.venue.name);

  // 초대장 / 혼주 및 이름 영역
  setText("groomFullName", weddingData.groom.fullName);
  setText("brideFullName", weddingData.bride.fullName);

  // 캘린더 상단 날짜 표기
  setText("dateLead", `${weddingData.date.year}.${String(weddingData.date.month).padStart(2, '0')}.${String(weddingData.date.day).padStart(2, '0')}`);
  setText("weekday", `${weddingData.date.weekday} ${weddingData.date.time}`);

  // 오시는 길 영역
  setText("venueName", weddingData.venue.name);
  setHTML("venueAddress", `${weddingData.venue.address}<br>${weddingData.venue.phone}`);
  setText("subway", weddingData.venue.subway);
  setText("bus", weddingData.venue.bus);
  setText("parking", weddingData.venue.parking);

  // 지도 버튼 링크
  setHref("naverMap", weddingData.venue.naverMapUrl);
  setHref("kakaoMap", weddingData.venue.kakaoMapUrl);
  setHref("tmap", weddingData.venue.tmapUrl);
}

/* ==========================================
   2. 캘린더 생성 함수 (결혼식 날짜 하트 표기)
   ========================================== */
function renderCalendar(year, month, weddingDay) {
  const grid = document.getElementById("calendarGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  daysOfWeek.forEach((day, idx) => {
    const dayHeader = document.createElement("div");
    dayHeader.classList.add("cal-header");
    if (idx === 0) dayHeader.classList.add("sunday");
    if (idx === 6) dayHeader.classList.add("saturday");
    dayHeader.textContent = day;
    grid.appendChild(dayHeader);
  });

  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateCell = document.createElement("div");
    dateCell.classList.add("cal-day");

    const currentDayOfWeek = (firstDayIndex + day - 1) % 7;
    if (currentDayOfWeek === 0) dateCell.classList.add("sunday");
    if (currentDayOfWeek === 6) dateCell.classList.add("saturday");

    if (day === weddingDay) {
      dateCell.classList.add("wedding-day");
      dateCell.innerHTML = `<span class="heart-mark">♥</span><span class="day-num">${day}</span>`;
    } else {
      dateCell.textContent = day;
    }

    grid.appendChild(dateCell);
  }
}

/* ==========================================
   3. 갤러리 및 모달 슬라이더 기능
   ========================================== */
let currentImageIndex = 0;

function initGallery() {
  const galleryGrid = document.getElementById("gallery");
  const photoModal = document.getElementById("photoModal");
  const modalImg = document.getElementById("modalImage");
  const modalCount = document.getElementById("modalCount");

  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";
  weddingData.galleryImages.forEach((src, idx) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `갤러리 사진 ${idx + 1}`;
    img.addEventListener("click", () => openModal(idx));
    galleryGrid.appendChild(img);
  });

  const closeBtn = document.querySelector(".modal-close");
  const prevBtn = document.querySelector(".modal-prev");
  const nextBtn = document.querySelector(".modal-next");

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (prevBtn) prevBtn.addEventListener("click", showPrevImage);
  if (nextBtn) nextBtn.addEventListener("click", showNextImage);

  if (photoModal) {
    photoModal.addEventListener("click", (e) => {
      if (e.target === photoModal) closeModal();
    });
  }

  function openModal(index) {
    currentImageIndex = index;
    updateModalImage();
    if (photoModal) {
      photoModal.style.display = "flex";
      photoModal.setAttribute("aria-hidden", "false");
    }
  }

  function closeModal() {
    if (photoModal) {
      photoModal.style.display = "none";
      photoModal.setAttribute("aria-hidden", "true");
    }
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + weddingData.galleryImages.length) % weddingData.galleryImages.length;
    updateModalImage();
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % weddingData.galleryImages.length;
    updateModalImage();
  }

  function updateModalImage() {
    if (modalImg) modalImg.src = weddingData.galleryImages[currentImageIndex];
    if (modalCount) modalCount.textContent = `${currentImageIndex + 1} / ${weddingData.galleryImages.length}`;
  }
}

/* ==========================================
   4. 계좌번호 토글 기능
   ========================================== */
function initAccountToggle() {
  const toggles = document.querySelectorAll(".account-toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const arrow = this.querySelector("span:last-child");
      if (content.style.display === "block") {
        content.style.display = "none";
        if (arrow) arrow.textContent = "∨";
      } else {
        content.style.display = "block";
        if (arrow) arrow.textContent = "∧";
      }
    });
  });
}

/* ==========================================
   5. 계좌번호 복사 기능
   ========================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll(".copy-btn");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const accountNum = this.getAttribute("data-copy");
      if (accountNum) {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(accountNum).then(() => {
            showToast("계좌번호가 복사되었습니다.");
          });
        } else {
          const tempInput = document.createElement("input");
          tempInput.value = accountNum;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
          showToast("계좌번호가 복사되었습니다.");
        }
      }
    });
  });
}

/* ==========================================
   6. 스크롤 애니메이션 (Reveal)
   ========================================== */
function initScrollAnimation() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================
   유틸리티 헬퍼 함수
   ========================================== */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el && html) el.innerHTML = html;
}

function setHref(id, url) {
  const el = document.getElementById(id);
  if (el && url) el.href = url;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}
