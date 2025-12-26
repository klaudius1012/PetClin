document.addEventListener("DOMContentLoaded", () => {
  // Menu Mobile
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.querySelector(".sidebar");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  const tbody = document.getElementById("tbody-tutores");
  const busca = document.getElementById("buscaTutor");
  const btnGerar = document.getElementById("btnGerarTutores");

  const paginator = new Paginator(5, carregarTutores);

  // Eventos
  if (busca)
    busca.addEventListener("input", () => {
      paginator.reset();
      carregarTutores();
    });
  if (btnGerar) btnGerar.addEventListener("click", gerarDadosTutores);

  // Carregar dados iniciais
  carregarTutores();

  function carregarTutores() {
    const tutores = JSON.parse(localStorage.getItem("tutores")) || [];
    const termo = busca ? busca.value.toLowerCase() : "";

    tbody.innerHTML = "";

    const filtrados = tutores.filter((t) => {
      const nome = t.nome ? t.nome.toLowerCase() : "";
      const cpf = t.cpf ? t.cpf : "";
      return nome.includes(termo) || cpf.includes(termo);
    });

    if (filtrados.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;">Nenhum tutor encontrado.</td></tr>';
      return;
    }

    // Ordenar por nome
    filtrados.sort((a, b) => a.nome.localeCompare(b.nome));

    const { data, totalPages } = paginator.paginate(filtrados);

    data.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.nome}</td>
        <td>${t.cpf}</td>
        <td>${t.telefone}</td>
        <td>${t.cidade}</td>
        <td>
          <button class="btn-editar" onclick="window.location.href='cadastro_tutor.html?id=${t.id}'">Editar</button>
          <button class="btn-excluir" onclick="excluirTutor('${t.id}')">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    paginator.renderControls("pagination", totalPages);
  }

  // Expor função de exclusão globalmente
  window.excluirTutor = function (id) {
    if (confirm("Tem certeza que deseja excluir este tutor?")) {
      let tutores = JSON.parse(localStorage.getItem("tutores")) || [];

      // Remove o tutor
      tutores = tutores.filter((t) => t.id !== id);
      localStorage.setItem("tutores", JSON.stringify(tutores));

      // Remover animais associados a este tutor
      let animais = JSON.parse(localStorage.getItem("animais")) || [];
      animais = animais.filter((a) => String(a.tutorId) !== String(id));
      localStorage.setItem("animais", JSON.stringify(animais));

      carregarTutores();
    }
  };

  function gerarDadosTutores() {
    if (
      confirm(
        "Isso substituirá a lista atual de tutores por dados de teste. Deseja continuar?"
      )
    ) {
      const tutoresTeste = [
        {
          id: "1",
          nome: "Ana Silva",
          cpf: "123.456.789-00",
          telefone: "(11) 99999-1111",
          cidade: "São Paulo",
          bairro: "Centro",
          endereco: "Rua das Flores, 123",
          nascimento: "1985-04-12",
        },
        {
          id: "2",
          nome: "Carlos Souza",
          cpf: "987.654.321-11",
          telefone: "(21) 98888-2222",
          cidade: "Rio de Janeiro",
          bairro: "Copacabana",
          endereco: "Av. Atlântica, 450",
          nascimento: "1990-08-25",
        },
        {
          id: "3",
          nome: "Mariana Oliveira",
          cpf: "456.789.123-22",
          telefone: "(31) 97777-3333",
          cidade: "Belo Horizonte",
          bairro: "Savassi",
          endereco: "Rua da Bahia, 1000",
          nascimento: "1995-02-10",
        },
        {
          id: "4",
          nome: "Pedro Lima",
          cpf: "321.654.987-33",
          telefone: "(41) 96666-4444",
          cidade: "Curitiba",
          bairro: "Batel",
          endereco: "Rua das Palmeiras, 500",
          nascimento: "1988-11-05",
        },
        {
          id: "5",
          nome: "Fernanda Costa",
          cpf: "654.321.987-44",
          telefone: "(51) 95555-5555",
          cidade: "Porto Alegre",
          bairro: "Centro Histórico",
          endereco: "Av. Borges de Medeiros, 200",
          nascimento: "1993-05-30",
        },
        {
          id: "6",
          nome: "Lucas Martins",
          cpf: "159.753.486-55",
          telefone: "(41) 94444-6666",
          cidade: "Curitiba",
          bairro: "Cidade Industrial",
          endereco: "Rua das Flores, 789",
          nascimento: "1992-07-18",
        },
      ];
      localStorage.setItem("tutores", JSON.stringify(tutoresTeste));
      carregarTutores();
    }
  }
});
