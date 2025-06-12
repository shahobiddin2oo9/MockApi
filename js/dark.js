const modeToggle = document.getElementById("modeToggle");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
});
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}
//
