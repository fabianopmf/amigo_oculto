// Estado global
let participantes = [];
let resultadoSorteio = [];

// API Key do Brevo - Configurar na interface
let BREVO_API_KEY = '';

// Funções de manipulação de participantes
function adicionarParticipante() {
    const lista = document.getElementById('participantes-lista');
    const novoItem = document.createElement('div');
    novoItem.className = 'participante-item';
    novoItem.innerHTML = `
        <input type="text" placeholder="Nome" class="input-nome" required>
        <input type="email" placeholder="email@exemplo.com" class="input-email" required>
        <button class="btn-remover" onclick="removerParticipante(this)">❌</button>
    `;
    lista.appendChild(novoItem);
}

function removerParticipante(botao) {
    const lista = document.getElementById('participantes-lista');
    const items = lista.getElementsByClassName('participante-item');

    // Mantém pelo menos 1 campo
    if (items.length > 1) {
        botao.parentElement.remove();
    } else {
        alert('Você precisa de pelo menos um participante!');
    }
}

// Trocar entre abas
function trocarAba(aba) {
    // Remove active de todos os botões e conteúdos
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Ativa a aba selecionada
    if (aba === 'manual') {
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
        document.getElementById('aba-manual').classList.add('active');
    } else {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('aba-massa').classList.add('active');
    }
}

// Importar participantes em massa
function importarEmMassa() {
    const texto = document.getElementById('importacao-texto').value.trim();

    if (!texto) {
        alert('Por favor, cole a lista de participantes no campo de texto!');
        return;
    }

    const linhas = texto.split('\n').filter(linha => linha.trim());
    const lista = document.getElementById('participantes-lista');

    // Limpa a lista atual
    lista.innerHTML = '';

    let importados = 0;
    let erros = [];

    linhas.forEach((linha, index) => {
        const partes = linha.split(',').map(p => p.trim());

        if (partes.length !== 2) {
            erros.push(`Linha ${index + 1}: formato inválido (use: email, nome ou nome, email)`);
            return;
        }

        let nome, email;

        // Detecta qual é o email (contém @)
        if (partes[0].includes('@')) {
            email = partes[0];
            nome = partes[1];
        } else if (partes[1].includes('@')) {
            nome = partes[0];
            email = partes[1];
        } else {
            erros.push(`Linha ${index + 1}: nenhum email válido encontrado`);
            return;
        }

        // Valida email
        if (!validarEmail(email)) {
            erros.push(`Linha ${index + 1}: email inválido (${email})`);
            return;
        }

        // Adiciona participante
        const novoItem = document.createElement('div');
        novoItem.className = 'participante-item';
        novoItem.innerHTML = `
            <input type="text" placeholder="Nome" class="input-nome" value="${nome}" required>
            <input type="email" placeholder="email@exemplo.com" class="input-email" value="${email}" required>
            <button class="btn-remover" onclick="removerParticipante(this)">❌</button>
        `;
        lista.appendChild(novoItem);
        importados++;
    });

    // Mostra resultado
    if (importados > 0) {
        alert(`✅ ${importados} participante(s) importado(s) com sucesso!${erros.length > 0 ? '\n\n⚠️ Erros:\n' + erros.join('\n') : ''}`);
        // Volta para aba manual para ver os participantes
        trocarAba('manual');
        // Limpa o textarea
        document.getElementById('importacao-texto').value = '';
    } else {
        alert('❌ Nenhum participante foi importado.\n\nErros:\n' + erros.join('\n'));
    }
}

