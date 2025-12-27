document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("ID do atendimento não fornecido.");
    window.location.href = "prontuario.html";
    return;
  }

  const atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];
  const atendimento = atendimentos.find((a) => a.id === id);

  if (!atendimento) {
    alert("Atendimento não encontrado.");
    window.location.href = "prontuario.html";
    return;
  }

  // Preencher dados na tela
  document.getElementById("tutorNome").textContent = atendimento.tutor || "-";
  document.getElementById("animalNome").textContent = atendimento.animal || "-";
  document.getElementById("vetNome").textContent =
    atendimento.veterinario || "-";

  if (atendimento.prescricao) {
    document.getElementById("receita").value = atendimento.prescricao;
  }

  // Salvar
  document.getElementById("formPrescricao").addEventListener("submit", (e) => {
    e.preventDefault();

    const receita = document.getElementById("receita").value;

    // Atualiza o objeto no array
    const index = atendimentos.findIndex((a) => a.id === id);
    atendimentos[index].prescricao = receita;

    localStorage.setItem("atendimentos", JSON.stringify(atendimentos));

    alert("Prescrição salva com sucesso!");
  });

  // Finalizar Atendimento
  const btnFinalizar = document.getElementById("btnFinalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      if (confirm("Deseja finalizar o atendimento? O paciente sairá da lista de pendentes.")) {
        const index = atendimentos.findIndex((a) => a.id === id);
        if (index !== -1) {
          atendimentos[index].prescricao = document.getElementById("receita").value;
          atendimentos[index].status = "Finalizado";
          localStorage.setItem("atendimentos", JSON.stringify(atendimentos));
          alert("Atendimento finalizado com sucesso!");
          window.location.href = "prontuario.html";
        }
      }
    });
  }
});
