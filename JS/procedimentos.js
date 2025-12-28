document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const atendimentoId = params.get("id");

  if (!atendimentoId) {
    alert("Atendimento não identificado.");
    window.location.href = "home.html";
    return;
  }

  carregarCabecalho(atendimentoId);
});

function carregarCabecalho(id) {
  const atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];
  const animais = JSON.parse(localStorage.getItem("animais")) || [];
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];

  const atendimento = atendimentos.find((a) => a.id === id);

  if (!atendimento) return;

  // Preencher dados básicos vindos do Atendimento
  setText("headerTutor", atendimento.tutor);
  setText("headerPeso", atendimento.peso);
  setText("headerTemp", atendimento.temperatura);

  // Tratamento de Alergias
  const elAlergias = document.getElementById("headerAlergias");
  if (elAlergias) {
    const alergias = atendimento.alergias || "Nenhuma";
    elAlergias.textContent = alergias;
    if (alergias !== "Nenhuma" && alergias.trim() !== "") {
      elAlergias.style.color = "#dc2626";
      elAlergias.style.fontWeight = "bold";
    } else {
      elAlergias.style.color = "inherit";
      elAlergias.style.fontWeight = "normal";
    }
  }

  // Buscar Tutor (para pegar o telefone)
  const tutor = tutores.find((t) => t.nome === atendimento.tutor);
  if (tutor) {
    setText("headerTelefone", tutor.telefone);
  }

  // Buscar Animal (para foto, idade, raça, etc)
  let animal = null;
  if (tutor) {
    animal = animais.find(
      (a) => a.nome === atendimento.animal && a.tutorId == tutor.id
    );
  }
  if (!animal) {
    animal = animais.find((a) => a.nome === atendimento.animal);
  }

  if (animal) {
    setText("headerAnimalNome", animal.nome);
    setText("headerRaca", animal.raca);
    setText("headerSexo", animal.sexo);
    setText("headerPorte", animal.porte);
    setText("headerReprodutiva", animal.condicaoReprodutiva);

    // Foto
    const img = document.getElementById("headerAnimalFoto");
    const placeholder = document.getElementById("headerAnimalFotoPlaceholder");
    if (animal.foto) {
      if (img) {
        img.src = animal.foto;
        img.style.display = "block";
      }
      if (placeholder) placeholder.style.display = "none";
    } else {
      if (img) img.style.display = "none";
      if (placeholder) placeholder.style.display = "flex";
    }

    // Idade
    if (animal.nascimento) {
      const elIdade = document.getElementById("headerAnimalIdade");
      if (elIdade) {
        elIdade.textContent = `Idade: ${calcularIdade(animal.nascimento)}`;
      }
    }
  } else {
    setText("headerAnimalNome", atendimento.animal);
  }
}

function setText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) element.textContent = text || "--";
}

function calcularIdade(dataNasc) {
  const hoje = new Date();
  const nasc = new Date(dataNasc);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade === 0 ? "Menos de 1 ano" : `${idade} anos`;
}
