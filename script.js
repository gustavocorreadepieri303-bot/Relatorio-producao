// ===================================================================
// LÓGICA DO MODAL DE TUTORIAL (VÍDEOS LOCAIS)
// ===================================================================
function abrirModalTutorial() {
    document.getElementById('modal-tutorial').style.display = 'flex';
}

function fecharModalTutorial() {
    const modal = document.getElementById('modal-tutorial');
    const player = document.getElementById('player-tutorial');
    
    modal.style.display = 'none';
    
    // Pausa o vídeo se estiver a reproduzir ao fechar o modal
    if (player) {
        player.pause();
    }
}

function carregarVideoLocal(caminhoVideo, titulo, elementoBotao) {
    const player = document.getElementById('player-tutorial');
    const source = document.getElementById('source-tutorial');
    const tituloElemento = document.getElementById('tutorial-titulo-video');

    // Altera o caminho do vídeo e carrega a nova fonte
    source.src = caminhoVideo;
    player.load();
    tituloElemento.textContent = titulo;

    // Destaca o botão selecionado na lista
    const botoes = document.querySelectorAll('.tutorial-item');
    botoes.forEach(btn => btn.classList.remove('active'));
    elementoBotao.classList.add('active');
}

// Fechar o modal clicando fora do conteúdo
window.addEventListener('click', function(event) {
    const modalTutorial = document.getElementById('modal-tutorial');
    if (event.target === modalTutorial) {
        fecharModalTutorial();
    }
});

