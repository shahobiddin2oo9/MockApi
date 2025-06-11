let ENDIPOINT = "https://6790bda9af8442fd73777cf3.mockapi.io";
let cards = document.querySelector(".cards");
let pagination = document.querySelector(".pagination");
let inputSearch = document.querySelector(".input--search");
const addTeacherBtn = document.getElementById("addTeacherBtn");
const modal = document.querySelector(".modal");
let form = document.querySelector("form");

let limit = 8;
let currentPage = 1;
let search = "";
let select = null;
function getCard({
  images,
  firstName,
  lastName,
  email,
  phooneNUmber,
  isMerrid,
  id,
}) {
  return `
    <div class="teacher-card">
      <div class="manga-corner corner-bl"></div>
      <div class="manga-corner corner-br"></div>
      <div class="teacher-image">
        <img src="${images}" alt="O'qituvchi rasmi" />
      </div>
      <div class="teacher-details">
        <div class="detail-item">
          <div class="detail-icon">1</div>
          <div class="detail-content">
            <div class="detail-title">ISM FAMILIYA</div>
            <div class="detail-value">
              <b>NAME: </b>${firstName}<br />
              <b>FAMILYA: </b>${lastName}
            </div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon">2</div>
          <div class="detail-content">
            <div class="detail-title">Gmail</div>
            <div class="detail-value">${email}</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon">3</div>
          <div class="detail-content">
            <div class="detail-title">PhoneNumber</div>
            <div class="detail-value">${phooneNUmber}</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon">4</div>
          <div class="detail-content">
            <div class="detail-title">isMerrid</div>
            <div class="detail-value">${isMerrid}</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-content">
            <button class="btn1 editBtn" data-id="${id}">edit</button>
            <button class="btn2 deleteBtn" data-id="${id}">delete</button>
            <button class="btn3">addStudent</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

const api = axios.create({
  baseURL: ENDIPOINT,
  timeout: 5000,
});

async function getTeachers(page = 1) {
  cards.innerHTML = `
  <div >
    <img src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!sw800" 
         alt="Loading..." 
         style="width: 300px; " />
  </div>
`;

  try {
    let { data } = await api.get(`/Teacher`, {
      params: {
        page,
        limit,
        firstName: search,
      },
    });

    cards.innerHTML = "";
    data.forEach((teacher) => {
      cards.innerHTML += getCard(teacher);
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
  }
}

async function getTotalPages() {
  try {
    let { data } = await api.get(`/Teacher`, {
      params: {
        firstName: search,
      },
    });
    return Math.ceil(data.length / limit);
  } catch (err) {
    console.error("Umumiy sahifa olishda xatolik:", err);
    return 1;
  }
}

async function renderPagination() {
  const totalPages = await getTotalPages();
  let html = "";

  html += `<button onclick="changePage(-1)" ${
    currentPage === 1 ? "disabled" : ""
  }>&laquo;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="goToPage(${i})" class="${
      i === currentPage ? "active" : ""
    }">${i}</button>`;
  }

  html += `<button onclick="changePage(1)" ${
    currentPage === totalPages ? "disabled" : ""
  }>&raquo;</button>`;

  pagination.innerHTML = html;
}

function changePage(change) {
  currentPage += change;
  if (currentPage < 1) currentPage = 1;
  getTeachers(currentPage);
  renderPagination();
}

function goToPage(page) {
  currentPage = page;
  getTeachers(currentPage);
  renderPagination();
}

inputSearch.addEventListener("input", function () {
  search = this.value;
  currentPage = 1;
  getTeachers(currentPage);
  renderPagination();
});

getTeachers(currentPage);
renderPagination();

addTeacherBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("show");
  }
});
const closeBtn = document.querySelector(".close-btn");

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const avatar = this.avatar;
  const name = this.NaMe;
  const familya = this.FAMILYA;
  const email = this.Email;
  const phone = this.number;
  const check = this.check;

  const errorText = document.querySelector(".form-error-text");
  errorText.textContent = "";

  if (
    !avatar.value.trim() ||
    !name.value.trim() ||
    !familya.value.trim() ||
    !email.value.trim() ||
    !phone.value.trim()
  ) {
    errorText.textContent = "Iltimos, barcha maydonlarni to‘ldiring";
    return;
  }

  let sendData = {
    images: avatar.value,
    firstName: name.value,
    lastName: familya.value,
    email: email.value,
    phooneNUmber: phone.value,
    isMerrid: check.checked ? true : false,
  };

  try {
    if (select) {
      await api.put(`/Teacher/${select}`, sendData);
    } else {
      await api.post("/Teacher", sendData);
    }

    modal.classList.remove("show");
    getTeachers(currentPage);
    renderPagination();
    form.reset();
    errorText.textContent = "";
    select = null;
  } catch (err) {
    console.error("Xatolik:", err);
    errorText.textContent = "Yuborishda xatolik yuz berdi.";
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("editBtn")) {
    let id = e.target.getAttribute("data-id");
    select = id;
    let { data } = await api.get(`/Teacher/${id}`);
    form.avatar.value = data.images;
    form.NaMe.value = data.firstName;
    form.FAMILYA.value = data.lastName;
    form.Email.value = data.email;
    form.number.value = data.phooneNUmber;
    form.check.checked = data.isMerrid === "Ha";
    modal.classList.add("show");
  }
  if (e.target.classList.contains("deleteBtn")) {
    let id = e.target.getAttribute("data-id");

    let isConfirmed = confirm(
      "iltimos, ushbu o'qituvchini o'chirmoqchimisiz? keyin bu uqituvchining barcha ma'lumotlari o'chiriladi."
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/Teacher/${id}`);
      getTeachers(currentPage);
      renderPagination();
    } catch (err) {
      console.error("O‘chirishda xatolik:", err);
      alert("O‘chirishda xatolik yuz berdi.");
    }
  }
});
