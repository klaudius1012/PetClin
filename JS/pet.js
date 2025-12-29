document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPet");
  form.noValidate = true; // Desabilita validação nativa para usar a customizada
  const inputNascimento = document.getElementById("nascimento");
  const spanIdade = document.getElementById("idade-calculada");

  // Carregar Tutores para o Datalist
  const tutores = JSON.parse(localStorage.getItem("tutores")) || [];
  const datalist = document.getElementById("listaTutores");

  // Ordena tutores alfabeticamente
  tutores.sort((a, b) => a.nome.localeCompare(b.nome));

  // Remove classe de erro ao digitar/selecionar
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
    });
  });

  tutores.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.nome;
    option.textContent = `CPF: ${t.cpf}`;
    datalist.appendChild(option);
  });

  // Lógica da Foto (Preview e Base64)
  const inputFoto = document.getElementById("foto");
  const imgPreview = document.getElementById("foto-preview");
  const placeholder = document.getElementById("foto-placeholder");
  let fotoBase64 = "";

  inputFoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        // Limite de 500KB
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

  // Cálculo de Idade dinâmico
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

  // Salvar Pet no "Banco de Dados" (localStorage)
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

    const novoPet = {
      id: "PET" + Date.now(),
      tutorId: tutorObj.id,
      tutorNome: tutorObj.nome,
      nome: document.getElementById("nome").value,
      especie: document.getElementById("especie").value,
      raca: document.getElementById("raca").value,
      sexo: document.getElementById("sexo").value,
      nascimento: document.getElementById("nascimento").value,
      peso: document.getElementById("peso").value,
      porte: document.getElementById("porte").value,
      condicaoReprodutiva: document.getElementById("condicaoReprodutiva").value,
      alergias: document.getElementById("alergias").value,
      vacinacao: document.getElementById("vacinacao").value, // Novo campo
      dataRevacina: document.getElementById("dataRevacina").value, // Novo campo
      ambiente: document.getElementById("ambiente").value, // Novo campo
      alimentacao: document.getElementById("alimentacao").value, // Novo campo
      foto: fotoBase64,
    };

    const animais = JSON.parse(localStorage.getItem("animais")) || [];
    animais.push(novoPet);
    localStorage.setItem("animais", JSON.stringify(animais));

    alert("Pet cadastrado com sucesso!");
    window.location.href = "animais.html";
  });
});
