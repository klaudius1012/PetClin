(function () {
  const usuario = sessionStorage.getItem("usuarioLogado");
  const path = window.location.pathname;
  const isLoginPage = path.includes("login.html");

  // Se não estiver logado e não estiver na página de login, redireciona para login
  if (!usuario && !isLoginPage) {
    window.location.href = "login.html";
  }

  // Se já estiver logado e tentar acessar a página de login, redireciona para home
  if (usuario && isLoginPage) {
    window.location.href = "home.html";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    });
  }
});