// Validação e coleta de dados
function coletarParticipantes() {
    const items = document.querySelectorAll('.participante-item');
    const participantes = [];
    const emailsVistos = new Set();

    for (let item of items) {
        const nome = item.querySelector('.input-nome').value.trim();
        const email = item.querySelector('.input-email').value.trim().toLowerCase();

        // Validações
        if (!nome || !email) {
            alert('Por favor, preencha todos os campos de nome e email!');
            return null;
        }

        if (!validarEmail(email)) {
            alert(`Email inválido: ${email}`);
            return null;
        }

        if (emailsVistos.has(email)) {
            alert(`Email duplicado: ${email}`);
            return null;
        }

        emailsVistos.add(email);
        participantes.push({ nome, email });
    }

    if (participantes.length < 3) {
        alert('Você precisa de pelo menos 3 participantes para o amigo oculto!');
        return null;
    }

    return participantes;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Algoritmo de sorteio (Derangement)
function realizarSorteio(participantes) {
    const n = participantes.length;
    let tentativas = 0;
    const maxTentativas = 100;

    while (tentativas < maxTentativas) {
        const embaralhado = [...participantes];

        // Fisher-Yates shuffle
        for (let i = embaralhado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
        }

        // Verifica se é um derangement válido (ninguém tira a si mesmo)
        let valido = true;
        for (let i = 0; i < n; i++) {
            if (participantes[i].email === embaralhado[i].email) {
                valido = false;
                break;
            }
        }

        if (valido) {
            // Cria pares: cada um tira o próximo
            const resultado = [];
            for (let i = 0; i < n; i++) {
                resultado.push({
                    pessoa: participantes[i],
                    amigoOculto: embaralhado[i]
                });
            }
            return resultado;
        }

        tentativas++;
    }

    // Fallback: método circular garantido
    const resultado = [];
    for (let i = 0; i < n; i++) {
        resultado.push({
            pessoa: participantes[i],
            amigoOculto: participantes[(i + 1) % n]
        });
    }
    return resultado;
}

// Função principal de sorteio
function sortear() {
    participantes = coletarParticipantes();

    if (!participantes) {
        return;
    }

    resultadoSorteio = realizarSorteio(participantes);

    // Exibe resultado
    exibirResultado();

    // Mostra seção de resultado
    document.getElementById('participantes-section').classList.add('hidden');
    document.getElementById('resultado-section').classList.remove('hidden');
}

function exibirResultado() {
    const resultadoDiv = document.getElementById('resultado-lista');
    resultadoDiv.innerHTML = '';

    resultadoSorteio.forEach((par, index) => {
        const item = document.createElement('div');
        item.className = 'resultado-item';
        item.innerHTML = `
            <strong>${par.pessoa.nome}</strong> (${par.pessoa.email})
            → tirou →
            <strong>${par.amigoOculto.nome}</strong>
        `;
        resultadoDiv.appendChild(item);
    });
}

function novoSorteio() {
    document.getElementById('resultado-section').classList.add('hidden');
    document.getElementById('status-section').classList.add('hidden');
    document.getElementById('participantes-section').classList.remove('hidden');
    resultadoSorteio = [];
}

// Template de email HTML
function gerarEmailHTML(nomePessoa, nomeAmigoOculto) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #c41e3a;
            font-size: 2.5em;
            margin: 0;
        }
        .icon-line {
            font-size: 3em;
            margin: 20px 0;
        }
        .content {
            text-align: center;
            font-size: 1.2em;
            line-height: 1.6;
            color: #333;
        }
        .amigo-nome {
            font-size: 2em;
            color: #c41e3a;
            font-weight: bold;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border: 3px dashed #c41e3a;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            border-top: 2px solid #f0f0f0;
            padding-top: 20px;
        }
        .decoracao {
            text-align: center;
            font-size: 2em;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon-line">🎅 🎄 🎁</div>
            <h1>Amigo Oculto de Natal!</h1>
        </div>

        <div class="content">
            <p>Olá, <strong>${nomePessoa}</strong>!</p>
            <p>O sorteio do Amigo Oculto foi realizado!</p>
            <p>A pessoa que você tirou é:</p>

            <div class="amigo-nome">
                🎁 ${nomeAmigoOculto} 🎁
            </div>

            <p>Prepare um presente especial e mantenha o segredo!</p>
            <p>Boas festas e boa sorte! ✨</p>
        </div>

        <div class="decoracao">⭐ 🎄 ⭐ 🎄 ⭐</div>

        <div class="footer">
            <p>Este é um email automático do sistema de Amigo Oculto.</p>
            <p>Feliz Natal! 🎅</p>
        </div>
    </div>
</body>
</html>
    `;
}

// Envio de emails via Brevo
async function enviarEmails() {
    // Pega a chave do campo ou do localStorage
    let apiKey = document.getElementById('brevo-api-key').value.trim();

    if (!apiKey) {
        apiKey = localStorage.getItem('brevo_api_key') || '';
    }

    if (!apiKey) {
        alert('⚠️ Por favor, configure sua API Key do Brevo antes de enviar os emails!\n\nClique em "Configurações Brevo API" no rodapé e cole sua chave.');
        return;
    }

    // Salva a chave para próximas vezes
    localStorage.setItem('brevo_api_key', apiKey);

    // Mostra seção de status
    document.getElementById('status-section').classList.remove('hidden');
    const statusDiv = document.getElementById('status-lista');
    statusDiv.innerHTML = '';

    // Desabilita botão de envio
    const btnEnviar = document.getElementById('btn-enviar');
    btnEnviar.disabled = true;
    btnEnviar.textContent = '📧 Enviando...';

    // Envia email para cada participante
    for (let par of resultadoSorteio) {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item loading';
        statusItem.innerHTML = `<span class="spinner"></span> Enviando para ${par.pessoa.nome}...`;
        statusDiv.appendChild(statusItem);

        try {
            await enviarEmailBrevo(apiKey, par.pessoa, par.amigoOculto);
            statusItem.className = 'status-item success';
            statusItem.innerHTML = `✅ Email enviado com sucesso para ${par.pessoa.nome} (${par.pessoa.email})`;
        } catch (error) {
            statusItem.className = 'status-item error';
            statusItem.innerHTML = `❌ Erro ao enviar para ${par.pessoa.nome}: ${error.message}`;
        }

        // Pequeno delay entre envios para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    btnEnviar.disabled = false;
    btnEnviar.textContent = '✅ Emails Enviados!';
}

async function enviarEmailBrevo(apiKey, pessoa, amigoOculto) {
    const emailHTML = gerarEmailHTML(pessoa.nome, amigoOculto.nome);

    // Pega email e nome do remetente configurados
    const senderEmail = document.getElementById('sender-email').value.trim() || localStorage.getItem('sender_email');
    const senderName = document.getElementById('sender-name').value.trim() || localStorage.getItem('sender_name') || 'Amigo Oculto';

    if (!senderEmail) {
        throw new Error('Configure o email remetente nas configurações!');
    }

    const payload = {
        sender: {
            name: senderName,
            email: senderEmail
        },
        to: [
            {
                email: pessoa.email,
                name: pessoa.nome
            }
        ],
        subject: "🎅 Seu Amigo Oculto foi sorteado!",
        htmlContent: emailHTML
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao enviar email');
    }

    return response.json();
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 App de Amigo Oculto carregado!');

    // Carrega configurações salvas
    const apiKeyInput = document.getElementById('brevo-api-key');
    const senderEmailInput = document.getElementById('sender-email');
    const senderNameInput = document.getElementById('sender-name');

    const savedKey = localStorage.getItem('brevo_api_key');
    const savedEmail = localStorage.getItem('sender_email');
    const savedName = localStorage.getItem('sender_name');

    if (apiKeyInput && savedKey) {
        apiKeyInput.value = savedKey;
        BREVO_API_KEY = savedKey;
    }

    if (senderEmailInput && savedEmail) {
        senderEmailInput.value = savedEmail;
    }

    if (senderNameInput && savedName) {
        senderNameInput.value = savedName;
    }

    // Salva quando o usuário digitar
    if (apiKeyInput) {
        apiKeyInput.addEventListener('blur', () => {
            const newKey = apiKeyInput.value.trim();
            if (newKey) {
                localStorage.setItem('brevo_api_key', newKey);
                BREVO_API_KEY = newKey;
            }
        });
    }

    if (senderEmailInput) {
        senderEmailInput.addEventListener('blur', () => {
            const email = senderEmailInput.value.trim();
            if (email) localStorage.setItem('sender_email', email);
        });
    }

    if (senderNameInput) {
        senderNameInput.addEventListener('blur', () => {
            const name = senderNameInput.value.trim();
            if (name) localStorage.setItem('sender_name', name);
        });
    }
});
