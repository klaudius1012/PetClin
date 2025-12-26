document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAtendimento");
  const campoNumero = document.getElementById("numeroAtendimento");
  const campoTemperatura = document.getElementById("temperatura");
  const campoPrioridade = document.getElementById("prioridade");

  // Elementos para filtro de Tutor/Animal
  const inputTutor = document.getElementById("tutor");
  const inputAnimal = document.getElementById("animal");
  const listaTutores = document.getElementById("listaTutores");
  const listaAnimais = document.getElementById("listaAnimais");

  // Carregar dados do localStorage
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];
  const animais = JSON.parse(localStorage.getItem("animais")) || [];

  // Popular datalist de Tutores
  tutores.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.nome;
    listaTutores.appendChild(option);
  });

  // Filtrar Animais ao selecionar Tutor
  inputTutor.addEventListener("input", function () {
    const tutorNome = this.value;
    listaAnimais.innerHTML = ""; // Limpa lista anterior
    inputAnimal.value = ""; // Limpa campo animal para evitar inconsistência

    if (tutorNome) {
      // Busca o objeto tutor pelo nome para obter o ID
      const tutorObj = tutores.find((t) => t.nome === tutorNome);

      if (tutorObj) {
        // Filtra animais vinculados ao ID do tutor
        const animaisFiltrados = animais.filter(
          (a) => a.tutorId === tutorObj.id
        );

        animaisFiltrados.forEach((a) => {
          const option = document.createElement("option");
          option.value = a.nome;
          listaAnimais.appendChild(option);
        });
      }
    }
  });

  // Preencher dados do animal automaticamente ao selecionar
  inputAnimal.addEventListener("change", function () {
    const animalNome = this.value;
    const tutorNome = inputTutor.value;
    const tutorObj = tutores.find((t) => t.nome === tutorNome);

    if (!tutorObj) return;

    const animal = animais.find(
      (a) => a.nome === animalNome && a.tutorId === tutorObj.id
    );

    if (animal) {
      if (document.getElementById("especie"))
        document.getElementById("especie").value = animal.especie || "";
      if (document.getElementById("raca"))
        document.getElementById("raca").value = animal.raca || "";
      if (document.getElementById("sexo"))
        document.getElementById("sexo").value = animal.sexo || "";
      if (document.getElementById("nascimento"))
        document.getElementById("nascimento").value = animal.nascimento || "";
      if (document.getElementById("peso"))
        document.getElementById("peso").value = animal.peso || "";
      if (document.getElementById("porte"))
        document.getElementById("porte").value = animal.porte || "";
      if (document.getElementById("condicaoReprodutiva"))
        document.getElementById("condicaoReprodutiva").value =
          animal.condicaoReprodutiva || "";
    }
  });

  // 1. Gerar Número do Atendimento automaticamente
  // Gera um ID baseado no timestamp atual + número aleatório
  const novoId =
    "AT" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
  campoNumero.value = novoId;

  // 2. Validação de Febre Alta
  campoTemperatura.addEventListener("change", function () {
    const temperatura = parseFloat(this.value);

    // Verifica se é um número válido e se é febre alta
    if (!isNaN(temperatura) && temperatura > 39.5) {
      // Alerta ao usuário
      alert(
        `ALERTA: A temperatura informada (${temperatura}°C) indica febre alta!`
      );

      // Destaque visual no campo
      this.style.borderColor = "red";
      this.style.backgroundColor = "#fff0f0";

      // Sugere alteração de prioridade se já não for Emergência
      if (campoPrioridade.value !== "Emergência") {
        const aceitaEmergencia = confirm(
          'Deseja alterar a prioridade do atendimento para "Emergência"?'
        );
        if (aceitaEmergencia) {
          campoPrioridade.value = "Emergência";
        }
      }
    } else {
      // Remove os estilos de alerta se a temperatura for corrigida
      this.style.borderColor = "";
      this.style.backgroundColor = "";
    }
  });

  // 3. Salvar Atendimento e Redirecionar
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Coleta todos os dados do formulário
    const dadosAtendimento = {
      id: campoNumero.value,
      tutor: document.getElementById("tutor").value,
      animal: document.getElementById("animal").value,
      especie: document.getElementById("especie").value,
      raca: document.getElementById("raca").value,
      sexo: document.getElementById("sexo").value,
      nascimento: document.getElementById("nascimento").value,
      peso: document.getElementById("peso").value,
      porte: document.getElementById("porte").value,
      condicaoReprodutiva: document.getElementById("condicaoReprodutiva").value,
      veterinario: document.getElementById("veterinario").value,
      prioridade: campoPrioridade.value,
      motivo: document.getElementById("motivo").value,
      temperatura: campoTemperatura.value,
      sintomas: document.getElementById("sintomas").value,
      observacoes: document.getElementById("observacoes").value,
      // Campos de controle do sistema
      status: "Aguardando",
      dataHora: new Date().toLocaleString("pt-BR"),
      timestamp: Date.now(),
    };

    // Recupera atendimentos existentes ou cria novo array
    const atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];

    // Adiciona o novo atendimento e salva
    atendimentos.push(dadosAtendimento);
    localStorage.setItem("atendimentos", JSON.stringify(atendimentos));

    alert("Atendimento registrado com sucesso!");
    window.location.href = "home.html";
  });
});
