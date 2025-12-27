document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPet");
  const inputNascimento = document.getElementById("nascimento");
  const spanIdade = document.getElementById("idade-calculada");

  // Upload de Foto
  const inputFoto = document.getElementById("foto");
  const imgPreview = document.getElementById("foto-preview");
  const placeholder = document.getElementById("foto-placeholder");
  let fotoBase64 = "";

  inputFoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) { // Limite de 500KB para não lotar o localStorage
        alert("A imagem é muito grande! Por favor, escolha uma imagem menor que 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        fotoBase64 = ev.target.result;
        imgPreview.src = fotoBase64;
        imgPreview.style.display = "block";
        placeholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Carregar Tutores para o Datalist
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];
  const datalist = document.getElementById("listaTutores");

  tutores.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.nome;
    option.textContent = `CPF: ${t.cpf}`;
    datalist.appendChild(option);
  });

  // Evento: Calcular Idade ao mudar a data
  inputNascimento.addEventListener("change", () => {
    if (inputNascimento.value) {
      spanIdade.textContent = `Idade: ${calcularIdade(inputNascimento.value)}`;
    } else {
      spanIdade.textContent = "";
    }
  });

  // Evento: Salvar Pet
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeTutor = document.getElementById("tutorInput").value;
    const tutorEncontrado = tutores.find((t) => t.nome === nomeTutor);

    if (!tutorEncontrado) {
      alert("Erro: Selecione um tutor válido da lista.");
      return;
    }

    const novoPet = {
      id: Date.now().toString(),
      tutorId: tutorEncontrado.id,
      foto: fotoBase64,
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
    animais.push(novoPet);
    localStorage.setItem("animais", JSON.stringify(animais));

    alert("Pet cadastrado com sucesso!");
    window.location.href = "animais.html";
  });

  function calcularIdade(dataNasc) {
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();

    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }

    if (idade === 0) {
      let meses =
        (hoje.getFullYear() - nasc.getFullYear()) * 12 +
        (hoje.getMonth() - nasc.getMonth());
      if (hoje.getDate() < nasc.getDate()) meses--;
      return `${meses} meses`;
    }

    return `${idade} anos`;
  }
});
