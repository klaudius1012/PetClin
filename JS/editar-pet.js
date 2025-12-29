document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const petId = params.get("id");

  if (!petId) {
    alert("Pet não identificado.");
    window.location.href = "animais.html";
    return;
  }

  const form = document.getElementById("formPet");
  form.noValidate = true; // Desabilita validação nativa
  const inputNascimento = document.getElementById("nascimento");
  const spanIdade = document.getElementById("idade-calculada");

  // Remove classe de erro ao digitar/selecionar
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
    });
  });

  // Carregar Tutores para o Datalist (para permitir alteração se necessário)
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];
  const datalist = document.getElementById("listaTutores");
  tutores.sort((a, b) => a.nome.localeCompare(b.nome));
  tutores.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.nome;
    option.textContent = `CPF: ${t.cpf}`;
    datalist.appendChild(option);
  });

  // Carregar dados do Pet
  const animais = JSON.parse(localStorage.getItem("animais")) || [];
  const pet = animais.find((p) => p.id === petId);

  if (!pet) {
    alert("Pet não encontrado.");
    window.location.href = "animais.html";
    return;
  }

  // Preencher campos existentes
  document.getElementById("tutorInput").value = pet.tutorNome || "";
  document.getElementById("nome").value = pet.nome || "";
  document.getElementById("especie").value = pet.especie || "";
  document.getElementById("raca").value = pet.raca || "";
  document.getElementById("sexo").value = pet.sexo || "";
  document.getElementById("nascimento").value = pet.nascimento || "";
  document.getElementById("peso").value = pet.peso || "";
  document.getElementById("porte").value = pet.porte || "";
  document.getElementById("condicaoReprodutiva").value =
    pet.condicaoReprodutiva || "";
  document.getElementById("alergias").value = pet.alergias || "";

  // Preencher novos campos
  document.getElementById("vacinacao").value = pet.vacinacao || "";
  document.getElementById("dataRevacina").value = pet.dataRevacina || "";
  document.getElementById("ambiente").value = pet.ambiente || "";
  document.getElementById("alimentacao").value = pet.alimentacao || "";

  // Foto
  let fotoBase64 = pet.foto || "";
  const imgPreview = document.getElementById("foto-preview");
  const placeholder = document.getElementById("foto-placeholder");

  if (fotoBase64) {
    imgPreview.src = fotoBase64;
    imgPreview.style.display = "block";
    placeholder.style.display = "none";
  }

  // Calcular idade inicial
  if (pet.nascimento) {
    spanIdade.textContent = `Idade: ${calcularIdade(pet.nascimento)}`;
  }

  // Função para verificar status da vacina
  function verificarStatusVacinal() {
    const inputData = document.getElementById("dataRevacina");
    const alerta = document.getElementById("alertaVacinacao");

    if (inputData.value) {
      const hoje = new Date();
      const dataRevacina = new Date(inputData.value);

      // Zera as horas para comparar apenas as datas
      hoje.setHours(0, 0, 0, 0);
      dataRevacina.setHours(0, 0, 0, 0);

      if (dataRevacina < hoje) {
        alerta.style.display = "block";
      } else {
        alerta.style.display = "none";
      }
    } else {
      alerta.style.display = "none";
    }
  }

  // Verifica ao carregar e ao alterar a data
  verificarStatusVacinal();
  document
    .getElementById("dataRevacina")
    .addEventListener("change", verificarStatusVacinal);

  // Lógica da Foto (Upload)
  const inputFoto = document.getElementById("foto");
  inputFoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("A imagem deve ter no máximo 500KB.");
        inputFoto.value = "";
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

  // Remover Foto
  const btnRemoverFoto = document.getElementById("btnRemoverFoto");
  if (btnRemoverFoto) {
    btnRemoverFoto.addEventListener("click", () => {
      fotoBase64 = "";
      imgPreview.src = "";
      imgPreview.style.display = "none";
      placeholder.style.display = "block";
      inputFoto.value = "";
    });
  }

  // Atualizar idade ao mudar data
  inputNascimento.addEventListener("change", () => {
    if (inputNascimento.value) {
      spanIdade.textContent = `Idade: ${calcularIdade(inputNascimento.value)}`;
    } else {
      spanIdade.textContent = "";
    }
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

  // Salvar Edição
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("input-error");
        isValid = false;
      } else {
        field.classList.remove("input-error");
      }
    });

    if (!isValid) {
      alert("Por favor, preencha todos os campos obrigatórios destacados.");
      return;
    }

    const nomeTutor = document.getElementById("tutorInput").value;
    const tutorObj = tutores.find((t) => t.nome === nomeTutor);

    if (!tutorObj) {
      document.getElementById("tutorInput").classList.add("input-error");
      alert("Por favor, selecione um tutor válido da lista.");
      return;
    }

    // Atualiza o objeto pet
    pet.tutorId = tutorObj.id;
    pet.tutorNome = tutorObj.nome;
    pet.nome = document.getElementById("nome").value;
    pet.especie = document.getElementById("especie").value;
    pet.raca = document.getElementById("raca").value;
    pet.sexo = document.getElementById("sexo").value;
    pet.nascimento = document.getElementById("nascimento").value;
    pet.peso = document.getElementById("peso").value;
    pet.porte = document.getElementById("porte").value;
    pet.condicaoReprodutiva = document.getElementById(
      "condicaoReprodutiva"
    ).value;
    pet.alergias = document.getElementById("alergias").value;

    // Novos campos
    pet.vacinacao = document.getElementById("vacinacao").value;
    pet.dataRevacina = document.getElementById("dataRevacina").value;
    pet.ambiente = document.getElementById("ambiente").value;
    pet.alimentacao = document.getElementById("alimentacao").value;

    pet.foto = fotoBase64;

    // Salva no localStorage
    const index = animais.findIndex((p) => p.id === petId);
    if (index !== -1) {
      animais[index] = pet;
      localStorage.setItem("animais", JSON.stringify(animais));
      alert("Dados do pet atualizados com sucesso!");
      window.location.href = "animais.html";
    } else {
      alert("Erro ao salvar: Pet não encontrado na lista.");
    }
  });
});
