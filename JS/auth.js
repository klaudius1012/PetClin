// Verifica se o usuário está logado
document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  const paginaAtual = window.location.pathname;

  // Se não estiver logado e não for a página de login, redireciona
  if (!usuarioLogado && !paginaAtual.includes("login.html")) {
    window.location.href = "login.html";
  }

  // Se estiver logado e tentar acessar login, vai para home
  if (usuarioLogado && paginaAtual.includes("login.html")) {
    window.location.href = "home.html";
  }

  // Configura botão de logout se existir
  const btnLogout = document.getElementById("logoutBtn");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    });
  }
});
