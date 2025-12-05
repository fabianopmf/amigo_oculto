# 🎄 Amigo Oculto de Natal

Um aplicativo web simples para organizar sorteios de amigo oculto e enviar emails automaticamente para os participantes.

## 🎯 Funcionalidades

- ➕ Adicionar participantes com nome e email
- 🎲 Realizar sorteio automático (ninguém tira a si mesmo)
- 👀 Visualizar resultado completo antes de enviar
- 📧 Enviar emails HTML personalizados via Brevo
- 🎨 Interface bonita com tema natalino

## 🚀 Como Usar

⚡ **A API Key do Brevo já está configurada!** Você pode começar a usar imediatamente.

### 1. Abrir o Aplicativo

1. Abra o arquivo `index.html` no seu navegador
2. Ou hospede em qualquer servidor web estático (GitHub Pages, Netlify, etc.)

### 2. Realizar o Sorteio

1. Preencha nome e email de cada participante
2. Clique em **"➕ Adicionar Participante"** para adicionar mais pessoas
3. Quando terminar (mínimo 3 pessoas), clique em **"🎲 Realizar Sorteio"**
4. Confira o resultado: veja quem tirou quem
5. Clique em **"📧 Enviar Emails para Todos"**
6. Aguarde o envio e veja o status de cada email

## ✨ Como Funciona

### Algoritmo de Sorteio
- Usa um algoritmo de **derangement** (permutação onde ninguém fica na mesma posição)
- Garante que ninguém tira a si mesmo
- Todos tiram exatamente uma pessoa
- Sem repetições

### Template de Email
Cada pessoa recebe um email bonito em HTML com:
- Tema natalino (🎅 🎄 🎁)
- Nome do amigo oculto destacado
- Design responsivo e profissional

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para enviar emails)
- Conta Brevo gratuita (300 emails/dia)

## 🔒 Segurança

⚠️ **Importante**: Este é um aplicativo caseiro e a API Key fica exposta no frontend. Use apenas para:
- Grupos pequenos de confiança
- Eventos pessoais
- Nunca compartilhe sua API Key publicamente

## 🎁 Limites

- **Brevo Free**: 300 emails por dia
- **Participantes**: Ideal para até 30 pessoas
- **Mínimo**: 3 participantes

## 🛠️ Estrutura do Projeto

```
/amigo_oculto
  ├── index.html   # Página principal
  ├── style.css    # Estilos
  ├── app.js       # Lógica do sorteio e envio
  └── README.md    # Este arquivo
```

## 💡 Dicas

1. **Teste primeiro**: Faça um sorteio de teste com seus próprios emails
2. **Confira os dados**: Valide todos os emails antes de sortear
3. **Salve o resultado**: Tire um print da tela de resultado como backup
4. **Verifique spam**: Peça aos participantes para checarem a pasta de spam

## 🎅 Exemplo de Email

Os participantes receberão um email assim:

```
🎅 🎄 🎁

Amigo Oculto de Natal!

Olá, João!

O sorteio do Amigo Oculto foi realizado!
A pessoa que você tirou é:

🎁 Maria 🎁

Prepare um presente especial e mantenha o segredo!
Boas festas e boa sorte! ✨

⭐ 🎄 ⭐ 🎄 ⭐
```

## ❓ Problemas Comuns

### Email não chegou?
- Verifique se a API Key está correta
- Confira a pasta de spam
- Verifique se o email está escrito corretamente

### Erro ao enviar?
- Verifique sua conexão com internet
- Confirme que a API Key está ativa no Brevo
- Verifique se não excedeu o limite diário (300 emails)

### Sorteio inválido?
- Precisa de no mínimo 3 participantes
- Verifique se não há emails duplicados
- Todos os campos precisam estar preenchidos

## 📞 Suporte

Este é um projeto simples e direto. Se precisar de ajuda:
1. Leia este README com atenção
2. Verifique a documentação do [Brevo](https://developers.brevo.com/)

## 🎉 Divirta-se!

Feliz Natal e bom Amigo Oculto! 🎅🎄🎁