function abrirRascunho() {
            document.getElementById('Rascunho').style.display = 'flex';
        }

        // ===================================================================
        // LÓGICA DE CONTAGEM DE TRAÇOS
        // ===================================================================
        let contadorTracos = 0;

        const btnAdicionar = document.getElementById('btn-adicionar');
        const btnResetar = document.getElementById('btn-resetar');
        const container = document.getElementById('container-marcas');
        const numTracosDisplay = document.getElementById('num-tracos');

        const classesTracos = [
            'linha-topo',
            'linha-direita',
            'linha-baixo',
            'linha-esquerda',
            'linha-diagonal'
        ];

        // Desenha visualmente 1 traço no DOM
        function desenharProximoTraco() {
            const indiceForma = Math.floor(contadorTracos / classesTracos.length);
            const indiceTraco = contadorTracos % classesTracos.length;

            let formaAtual = container.children[indiceForma];
            if (!formaAtual) {
                formaAtual = document.createElement('div');
                formaAtual.className = 'forma';
                container.appendChild(formaAtual);
            }

            const novoTraco = document.createElement('div');
            novoTraco.className = classesTracos[indiceTraco];
            formaAtual.appendChild(novoTraco);

            contadorTracos++;

            if (numTracosDisplay) {
                numTracosDisplay.textContent = contadorTracos;
            }
        }

        btnAdicionar.addEventListener('click', () => {
            desenharProximoTraco();
            salvarRascunhoCampos(); // Salva no localStorage a cada adição
        });

        btnResetar.addEventListener('click', () => {
            container.innerHTML = '';
            contadorTracos = 0;
            if (numTracosDisplay) {
                numTracosDisplay.textContent = 0;
            }
            salvarRascunhoCampos(); // Atualiza o localStorage com o valor zerado
        });

        function validarEIrParaParada() {
            const qntdFardo = document.getElementById('input-qntd-fardo').value.trim();

            if (qntdFardo !== "") {
                alert("Envie a produção atual antes de registrar uma parada");
                return;
            }

            window.location.href = "selecionar_motivo.html";
        }

        function atualizarDataOperacional() {
            const selectTurno = document.getElementById('select-turno');
            const inputData = document.getElementById('input-data');

            if (!selectTurno || !inputData) return;

            const turno = selectTurno.value.toUpperCase().trim();
            const agora = new Date();

            if ((turno === "C" || turno === "D" || turno.includes("C") || turno.includes("D")) && agora.getHours() < 5) {
                agora.setDate(agora.getDate() - 1);
            }

            const ano = agora.getFullYear();
            const mes = String(agora.getMonth() + 1).padStart(2, '0');
            const dia = String(agora.getDate()).padStart(2, '0');

            inputData.value = `${ano}-${mes}-${dia}`;
        }

        document.getElementById('select-turno').addEventListener('change', atualizarDataOperacional);
        document.addEventListener('DOMContentLoaded', atualizarDataOperacional);

        var URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzjaXrfzcFEDvrf-auAizsEtl0TroOkfTRsLTho3TFElpJ9dhLrboWbVlhB8NA5agl_/exec";

        // ===================================================================
        // MODAL REFUGO
        // ===================================================================
        function abrirModalRefugo() {
            document.getElementById('meu-modal-refugo').style.display = 'flex';
        }

        function fecharModalRefugo() {
            document.getElementById('meu-modal-refugo').style.display = 'none';
            document.getElementById('form-refugo').reset();
        }

        function enviarRefugo(event) {
            event.preventDefault();

            const linha = document.getElementById('select-Linha-rfg').value;
            const equipe = document.getElementById('input-name').value;
            const kgRefugoGrf = document.getElementById('input-refugo-grf').value;
            const kgRefugoPrf = document.getElementById('input-refugo-prf').value;
            const turno = document.getElementById('input-turno-refugo').value;
            const dataRefugo = document.getElementById('input-data').value;

            const corpo = new URLSearchParams();
            corpo.append("tipo", "refugo");
            corpo.append("linha_refugo", linha);
            corpo.append("realizado_por", equipe);
            corpo.append("quantidade_refugo_grf", kgRefugoGrf);
            corpo.append("quantidade_refugo_prf", kgRefugoPrf);
            corpo.append("turno_refugo", turno);
            corpo.append("data", dataRefugo);

            const botao = event.submitter;
            botao.innerText = "Enviando...";
            botao.disabled = true;

            fetch(URL_SCRIPT, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: corpo.toString()
            })
                .then(() => {
                    alert("Refugo registrado com sucesso!");
                    fecharModalRefugo();
                    botao.innerText = "Enviar";
                    botao.disabled = false;
                })
                .catch(() => {
                    alert("Erro de conexão. Tente novamente.");
                    botao.innerText = "Enviar";
                    botao.disabled = false;
                });
        }

        // ===================================================================
        // LÓGICA DE HORÁRIO ENCADEADO (Das / Até)
        // ===================================================================
        const HORARIO_INICIO_MANHA = "05:00";
        const HORARIO_INICIO_TARDE = "17:00";

        const selectTurno = document.getElementById('select-turno');
        const inputDas = document.getElementById('input-das');
        const inputAte = document.getElementById('input-ate');

        function horarioInicialDoTurno(turno) {
            return (turno === "A" || turno === "B") ? HORARIO_INICIO_MANHA : HORARIO_INICIO_TARDE;
        }

        function resetarParaNovoTurno(turno) {
            inputDas.value = horarioInicialDoTurno(turno);
            inputAte.value = "";
            salvarRascunhoCampos();
        }

        selectTurno.addEventListener('change', function () {
            if (this.value) {
                resetarParaNovoTurno(this.value);
            } else {
                inputDas.value = "";
                inputAte.value = "";
                salvarRascunhoCampos();
            }
        });

        function avancarHorarioAposEnvio() {
            if (inputAte.value) {
                inputDas.value = inputAte.value;
                inputAte.value = "";
            }
            salvarRascunhoCampos();
        }

        // ===================================================================
        // PERSISTÊNCIA DO FORMULÁRIO (localStorage)
        // ===================================================================
        const CHAVE_RASCUNHO = "rascunho_relatorio_producao";

        // Apenas elementos de input/select devem estar nesta lista
        const camposPersistentes = [
            "select-Linha",
            "select-turno",
            "input-garrafa",
            "input-lote-preforma",
            "input-name",
            "input-qntd-p-fardo",
            "input-das",
            "input-ate",
            "input-motivo-parada",
            "input-motivo-codigo",
            "input-preforma",
            "input-data"
        ];

        function salvarRascunhoCampos() {
            const rascunho = {};

            // Salva apenas os valores dos campos válidos
            camposPersistentes.forEach(function (id) {
                const elemento = document.getElementById(id);
                if (elemento) rascunho[id] = elemento.value;
            });

            // Salva a quantidade inteira de traços
            rascunho["contadorTracos"] = contadorTracos;

            localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho));
        }

        function restaurarRascunhoCampos() {
            const dadosSalvos = localStorage.getItem(CHAVE_RASCUNHO);
            if (!dadosSalvos) return;
            try {
                const rascunho = JSON.parse(dadosSalvos);

                // Restaura os campos do formulário
                camposPersistentes.forEach(function (id) {
                    const elemento = document.getElementById(id);
                    if (elemento && rascunho[id] !== undefined) {
                        elemento.value = rascunho[id];
                    }
                });

                // Restaura e redesenha os traços acumulados
                if (rascunho["contadorTracos"] !== undefined) {
                    const totalTracosSalvos = rascunho["contadorTracos"];
                    
                    // Limpa traços anteriores antes de reconstruir
                    container.innerHTML = '';
                    contadorTracos = 0;

                    for (let i = 0; i < totalTracosSalvos; i++) {
                        desenharProximoTraco();
                    }
                }

            } catch (erro) {
                console.error("Erro ao restaurar rascunho:", erro);
            }
        }

        function limparRascunhoCampos() {
            localStorage.removeItem(CHAVE_RASCUNHO);
        }

        document.addEventListener('DOMContentLoaded', function () {
            restaurarRascunhoCampos();
            verificarMotivoParadaSelecionado();

            const motivoSalvo = document.getElementById('input-motivo-parada').value;
            if (motivoSalvo) {
                grupoQuantidades.style.display = 'none';
                grupoMotivoParada.style.display = 'flex';
                inputQntdPFardo.required = false;
                inputQntdFardo.required = false;
            }
        });

        // ===================================================================
        // INTEGRAÇÃO COM TELA DE SELECIONAR MOTIVO
        // ===================================================================
        const grupoQuantidades = document.getElementById('grupo-quantidades');
        const grupoMotivoParada = document.getElementById('grupo-motivo-parada');
        const inputMotivoParada = document.getElementById('input-motivo-parada');
        const inputMotivoCodigo = document.getElementById('input-motivo-codigo');
        const inputQntdPFardo = document.getElementById('input-qntd-p-fardo');
        const inputQntdFardo = document.getElementById('input-qntd-fardo');

        function verificarMotivoParadaSelecionado() {
            const codigoSalvo = localStorage.getItem('parada_codigo');
            const descricaoSalva = localStorage.getItem('parada_descricao');
            if (codigoSalvo && descricaoSalva) {
                grupoQuantidades.style.display = 'none';
                grupoMotivoParada.style.display = 'flex';
                inputMotivoParada.value = descricaoSalva;
                inputMotivoCodigo.value = codigoSalvo;
                inputQntdPFardo.required = false;
                inputQntdFardo.required = false;
                localStorage.removeItem('parada_codigo');
                localStorage.removeItem('parada_descricao');
                salvarRascunhoCampos();
            }
        }

        document.getElementById('btn-limpar-motivo').addEventListener('click', function () {
            grupoMotivoParada.style.display = 'none';
            grupoQuantidades.style.display = 'flex';
            inputMotivoParada.value = '';
            inputMotivoCodigo.value = '';
            inputQntdPFardo.required = true;
            inputQntdFardo.required = true;
            salvarRascunhoCampos();
        });

        // ===================================================================
        // ENVIO DE PRODUÇÃO PARA A PLANILHA
        // ===================================================================
        async function enviarParaPlanilha(event) {
            event.preventDefault();

            const linha = document.getElementById('select-Linha').value;
            const turno = document.getElementById('select-turno').value;
            const realizadoPor = document.getElementById('input-name').value;
            const garrafa = document.getElementById('input-garrafa').value;
            const lotePreforma = document.getElementById('input-lote-preforma').value;
            const horasDas = document.getElementById('input-das').value;
            const horasAte = document.getElementById('input-ate').value;
            const qntdFardo = document.getElementById('input-qntd-fardo').value;
            const qntdPFardo = document.getElementById('input-qntd-p-fardo').value;
            const codigoParada = document.getElementById('input-motivo-codigo').value;
            const preforma = document.getElementById('input-preforma').value;
            const data = document.getElementById('input-data').value;

            if (!linha || !turno || !realizadoPor || !horasDas || !horasAte || !data) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            const corpo = new URLSearchParams({
                tipo: "producao",
                linha: linha,
                turno_trabalho: turno,
                realizado_por: realizadoPor,
                nome_garrafa: garrafa,
                lote_preforma: lotePreforma,
                preforma: preforma,
                hora_das: horasDas,
                hora_ate: horasAte,
                "qntd-fardo": qntdFardo,
                "qntd-p-fardo": qntdPFardo,
                defeito_selected: codigoParada,
                data: data
            });

            const botao = document.querySelector('.send');
            botao.innerText = "Enviando...";
            botao.disabled = true;

            try {
                avancarHorarioAposEnvio();
                if (codigoParada) {
                    document.getElementById('btn-limpar-motivo').click();
                }

                await fetch(URL_SCRIPT, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: corpo.toString()
                });

                alert("Registrado com sucesso!");

                setTimeout(() => {
                    window.location.reload();
                }, 100);

            } catch (error) {
                alert("Erro de conexão. Tente novamente.");
                botao.innerText = "Enviar";
                botao.disabled = false;
            }
        }