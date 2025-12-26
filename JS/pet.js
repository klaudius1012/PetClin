document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPet");
  const inputTutor = document.getElementById("tutorInput");
  const datalistTutores = document.getElementById("listaTutores");
  const params = new URLSearchParams(window.location.search);
  const idEditar = params.get("id");

  // Carregar tutores para o datalist
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];

  tutores.forEach((tutor) => {
    const option = document.createElement("option");
    option.value = tutor.nome; // Exibe o nome
    option.dataset.id = tutor.id; // Guarda o ID (embora datalist não suporte dataset direto na seleção, usamos para busca)
    datalistTutores.appendChild(option);
  });

  // Se houver ID na URL, carrega os dados para edição
  if (idEditar) {
    const animais = JSON.parse(localStorage.getItem("animais")) || [];
    const animal = animais.find((a) => a.id === idEditar);

    if (animal) {
      document.querySelector(".header-actions h2").textContent = "Editar Pet";

      const tutor = tutores.find((t) => t.id === animal.tutorId);
      if (tutor) inputTutor.value = tutor.nome;

      document.getElementById("nome").value = animal.nome || "";
      document.getElementById("especie").value = animal.especie || "";
      document.getElementById("raca").value = animal.raca || "";
      document.getElementById("sexo").value = animal.sexo || "";
      document.getElementById("nascimento").value = animal.nascimento || "";
      document.getElementById("peso").value = animal.peso || "";
      document.getElementById("porte").value = animal.porte || "";
      document.getElementById("condicaoReprodutiva").value =
        animal.condicaoReprodutiva || "";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Encontrar o tutor selecionado
    const nomeTutorSelecionado = inputTutor.value;
    const tutorObj = tutores.find((t) => t.nome === nomeTutorSelecionado);

    if (!tutorObj) {
      alert("Por favor, selecione um tutor válido da lista.");
      return;
    }

    const dadosPet = {
      id: idEditar || "P" + Date.now(),
      tutorId: tutorObj.id,
      tutorNome: tutorObj.nome, // Redundância útil para listagens simples
      nome: document.getElementById("nome").value,
      especie: document.getElementById("especie").value,
      raca: document.getElementById("raca").value,
      sexo: document.getElementById("sexo").value,
      nascimento: document.getElementById("nascimento").value,
      peso: document.getElementById("peso").value,
      porte: document.getElementById("porte").value,
      condicaoReprodutiva: document.getElementById("condicaoReprodutiva").value,
    };

    const animais = JSON.parse(localStorage.getItem("animais")) || [];

    if (idEditar) {
      const index = animais.findIndex((a) => a.id === idEditar);
      if (index !== -1) animais[index] = dadosPet;
      alert("Pet atualizado com sucesso!");
    } else {
      animais.push(dadosPet);
      alert("Pet cadastrado com sucesso!");
    }

    localStorage.setItem("animais", JSON.stringify(animais));
    window.location.href = "home.html";
  });
});
