# YouTube Sync Room

Uma aplicação web completa que permite a múltiplos usuários assistirem a vídeos do YouTube de forma sincronizada, acompanhada de um chat em tempo real. A sala é controlada por um administrador que gerencia a reprodução e a seleção de vídeos, enquanto os visitantes assistem ao conteúdo em perfeita sincronia.

## 🚀 Sobre o Projeto

O **YouTube Sync Room** foi criado para simular uma experiência de "cinema virtual". A ideia central é que um administrador tenha total controle sobre o conteúdo exibido, podendo buscar vídeos de um canal específico, carregar playlists e controlar a reprodução (play/pause) para todos os espectadores simultaneamente. Os visitantes entram na sala, definem um apelido e interagem através de um chat, enquanto o player de vídeo reflete as ações do administrador em tempo real.

Este projeto demonstra habilidades em desenvolvimento front-end com JavaScript puro, integração com APIs de terceiros (YouTube e Firebase) e manipulação de dados em tempo real com um backend serverless (Firebase).

## ✨ Principais Funcionalidades

### Para Todos os Usuários
- **Player Sincronizado:** O player de vídeo é sincronizado com o estado definido pelo administrador.
- **Chat em Tempo Real:** Um chat funcional permite a comunicação entre todos na sala, com mensagens de administradores e visitantes visualmente distintas.
- **Botão de Sincronização Manual:** Garante que qualquer usuário possa ressincronizar seu player com o estado atual da sala a qualquer momento.
- **Apelidos para Visitantes:** Visitantes podem definir um apelido, que é salvo no `localStorage` do navegador para uma experiência contínua.
- **Notificações:** Feedbacks visuais (toasts) informam sobre ações importantes, como sincronização, pausa pelo admin, etc.

### Painel do Administrador
- **Autenticação Segura:** Login protegido por e-mail e senha utilizando o Firebase Authentication.
- **Controle Total do Player:** O administrador controla o play, pause e a seleção de vídeos para todos os usuários.
- **Busca de Vídeos:** Permite buscar vídeos de um canal específico do YouTube através da API de dados do YouTube.
- **Carregar Playlists:** Capacidade de carregar todos os vídeos de uma playlist do YouTube a partir do seu ID.
- **Moderação do Chat:** Administradores podem apagar qualquer mensagem do chat.
- **Logs de Atividade:** Um painel exibe um registro em tempo real de todas as ações importantes (logins, trocas de vídeo, mensagens apagadas, etc.).

## 🛠️ Tecnologias Utilizadas

- **Front-End:**
  - HTML5
  - [Tailwind CSS](https://tailwindcss.com/) (para estilização moderna e responsiva)
  - JavaScript (ES6 Modules, Vanilla JS)

- **Back-End (Serverless):**
  - **[Firebase](https://firebase.google.com/)**:
    - **Firestore:** Banco de dados NoSQL para sincronização do estado do player, mensagens do chat e logs em tempo real.
    - **Authentication:** Para o sistema de login do administrador.

- **APIs:**
  - **[YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference):** Para incorporar e controlar o player de vídeo.
  - **[YouTube Data API v3](https://developers.google.com/youtube/v3):** Para buscar vídeos e carregar playlists.

## ⚙️ Configuração e Instalação

Para executar este projeto, não é necessário um servidor web complexo, pois ele pode ser aberto diretamente no navegador. No entanto, é **essencial** configurar as chaves de API do Firebase e do YouTube.

### Passo 1: Clone o Repositório PRINCIPAL DO PORTIFÓLIO
```bash
git clone [https://github.com/Ort4vi0/PORTIFOLIO.git)
cd PORTIFOLIO
cd SYNC-Youtube
```

### Passo 2: Configure o Firebase
1.  Acesse o [Console do Firebase](https://console.firebase.google.com/).
2.  Crie um novo projeto.
3.  Vá para **Build > Authentication** e habilite o provedor de **E-mail/Senha**. Adicione um usuário administrador.
4.  Vá para **Build > Firestore Database** e crie um banco de dados em modo de produção (ou teste, mas ajuste as regras de segurança).
5.  No painel do seu projeto, clique no ícone de engrenagem > **Configurações do projeto**.
6.  Na aba **Geral**, role para baixo até "Seus apps" e clique no ícone da web (`</>`) para registrar um novo app da web.
7.  Copie o objeto de configuração `firebaseConfig`.

### Passo 3: Configure a API do YouTube
1.  Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2.  Crie um novo projeto ou selecione um existente.
3.  No menu de navegação, vá para **APIs e Serviços > Biblioteca**.
4.  Procure por **"YouTube Data API v3"** e ative-a.
5.  Vá para **APIs e Serviços > Credenciais**.
6.  Clique em **+ CRIAR CREDENCIAIS** e selecione **Chave de API**. Copie a chave gerada.

### Passo 4: Atualize o Arquivo `index.html`
Abra o arquivo `index.html` e encontre a seção de configuração do JavaScript. Substitua os placeholders pelas suas chaves e IDs:

```javascript
// --- CONFIGURAÇÃO (SUBSTITUA PELOS SEUS DADOS) ---
const firebaseConfig = {
    apiKey: "SUA_API_KEY_DO_FIREBASE",
    authDomain: "SEU_AUTH_DOMAIN.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID",
    measurementId: "SEU_MEASUREMENT_ID"
};
const YOUTUBE_API_KEY = "SUA_API_KEY_DO_YOUTUBE";
const YOUTUBE_CHANNEL_ID = "ID_DO_CANAL_PARA_BUSCA"; // Opcional, para limitar a busca
// --- FIM DA CONFIGURAÇÃO ---
```

### Passo 5: Execute!
Após salvar as alterações, basta abrir o arquivo `index.html` em seu navegador de preferência.

## 🗂️ Estrutura do Banco de Dados (Firestore)

O Firestore é organizado em coleções e documentos. Esta aplicação utiliza a seguinte estrutura:

-   **Coleção:** `playerState`
    -   **Documento:** `currentState`
        -   `videoId` (string): O ID do vídeo do YouTube que está sendo reproduzido.
        -   `state` (number): O estado do player (1 para PLAYING, 2 para PAUSED, etc.).
        -   `currentTime` (number): O tempo atual do vídeo em segundos.
        -   `timestamp` (number): A data e hora da última atualização.

-   **Coleção:** `chatMessages`
    -   **Documentos:** (Gerados automaticamente)
        -   `text` (string): O conteúdo da mensagem.
        -   `sender` (string): O apelido do remetente.
        -   `isAdmin` (boolean): `true` se a mensagem foi enviada por um administrador.
        -   `timestamp` (number): A data e hora do envio.

-   **Coleção:** `logs`
    -   **Documentos:** (Gerados automaticamente)
        -   `action` (string): O tipo de ação (ex: 'LOGIN', 'CHANGE_VIDEO').
        -   `details` (string): Uma descrição da ação.
        -   `admin` (string): O e-mail do administrador que realizou a ação.
        -   `timestamp` (number): A data e hora da ação.

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente / modificado, pesso apenas que mostre de onde vem o projeto original.🤍
