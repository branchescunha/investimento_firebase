const firebaseConfig = {
    apiKey: "AIzaSyBBKpy-JPplsP738DmwqnfXdnCPZZs4ghg",
    authDomain: "project-b4b73.firebaseapp.com",
    projectId: "project-b4b73",
    storageBucket: "project-b4b73.firebasestorage.app",
    messagingSenderId: "938254709338",
    appId: "1:938254709338:web:30ba7890fcb8ee5b78de63",
    measurementId: "G-R1S9E98MK9"
};
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  let editando = false;
  let investimentoIdAtual = null;
  
  document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const tipo = document.getElementById('tipo').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const data = document.getElementById('data').value;
    const descricao = document.getElementById('descricao').value;
  
    if (editando) {
      atualizarInvestimento(investimentoIdAtual, tipo, valor, data, descricao);
    } else {
      cadastrarInvestimento(tipo, valor, data, descricao);
    }
  });
  
  document.getElementById('btnCancelar').addEventListener('click', cancelarEdicao);
  
  function cadastrarInvestimento(tipo, valor, data, descricao) {
    db.collection('investimentos').add({
      tipo, valor, data, descricao
    })
    .then(() => {
      alert('Investimento cadastrado com sucesso!');
      document.getElementById('cadastroForm').reset();
      listarInvestimentos();
    })
    .catch((error) => {
      console.error('Erro ao cadastrar investimento:', error);
      alert('Erro ao cadastrar investimento.');
    });
  }
  
  function listarInvestimentos() {
    const tbody = document.querySelector('#listaInvestimentos tbody');
    tbody.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
  
    db.collection('investimentos').get()
      .then((querySnapshot) => {
        tbody.innerHTML = '';
        if (querySnapshot.empty) {
          tbody.innerHTML = '<tr><td colspan="5">Nenhum investimento cadastrado.</td></tr>';
          return;
        }
  
        querySnapshot.forEach((doc) => {
          const investimento = doc.data();
          const id = doc.id;
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${investimento.tipo}</td>
            <td>R$ ${investimento.valor.toFixed(2)}</td>
            <td>${investimento.data}</td>
            <td>${investimento.descricao}</td>
            <td class="actions">
              <button class="edit-button" onclick="editarInvestimento('${id}', '${investimento.tipo}', ${investimento.valor}, '${investimento.data}', '${investimento.descricao}')">Editar</button>
              <button class="delete-button" onclick="excluirInvestimento('${id}')">Excluir</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar investimentos:', error);
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar investimentos.</td></tr>';
      });
  }
  
  function editarInvestimento(id, tipo, valor, data, descricao) {
    editando = true;
    investimentoIdAtual = id;
  
    document.getElementById('investimentoId').value = id;
    document.getElementById('tipo').value = tipo;
    document.getElementById('valor').value = valor;
    document.getElementById('data').value = data;
    document.getElementById('descricao').value = descricao;
  
    document.getElementById('btnCadastrar').textContent = 'Atualizar';
    document.getElementById('btnCancelar').style.display = 'inline-block';
  }
  
  function atualizarInvestimento(id, tipo, valor, data, descricao) {
    db.collection('investimentos').doc(id).update({
      tipo, valor, data, descricao
    })
    .then(() => {
      alert('Investimento atualizado com sucesso!');
      cancelarEdicao();
      listarInvestimentos();
    })
    .catch((error) => {
      console.error('Erro ao atualizar investimento:', error);
      alert('Erro ao atualizar investimento.');
    });
  }
  
  function excluirInvestimento(id) {
    if (confirm('Tem certeza que deseja excluir este investimento?')) {
      db.collection('investimentos').doc(id).delete()
        .then(() => {
          alert('Investimento excluído com sucesso!');
          listarInvestimentos();
        })
        .catch((error) => {
          console.error('Erro ao excluir investimento:', error);
          alert('Erro ao excluir investimento.');
        });
    }
  }
  
  function cancelarEdicao() {
    editando = false;
    investimentoIdAtual = null;
  
    document.getElementById('cadastroForm').reset();
    document.getElementById('investimentoId').value = '';
    document.getElementById('btnCadastrar').textContent = 'Cadastrar';
    document.getElementById('btnCancelar').style.display = 'none';
  }
  
  window.onload = listarInvestimentos;  