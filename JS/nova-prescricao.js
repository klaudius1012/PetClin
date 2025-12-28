document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const atendimentoId = params.get("id");

  if (!atendimentoId) {
    alert("Atendimento não encontrado!");
    window.location.href = "internacao.html";
    return;
  }

  const container = document.getElementById("medicamentos-container");
  const btnAdd = document.getElementById("btnAddMedicamento");
  const form = document.getElementById("formPrescricao");

  // Função para adicionar linha de medicamento
  function addMedicamentoRow() {
    const template = document.getElementById("medicamento-template");
    const clone = template.content.cloneNode(true);
    const row = clone.querySelector(".medicamento-row");

    // Evento de remover
    row.querySelector(".btn-remove-item").addEventListener("click", () => {
      row.remove();
    });

    container.appendChild(row);
  }

  // Adiciona uma linha inicial
  addMedicamentoRow();

  // Botão de adicionar
  btnAdd.addEventListener("click", addMedicamentoRow);

  // Salvar
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const medicamentos = [];
    const rows = container.querySelectorAll(".medicamento-row");

    rows.forEach((row) => {
      const nome = row.querySelector('input[name="nome"]').value;
      const doseValor = row.querySelector('input[name="dose_valor"]').value;
      const doseUnidade = row.querySelector(
        'select[name="dose_unidade"]'
      ).value;
      const frequencia = row.querySelector('input[name="frequencia"]').value;
      const intervalo = row.querySelector('input[name="intervalo"]').value;

      const dose = doseValor ? `${doseValor} ${doseUnidade}` : "";

      if (nome) {
        medicamentos.push({ nome, dose, frequencia, intervalo });
      }
    });

    if (medicamentos.length === 0) {
      alert("Adicione pelo menos um medicamento.");
      return;
    }

    const observacoes = document.getElementById("observacoes").value;
    const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado")) || {
      nome: "Veterinário",
    };

    const novaPrescricao = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      atendimentoId: atendimentoId,
      data: new Date().toISOString(),
      veterinario: usuario.nome,
      medicamentos: medicamentos,
      observacoes: observacoes,
    };

    // Salvar no localStorage
    const prescricoes = JSON.parse(localStorage.getItem("prescricoes")) || [];
    prescricoes.push(novaPrescricao);
    localStorage.setItem("prescricoes", JSON.stringify(prescricoes));

    alert("Prescrição salva com sucesso!");
    window.location.href = `prescricao.html?id=${atendimentoId}`;
  });
});
