let ENDIPOINT = "https://6790bda9af8442fd73777cf3.mockapi.io";
let cards = document.querySelector(".cards");
const addTeacherBtn = document.getElementById("addTeacherBtn");
const modal = document.querySelector(".modal");
let form = document.querySelector("form");
let pagination = document.querySelector(".pagination");
let searchInput = document.querySelector(".input--search");

let select = null;
let TeacherId = new URLSearchParams(location.search).get("id");
function getCard({
  images,
  firstName,
  lastName,
  email,
  phoneNumber,
  isWORK,
  id,
}) {
  return `
    <div class="teacher-card">
      <div class="manga-corner corner-bl"></div>
      <div class="manga-corner corner-br"></div>
      <div class="teacher-image">
        <img src="${images}" alt="student rasmi" />
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
            <div class="detail-value">${phoneNumber}</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon">4</div>
          <div class="detail-content">
            <div class="detail-title">isWORK</div>
            <div class="detail-value">${isWORK}</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-content">
            <button class="btn1 editBtn" data-id="${id}">edit</button>
            <button class="btn2 deleteBtn" data-id="${id}">delete</button>
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
let Limit = 8;
let pageCount = 1;
let totalPages = 1;
async function getTeachers() {
  cards.innerHTML = `
    <div>
      <img src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!sw800" 
      alt="Loading..." style="width: 300px;" />
    </div>`;

  try {
    let params = {
      page: pageCount,
      limit: Limit,
    };

    cards.innerHTML = "";
    let { data } = await api(`/Teacher/${TeacherId}/student`, { params });

    let { data: allData } = await api(`/Teacher/${TeacherId}/student`);
    totalPages = Math.ceil(allData.length / Limit);
    data.map((teacher) => (cards.innerHTML += getCard(teacher)));

    pagination.innerHTML = `<button class="nextPage" data-id="-">Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<button class="nextPage ${
        pageCount == i ? "active" : ""
      }" data-id=${i} >${i}</button>`;
    }
    pagination.innerHTML += `<button class="nextPage" data-id="+">Next</button>`;
  } catch (error) {
    console.log("Xatolik:", error);
    cards.innerHTML = `<p>Xatolik yuz berdi.</p>`;
  }
}
getTeachers();
document.addEventListener("click", function (e) {
  let pageItem = e.target.closest(".nextPage");
  if (!pageItem) return;
  let id = pageItem.dataset.id;

  if (id === "+") {
    if (pageCount < totalPages) {
      pageCount++;
      getTeachers();
    }
  } else if (id === "-") {
    if (pageCount > 1) {
      pageCount--;
      getTeachers();
    }
  } else {
    pageCount = Number(id);
    getTeachers();
  }
});
//

//
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
    phoneNumber: phone.value,
    isMerrid: check.checked ? true : false,
  };

  try {
    if (select) {
      await api.put(`/student/${select}`, sendData);
    } else {
      await api.post(`/Teacher/${TeacherId}/student`, sendData);
    }

    modal.classList.remove("show");
    getTeachers();
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
    let { data } = await api(`/student/${id}`);
    form.avatar.value = data.images;
    form.NaMe.value = data.firstName;
    form.FAMILYA.value = data.lastName;
    form.Email.value = data.email;
    form.number.value = data.phoneNumber;
    form.check.checked = data.isWORK;
    modal.classList.add("show");
  }

  if (e.target.classList.contains("deleteBtn")) {
    let id = e.target.getAttribute("data-id");

    let isConfirmed = confirm("Ushbu o‘qituvchini o‘chirmoqchimisiz?");
    if (!isConfirmed) return;

    try {
      await api.delete(`/Teacher/${TeacherId}/student/${id}`);
      console.log(id);
      getTeachers();
    } catch (err) {
      console.error("O‘chirishda xatolik:", err);
      alert("O‘chirishda xatolik yuz berdi.");
    }
  }
});
searchInput.addEventListener("keyup", async function (e) {
  let search = e.target.value.trim();
  cards.innerHTML = `
  <div>
    <img src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!sw800" 
    alt="Loading..." style="width: 300px;" />
  </div>`;

  try {
    let params = {
      page: pageCount,
      limit: Limit,
    };

    let { data: allData } = await api(`/Teacher?firstName=${search}`, {
      params,
    });
    totalPages = Math.ceil(allData.length / Limit);

    pagination.innerHTML = `<button class="nextPage" data-id="-">Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<button class="nextPage ${
        pageCount == i ? "active" : ""
      }" data-id=${i} >${i}</button>`;
    }
    pagination.innerHTML += `<button class="nextPage" data-id="+">Next</button>`;
    cards.innerHTML = "";
    let { data } = await api(`Teacher?firstName=${search}`, { params });
    console.log(data);
    data.forEach((teacher) => (cards.innerHTML += getCard(teacher)));
  } catch (error) {
    console.log("Xatolik:", error);
  }
});
