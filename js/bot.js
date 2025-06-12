// let form = document.querySelector(".bot-form");

// form.addEventListener("submit", function (event) {
//   event.preventDefault();
//   let name = this.name.value;
//   let phone = this.phone.value;
//   let message = this.message.value;
//   let emoji = [
//     {
//       emoji: "🧠",
//       description: "brain",
//       category: "People & Body",
//       aliases: ["brain"],
//       tags: ["intelligence", "think"],
//       unicode_version: "11.0",
//       ios_version: "12.1",
//     },
//     {
//       emoji: "🚀",
//       description: "rocket",
//       category: "Travel & Places",
//       aliases: ["rocket"],
//       tags: ["launch", "space"],
//       unicode_version: "6.0",
//       ios_version: "6.0",
//     },
//     {
//       emoji: "💡",
//       description: "light bulb",
//       category: "Objects",
//       aliases: ["bulb"],
//       tags: ["idea", "light", "think"],
//       unicode_version: "6.0",
//       ios_version: "6.0",
//     },
//   ];
// });
// //
let form = document.querySelector(".bot-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Input qiymatlarini olish
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let message = document.getElementById("message").value.trim();

  // API token va chat ID (o‘zing yozgan botga bog‘langan admin chat ID bo‘lishi kerak)
  let token = "8157479596:AAEeBf0ZZxC-hImSUr7oV6DAGAw3_7oMiIM";
  let chatId = "YOUR_CHAT_ID"; // bu yerga o‘zingizga yozganingizda chiqadigan `chat_id` ni yozasiz

  // Yuboriladigan xabar matni
  let text = `
📥 *Yangi ariza!*
👤 Ism: ${name}
📞 Telefon: ${phone}
💬 Xabar: ${message}
  `;

  // Telegramga yuborish
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        alert("Xabar muvaffaqiyatli yuborildi!");
        form.reset();
      } else {
        alert("Xabar yuborishda xatolik: " + data.description);
      }
    })
    .catch((error) => {
      alert("Tarmoq xatoligi: " + error.message);
    });
});
