document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const atendimentoId = params.get("id");

  if (!atendimentoId) {
    alert("Nenhum atendimento selecionado.");
    window.location.href = "internacao.html";
    return;
  }

  // Atualiza os links dos botões de ação para manter o ID do atendimento
  atualizarLinksAcao(atendimentoId);

  carregarHistoricoPrescricoes(atendimentoId);
});

function atualizarLinksAcao(id) {
  const buttons = document.querySelectorAll(".actions-container button");
  buttons.forEach((btn) => {
    const onclick = btn.getAttribute("onclick");
    if (onclick && onclick.includes("window.location.href")) {
      // Garante que o ID seja passado corretamente na navegação
      // O HTML já tem + window.location.search, então isso é apenas um reforço se necessário
    }
    // Para o botão "Nova Prescrição" específico que pode não ter o search
    if (btn.textContent.includes("Nova Prescrição")) {
      btn.onclick = () =>
        (window.location.href = `nova-prescricao.html?id=${id}`);
    }
  });
}

function carregarHistoricoPrescricoes(atendimentoId) {
  const tbody = document.getElementById("tbody-prescricao");
  const prescricoes = JSON.parse(localStorage.getItem("prescricoes")) || [];

  // Filtrar por atendimento
  const lista = prescricoes.filter((p) => p.atendimentoId === atendimentoId);

  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="empty-message">Nenhuma prescrição registrada.</td></tr>';
    return;
  }

  // Ordenar por data (mais recente primeiro)
  lista.sort((a, b) => new Date(b.data) - new Date(a.data));

  lista.forEach((p) => {
    const tr = document.createElement("tr");
    const dataFormatada = new Date(p.data).toLocaleString();

    // Resumo dos medicamentos
    const resumoMedicamentos = `${p.medicamentos.length} medicamentos prescritos`;

    tr.innerHTML = `
      <td>${dataFormatada}</td>
      <td>${resumoMedicamentos}</td>
      <td>${p.veterinario || "--"}</td>
      <td>
        <button class="btn-visualizar" title="Visualizar" onclick="visualizarPrescricao('${
          p.id
        }')" style="cursor:pointer; border:none; background:transparent; margin-right: 5px; font-size: 1.2rem;">👁️</button>
        <button class="btn-duplicar" title="Duplicar" onclick="duplicarPrescricao('${p.id}')" style="cursor:pointer; border:none; background:transparent; margin-right: 5px; font-size: 1.2rem;">📋</button>
        <button class="btn-imprimir" title="Imprimir" onclick="imprimirPrescricao('${
          p.id
        }')" style="cursor:pointer; border:none; background:transparent; font-size: 1.2rem;">🖨️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function visualizarPrescricao(id) {
  const prescricoes = JSON.parse(localStorage.getItem("prescricoes")) || [];
  const prescricao = prescricoes.find((p) => p.id === id);

  if (!prescricao) return;

  // Redireciona para a página de nova prescrição em modo de visualização
  window.location.href = `nova-prescricao.html?id=${prescricao.atendimentoId}&prescricaoId=${id}&view=true`;
}

function duplicarPrescricao(id) {
  const prescricoes = JSON.parse(localStorage.getItem("prescricoes")) || [];
  const prescricao = prescricoes.find((p) => p.id === id);

  if (!prescricao) return;

  // Redireciona para a página de nova prescrição carregando os dados da antiga como base (sem view=true)
  window.location.href = `nova-prescricao.html?id=${prescricao.atendimentoId}&prescricaoId=${id}`;
}

function imprimirPrescricao(id) {
  const prescricoes = JSON.parse(localStorage.getItem("prescricoes")) || [];
  const prescricao = prescricoes.find((p) => p.id === id);

  if (!prescricao) {
    alert("Prescrição não encontrada.");
    return;
  }

  const atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];
  const atendimento = atendimentos.find(
    (a) => a.id == prescricao.atendimentoId
  );

  let nomeTutor = "--";
  let nomeAnimal = "--";

  if (atendimento) {
    const tutores = JSON.parse(localStorage.getItem("tutores")) || [];
    const animais = JSON.parse(localStorage.getItem("animais")) || [];

    // Tenta achar nomes pelos IDs ou strings salvas no atendimento
    let tutor = null;
    if (atendimento.tutorId) {
      tutor = tutores.find((t) => t.id == atendimento.tutorId);
    }
    if (!tutor) {
      tutor = tutores.find((t) => t.nome === atendimento.tutor);
    }
    nomeTutor = tutor ? tutor.nome : atendimento.tutor || "--";

    let animal = null;
    if (atendimento.animalId) {
      animal = animais.find((a) => a.id == atendimento.animalId);
    }
    if (!animal) {
      animal = animais.find((a) => a.nome === atendimento.animal);
    }
    nomeAnimal = animal ? animal.nome : atendimento.animal || "--";
  }

  // Buscar dados adicionais vinculados ao atendimento
  const evolucoes = (JSON.parse(localStorage.getItem("evolucoes")) || []).filter(
    (e) => e.atendimentoId === prescricao.atendimentoId
  );
  const exames = (JSON.parse(localStorage.getItem("exames")) || []).filter(
    (e) => e.atendimentoId === prescricao.atendimentoId
  );
  const procedimentos = (JSON.parse(localStorage.getItem("procedimentos")) || []).filter(
    (p) => p.atendimentoId === prescricao.atendimentoId
  );
  const afericoes = (JSON.parse(localStorage.getItem("afericoes")) || []).filter(
    (a) => a.atendimentoId === prescricao.atendimentoId
  );

  // Gerar HTML para seções extras
  let htmlExtras = "";

  if (evolucoes.length > 0) {
    htmlExtras += `<h3>Evoluções Clínicas</h3>
    <table>
      <thead><tr><th>Data/Hora</th><th>Descrição</th></tr></thead>
      <tbody>
        ${evolucoes.map(e => `<tr><td>${e.data || e.dataEvolucao} ${e.hora || e.horaEvolucao}</td><td>${e.descricao || e.descricaoEvolucao}</td></tr>`).join("")}
      </tbody>
    </table>`;
  }

  if (exames.length > 0) {
    htmlExtras += `<h3>Exames Solicitados</h3>
    <table>
      <thead><tr><th>Tipo</th><th>Prioridade</th><th>Indicação</th></tr></thead>
      <tbody>
        ${exames.map(e => `<tr><td>${e.tipo || e.tipoExame}</td><td>${e.prioridade || e.prioridadeExame}</td><td>${e.indicacao || e.indicacaoClinica}</td></tr>`).join("")}
      </tbody>
    </table>`;
  }

  if (procedimentos.length > 0) {
    htmlExtras += `<h3>Procedimentos</h3>
    <table>
      <thead><tr><th>Nome</th><th>Detalhes</th></tr></thead>
      <tbody>
        ${procedimentos.map(p => `<tr><td>${p.nome}</td><td>${p.detalhes || "-"}</td></tr>`).join("")}
      </tbody>
    </table>`;
  }

  if (afericoes.length > 0) {
    htmlExtras += `<h3>Aferições / Sinais Vitais</h3>
    <table>
      <thead><tr><th>Data/Hora</th><th>Temp</th><th>FC</th><th>FR</th></tr></thead>
      <tbody>
        ${afericoes.map(a => `<tr><td>${a.data} ${a.hora}</td><td>${a.temperatura || "-"}</td><td>${a.fc || "-"}</td><td>${a.fr || "-"}</td></tr>`).join("")}
      </tbody>
    </table>`;
  }

  const janelaImpressao = window.open("", "_blank");

  const linhasMedicamentos = prescricao.medicamentos
    .map(
      (med) => `
      <tr>
        <td>${med.nome}</td>
        <td>${med.dose}</td>
        <td>${med.intervalo || "--"}</td>
      </tr>
    `
    )
    .join("");

  const conteudo = `
    <html>
      <head>
        <title>Prescrição - ${nomeAnimal}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid #2dd4bf; padding-bottom: 20px; }
          .brand { display: flex; align-items: center; gap: 15px; }
          .brand img { max-height: 80px; width: auto; }
          .brand h1 { margin: 0; color: #0f766e; font-size: 28px; }
          .contact-info { text-align: right; font-size: 0.85rem; color: #666; line-height: 1.5; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f0fcf9; color: #0f766e; }
          .obs { margin-top: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
          .footer { margin-top: 60px; text-align: center; font-size: 0.9em; color: #666; }
          .assinatura { margin-top: 50px; border-top: 1px solid #333; width: 300px; margin-left: auto; margin-right: auto; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <img src="../img/logo.png" alt="Logo" onerror="this.style.display='none'">
            <h1>PetClin</h1>
          </div>
          <div class="contact-info">
            <strong>Clínica Veterinária</strong><br>
            Rua Exemplo, 123 - Centro<br>
            (11) 99999-9999 | contato@petclin.com
          </div>
        </div>

        <div class="info-grid">
          <div><strong>Veterinário:</strong> ${
            prescricao.veterinario || "--"
          }</div>
          <div><strong>Data:</strong> ${new Date(
            prescricao.data
          ).toLocaleString()}</div>
          <div><strong>Tutor:</strong> ${nomeTutor}</div>
          <div><strong>Paciente:</strong> ${nomeAnimal}</div>
        </div>

        <h3>Prescrição Médica</h3>
        <table>
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Dose</th>
              <th>Intervalo</th>
            </tr>
          </thead>
          <tbody>
            ${linhasMedicamentos}
          </tbody>
        </table>

        ${htmlExtras}

        ${
          prescricao.observacoes
            ? `<div class="obs"><strong>Observações:</strong><br>${prescricao.observacoes.replace(
                /\n/g,
                "<br>"
              )}</div>`
            : ""
        }

        <div class="footer">
          <div class="assinatura">Assinatura do Veterinário</div>
          <p>Impresso em ${new Date().toLocaleString()}</p>
        </div>
        <script>
          window.onload = () => { window.print(); };
        </script>
      </body>
    </html>
  `;

  janelaImpressao.document.write(conteudo);
  janelaImpressao.document.close();
}
