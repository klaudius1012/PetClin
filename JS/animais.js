document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("tbody-animais");
  const btnGerar = document.getElementById("btnGerarAnimais");
  const btnLimpar = document.getElementById("btnLimparAnimais");
  const busca = document.getElementById("buscaAnimal");

  // Instancia o paginador (assumindo que pagination.js foi carregado)
  const paginator = new Paginator(5, carregarAnimais);

  // Evento: Gerar Dados de Teste
  if (btnGerar) {
    btnGerar.addEventListener("click", () => {
      const dadosTeste = [
        {
          id: Date.now() + "1",
          nome: "Rex",
          especie: "Cachorro",
          raca: "Vira-lata",
          tutorNome: "Ana Silva",
        },
        {
          id: Date.now() + "2",
          nome: "Mia",
          especie: "Gato",
          raca: "Siamês",
          tutorNome: "Carlos Oliveira",
        },
        {
          id: Date.now() + "3",
          nome: "Thor",
          especie: "Cachorro",
          raca: "Labrador",
          tutorNome: "Mariana Santos",
        },
        {
          id: Date.now() + "4",
          nome: "Lola",
          especie: "Gato",
          raca: "Persa",
          tutorNome: "Roberto Costa",
        },
        {
          id: Date.now() + "5",
          nome: "Bob",
          especie: "Cachorro",
          raca: "Poodle",
          tutorNome: "Fernanda Lima",
        },
        {
          id: Date.now() + "6",
          nome: "Nina",
          especie: "Gato",
          raca: "Maine Coon",
          tutorNome: "Lucas Pereira",
        },
      ];
      localStorage.setItem("animais", JSON.stringify(dadosTeste));
      carregarAnimais();
    });
  }

  // Evento: Limpar Dados
  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      if (
        confirm("Tem certeza que deseja apagar todos os animais cadastrados?")
      ) {
        localStorage.removeItem("animais");
        carregarAnimais();
      }
    });
  }

  // Evento: Busca
  if (busca) {
    busca.addEventListener("input", () => {
      paginator.reset();
      carregarAnimais();
    });
  }

  // Carregar dados ao iniciar
  carregarAnimais();

  function carregarAnimais() {
    const animais = JSON.parse(localStorage.getItem("animais")) || [];
    const termo = busca ? busca.value.toLowerCase() : "";

    tbody.innerHTML = "";

    const filtrados = animais.filter(
      (a) =>
        a.nome.toLowerCase().includes(termo) ||
        a.especie.toLowerCase().includes(termo) ||
        (a.tutorNome && a.tutorNome.toLowerCase().includes(termo))
    );

    if (filtrados.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;">Nenhum animal encontrado.</td></tr>';
      return;
    }

    // Ordenar alfabeticamente
    filtrados.sort((a, b) => a.nome.localeCompare(b.nome));

    const { data, totalPages } = paginator.paginate(filtrados);

    data.forEach((a) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.nome}</td>
        <td>${a.especie}</td>
        <td>${a.raca || "-"}</td>
        <td>${a.tutorNome || "-"}</td>
        <td>
          <button class="btn-icon" onclick="alert('Funcionalidade de edição em desenvolvimento')" title="Editar" style="cursor:pointer; border:none; background:transparent; margin-right: 5px;">✏️</button>
          <button class="btn-icon" onclick="excluirAnimal('${
            a.id
          }')" title="Excluir" style="cursor:pointer; border:none; background:transparent;">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    paginator.renderControls("pagination", totalPages);
  }

  // Função global para excluir linha individual
  window.excluirAnimal = function (id) {
    if (confirm("Deseja realmente excluir este animal?")) {
      const animais = JSON.parse(localStorage.getItem("animais")) || [];
      const novosAnimais = animais.filter((a) => a.id !== id);
      localStorage.setItem("animais", JSON.stringify(novosAnimais));
      carregarAnimais();
    }
  };
});
