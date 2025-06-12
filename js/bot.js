let form = document.querySelector(".bot-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let fullName = document.getElementById("firstName").value;
  let phoneNumber = document.getElementById("phone").value;
  let inputMessage = document.getElementById("message").value;
  let inputUser = document.getElementById("telegramUsername").value;
  let uylanmagan = document.getElementById("Uylanmagan").checked
    ? "uylangan"
    : "uylanmagan";
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  let time = `${hours}:${minutes}`;
  console.log(time);

  let my_text = `
 ✅<b> ФИО:</b> <i>${fullName}</i> 
 📞<b> Тел.:</b> <i>${phoneNumber}</i> 
 💬<b> Сообщение:</b> <pre>${inputMessage}</pre> 
 👤<b> Addmin:</b> <i>${inputUser}</i> 
 👥<b> Uylanganmi:</b> <i>${uylanmagan}</i>
 ⏰<b> soat:</b> <i>${time}</i>`;

  let token = "8157479596:AAEeBf0ZZxC-hImSUr7oV6DAGAw3_7oMiIM";
  let chat_id = -4651127963;
  let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&parse_mode=HTML&text=${encodeURIComponent(
    my_text
  )}`;
  ////  1-usil
  // let api = new XMLHttpRequest();
  // api.open("GET", url, true);
  // api.send();
  ////  2-usil
  try {
    await axios(url);
  } catch (error) {
    log("Xatolik yuz berdi:", error);
  }

  alert("Arizangiz junatilindi sizga tez orada aloqaga ciqamz !");
  form.reset();
});
