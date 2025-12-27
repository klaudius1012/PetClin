document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPet");
  const inputNascimento = document.getElementById("nascimento");
  const spanIdade = document.getElementById("idade-calculada");

  // Upload de Foto
  const inputFoto = document.getElementById("foto");
  const imgPreview = document.getElementById("foto-preview");
  const placeholder = document.getElementById("foto-placeholder");
  const btnRemoverFoto = document.getElementById("btnRemoverFoto");
  let fotoBase64 = "";

  inputFoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) { // Limite de 500KB
        alert("A imagem é muito grande! Por favor, escolha uma imagem menor que 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        fotoBase64 = ev.target.result;
        imgPreview.src = fotoBase64;
        imgPreview.style.display = "block";
        placeholder.style.display = "none";
        btnRemoverFoto.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Evento: Remover Foto
  btnRemoverFoto.addEventListener("click", () => {
    fotoBase64 = "";
    imgPreview.src = "";
    imgPreview.style.display = "none";
    placeholder.style.display = "block";
    btnRemoverFoto.style.display = "none";
    inputFoto.value = ""; // Limpar o input file
  });

  // Pegar ID da URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("Pet não identificado.");
    window.location.href = "animais.html";
    return;
  }

  // Carregar dados do localStorage
  const animais = JSON.parse(localStorage.getItem("animais")) || [];
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];
  const animal = animais.find((a) => a.id === id);

  if (!animal) {
    alert("Pet não encontrado.");
    window.location.href = "animais.html";
    return;
  }

  // Popular Datalist de Tutores
  const datalist = document.getElementById("listaTutores");
  tutores.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.nome;
    option.textContent = `CPF: ${t.cpf}`;
    datalist.appendChild(option);
  });

  // Preencher formulário com dados existentes
  document.getElementById("nome").value = animal.nome || "";
  document.getElementById("especie").value = animal.especie || "";
  document.getElementById("raca").value = animal.raca || "";
  document.getElementById("sexo").value = animal.sexo || "";
  document.getElementById("nascimento").value = animal.nascimento || "";
  document.getElementById("peso").value = animal.peso || "";
  document.getElementById("porte").value = animal.porte || "";
  document.getElementById("condicaoReprodutiva").value =
    animal.condicaoReprodutiva || "";

  // Carregar Foto Existente
  if (animal.foto) {
    fotoBase64 = animal.foto;
    imgPreview.src = animal.foto;
    imgPreview.style.display = "block";
    placeholder.style.display = "none";
    btnRemoverFoto.style.display = "block";
  }

  // Preencher Tutor (Tenta pelo ID, fallback para nome se for dado legado)
  const inputTutor = document.getElementById("tutorInput");
  if (animal.tutorId) {
    const tutor = tutores.find((t) => t.id === animal.tutorId);
    if (tutor) inputTutor.value = tutor.nome;
  } else if (animal.tutorNome) {
    inputTutor.value = animal.tutorNome;
  }

  // Calcular idade inicial se houver data
  if (animal.nascimento) {
    spanIdade.textContent = `Idade: ${calcularIdade(animal.nascimento)}`;
  }

  // Evento: Calcular Idade ao mudar a data
  inputNascimento.addEventListener("change", () => {
    if (inputNascimento.value) {
      spanIdade.textContent = `Idade: ${calcularIdade(inputNascimento.value)}`;
    } else {
      spanIdade.textContent = "";
    }
  });

  // Evento: Salvar Alterações
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeTutor = inputTutor.value;
    const tutorEncontrado = tutores.find((t) => t.nome === nomeTutor);

    if (!tutorEncontrado) {
      alert("Erro: Selecione um tutor válido da lista.");
      return;
    }

    // Atualizar objeto do animal
    animal.tutorId = tutorEncontrado.id;
    animal.tutorNome = tutorEncontrado.nome; // Mantém compatibilidade com a lista de animais
    animal.foto = fotoBase64;
    animal.nome = document.getElementById("nome").value;
    animal.especie = document.getElementById("especie").value;
    animal.raca = document.getElementById("raca").value;
    animal.sexo = document.getElementById("sexo").value;
    animal.nascimento = document.getElementById("nascimento").value;
    animal.peso = document.getElementById("peso").value;
    animal.porte = document.getElementById("porte").value;
    animal.condicaoReprodutiva = document.getElementById(
      "condicaoReprodutiva"
    ).value;

    localStorage.setItem("animais", JSON.stringify(animais));

    alert("Pet atualizado com sucesso!");
    window.location.href = "animais.html";
  });

  function calcularIdade(dataNasc) {
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
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
