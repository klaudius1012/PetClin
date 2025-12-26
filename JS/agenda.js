document.addEventListener("DOMContentLoaded", () => {
  renderAgenda();

  // Configuração do Modal
  const modalAgenda = document.getElementById("modalAgendamento");
  const btnNovoAgendamento = document.getElementById("btnNovoAgendamento");
  const btnGerarAgendaTeste = document.getElementById("btnGerarAgendaTeste");
  const btnCancelarAgenda = document.getElementById("btnCancelarAgenda");
  const formAgendamento = document.getElementById("formAgendamento");

  if (btnNovoAgendamento) {
    btnNovoAgendamento.addEventListener("click", () => {
      modalAgenda.classList.remove("hidden");
      carregarOpcoesAgenda();
    });
  }

  if (btnGerarAgendaTeste) {
    btnGerarAgendaTeste.addEventListener("click", gerarAgendaAleatoria);
  }

  if (btnCancelarAgenda) {
    btnCancelarAgenda.addEventListener("click", () => {
      modalAgenda.classList.add("hidden");
      formAgendamento.reset();
    });
  }

  if (formAgendamento) {
    formAgendamento.addEventListener("submit", (e) => {
      e.preventDefault();
      salvarAgendamento();
    });
  }
});

function renderAgenda() {
  const tbody = document.getElementById("tbody-agenda");
  tbody.innerHTML = "";
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];
  const animais = JSON.parse(localStorage.getItem("animais")) || [];

  agendamentos.forEach((ag) => {
    const tr = document.createElement("tr");

    // --- Lógica de Cores ---
    // Adiciona a classe CSS baseada no tipo (ex: "tipo-consulta", "tipo-vacina")
    if (ag.tipo) {
      const classeCor = `tipo-${ag.tipo.toLowerCase()}`;
      tr.classList.add(classeCor);
    }

    const tutorObj = tutores.find((t) => t.nome === ag.tutor);
    const animalObj = animais.find((a) => a.nome === ag.animal);
    const telefone = tutorObj ? tutorObj.telefone : "-";
    const especie = animalObj ? animalObj.especie : "-";

    tr.innerHTML = `
      <td>${ag.tutor}</td>
      <td>${telefone}</td>
      <td>${ag.animal}</td>
      <td>${ag.hora}</td>
      <td>${especie}</td>
      <td>${ag.veterinario}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="excluirAgendamento('${ag.id}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function carregarOpcoesAgenda() {
  const listaAnimais = document.getElementById("listaAnimaisAgenda");
  const listaTutores = document.getElementById("listaTutoresAgenda");

  const animais = JSON.parse(localStorage.getItem("animais")) || [];
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];

  listaAnimais.innerHTML = "";
  animais.forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.nome;
    listaAnimais.appendChild(opt);
  });

  listaTutores.innerHTML = "";
  tutores.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.nome;
    listaTutores.appendChild(opt);
  });
}

function salvarAgendamento() {
  const hora = document.getElementById("agendaHora").value;
  const animal = document.getElementById("agendaAnimal").value;
  const tutor = document.getElementById("agendaTutor").value;
  const vet = document.getElementById("agendaVet").value;
  const tipo = document.getElementById("agendaTipo").value;

  const novoAgendamento = {
    id: "AG" + Date.now(),
    hora,
    animal,
    tutor,
    veterinario: vet,
    tipo,
  };

  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  agendamentos.push(novoAgendamento);
  agendamentos.sort((a, b) => a.hora.localeCompare(b.hora));

  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  document.getElementById("modalAgendamento").classList.add("hidden");
  document.getElementById("formAgendamento").reset();
  renderAgenda();
}

function excluirAgendamento(id) {
  if (confirm("Deseja excluir este agendamento?")) {
    let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    agendamentos = agendamentos.filter((a) => a.id !== id);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    renderAgenda();
  }
}

function gerarAgendaAleatoria() {
  const animais = JSON.parse(localStorage.getItem("animais")) || [];
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];

  if (animais.length === 0) {
    alert("Não há animais cadastrados para gerar agendamentos.");
    return;
  }

  const tipos = ["Consulta", "Vacina", "Retorno", "Exame", "Cirurgia"];
  const veterinarios = ["Dr. Silva", "Dra. Santos", "Dr. João", "Plantão"];
  const novos = [];
  const qtd = 3; // Gera 3 agendamentos por vez

  for (let i = 0; i < qtd; i++) {
    const animal = animais[Math.floor(Math.random() * animais.length)];
    let tutorNome = animal.tutorNome;

    // Tenta encontrar o nome do tutor se não estiver direto no objeto animal
    if (!tutorNome && animal.tutorId) {
      const t = tutores.find((x) => x.id === animal.tutorId);
      if (t) tutorNome = t.nome;
    }
    // Fallback
    if (!tutorNome && tutores.length > 0) {
      tutorNome = tutores[Math.floor(Math.random() * tutores.length)].nome;
    }

    const h = Math.floor(Math.random() * (18 - 8) + 8);
    const m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const hora = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    novos.push({
      id: "AG" + Date.now() + i,
      hora,
      animal: animal.nome,
      tutor: tutorNome || "Desconhecido",
      veterinario: veterinarios[Math.floor(Math.random() * veterinarios.length)],
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
    });
  }

  const atuais = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const final = [...atuais, ...novos].sort((a, b) => a.hora.localeCompare(b.hora));
  localStorage.setItem("agendamentos", JSON.stringify(final));
  renderAgenda();
}
