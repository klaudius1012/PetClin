// Funções compartilhadas para carregar cabeçalho e outras utilidades

/**
 * Carrega os dados do atendimento e do paciente no cabeçalho padrão.
 * @param {string} atendimentoId O ID do atendimento a ser carregado.
 */
function carregarCabecalho(atendimentoId) {
  const atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];
  const animais = JSON.parse(localStorage.getItem("animais")) || [];
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];

  const atendimento = atendimentos.find((a) => a.id === atendimentoId);

  if (!atendimento) {
    console.error("Atendimento não encontrado para o ID:", atendimentoId);
    return;
  }

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
    // Fallback caso o tutorId não bata, busca só pelo nome
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

/**
 * Define o texto de um elemento do DOM.
 * @param {string} elementId O ID do elemento.
 * @param {string} text O texto a ser inserido. Usa '--' se o texto for nulo/vazio.
 */
function setText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text || "--";
  }
}

/**
 * Calcula a idade com base na data de nascimento.
 * @param {string} dataNasc A data de nascimento no formato YYYY-MM-DD.
 * @returns {string} A idade formatada em anos ou meses.
 */
function calcularIdade(dataNasc) {
  if (!dataNasc) return "--";
  const hoje = new Date();
  const nasc = new Date(dataNasc);
  let idadeAnos = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idadeAnos--;
  }

  if (idadeAnos < 1) {
    let idadeMeses =
      (hoje.getFullYear() - nasc.getFullYear()) * 12 +
      (hoje.getMonth() - nasc.getMonth());
    if (hoje.getDate() < nasc.getDate()) {
      idadeMeses--;
    }
    return `${Math.max(0, idadeMeses)} meses`;
  }

  return `${idadeAnos} anos`;
}
