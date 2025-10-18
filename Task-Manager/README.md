# 📋 Task Manager

Um gerenciador de tarefas moderno e completo desenvolvido com Node.js, Express e MongoDB. Organize seus projetos e tarefas de forma eficiente com uma interface intuitiva.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## 🚀 Funcionalidades

### Gerenciamento de Projetos
- ✅ Criar, editar e excluir projetos
- 📊 Visualizar lista de todos os projetos
- 🔍 Buscar projetos específicos

### Gerenciamento de Tarefas
- ✅ Criar, editar e excluir tarefas
- 📝 Associar tarefas a projetos
- ✔️ Marcar tarefas como concluídas
- 🔍 Filtrar tarefas por projeto

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MongoDB](https://www.mongodb.com/) (local ou MongoDB Atlas)
- Git (opcional)

## 🛠️ Instalação

### Método 1: Instalação Automática (Windows)

Para Windows, use o launcher automático `launch.bat`:

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/Task-Manager.git
cd Task-Manager
```

2. Execute o launcher:
```bash
launch.bat
```

3. Escolha a opção **1) Primeira Inicialização** no menu

O launcher irá:
- ✅ Verificar Node.js/NPM
- ✅ Instalar dependências automaticamente
- ✅ Abrir MongoDB Atlas para configuração
- ✅ Configurar arquivo `.env`
- ✅ Iniciar o servidor

### Método 2: Instalação Manual

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/Task-Manager.git
cd Task-Manager
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:
```env
port=3030
db=mongodb://127.0.0.1:27017/task_manager
```

Ou para MongoDB Atlas:
```env
port=3030
db=mongodb+srv://usuario:senha@cluster.mongodb.net/task_manager
```

4. Inicie o servidor:
```bash
npm run dev
```

## 🎯 Uso do Launcher (Windows)

O `launch.bat` oferece um menu interativo com as seguintes opções:

```
===============================
  Launcher - Task-Manager
===============================
1) Primeira Inicialização (Setup completo)
2) Verificar ambiente (Node/NPM)
3) Instalar dependências
4) Configurar .env
5) Iniciar servidor (nodemon)
6) Abrir frontend (localhost)
7) Abrir MongoDB (para pegar token)
8) Sair
```

### Comandos via Terminal

Você também pode usar o launcher diretamente via linha de comando:

```bash
launch.bat install    # Instalar dependências
launch.bat setup      # Primeira inicialização completa
launch.bat start      # Iniciar servidor
launch.bat config     # Configurar .env
launch.bat open       # Abrir frontend no navegador
launch.bat mongo      # Abrir MongoDB Atlas
```

## 📁 Estrutura do Projeto

```
Task-Manager/
├── frontend/              # Interface do usuário
│   ├── index.html        # Página principal
│   ├── app.js            # Lógica do frontend
│   └── styles.css        # Estilos CSS
├── src/
│   ├── Functions/        # Lógica de negócio
│   │   ├── Auth/         # Autenticação (futuro)
│   │   ├── Projects/     # CRUD de Projetos
│   │   │   ├── GetProject.js
│   │   │   ├── PostProject.js
│   │   │   ├── PutProject.js
│   │   │   └── DeleteProject.js
│   │   └── Tasks/        # CRUD de Tarefas
│   │       ├── GetTask.js
│   │       ├── PostTask.js
│   │       ├── PutTask.js
│   │       └── DeleteTask.js
│   ├── Routes/           # Rotas da API
│   │   └── route.js
│   ├── Schemas/          # Modelos MongoDB
│   │   ├── ProjectSchema.js
│   │   └── TaskSchema.js
│   └── Utils/            # Utilitários
│       └── utils.js
├── launch.bat            # Launcher automático (Windows)
├── main.js               # Servidor principal
├── package.json          # Dependências do projeto
└── .env                  # Variáveis de ambiente
```

## 🌐 API Endpoints

### Projetos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Listar todos os projetos |
| GET | `/api/projects/:id` | Buscar projeto por ID |
| POST | `/api/projects` | Criar novo projeto |
| PUT | `/api/projects/:id` | Atualizar projeto |
| DELETE | `/api/projects/:id` | Deletar projeto |

### Tarefas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks` | Listar todas as tarefas |
| GET | `/api/tasks/:id` | Buscar tarefa por ID |
| POST | `/api/tasks` | Criar nova tarefa |
| PUT | `/api/tasks/:id` | Atualizar tarefa |
| DELETE | `/api/tasks/:id` | Deletar tarefa |

## 🔧 Scripts Disponíveis

```bash
npm start        # Inicia o servidor em modo produção
npm run dev      # Inicia o servidor com nodemon (desenvolvimento)
```

## 🗄️ Configuração do MongoDB

### MongoDB Local

1. Instale o MongoDB Community Edition
2. Inicie o serviço MongoDB
3. Use a string de conexão: `mongodb://127.0.0.1:27017/task_manager`

### MongoDB Atlas (Cloud)

1. Crie uma conta em [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crie um cluster gratuito
3. Configure o acesso de rede (IP Whitelist)
4. Crie um usuário de banco de dados
5. Copie a string de conexão
6. Substitua `<password>` pela senha do usuário

Exemplo:
```
mongodb+srv://usuario:SUASENHA@cluster.mongodb.net/task_manager?retryWrites=true&w=majority
```

## 🎨 Interface

O frontend está disponível em `http://localhost:3030` (ou na porta configurada no `.env`).

Funcionalidades da interface:
- 📂 Criar e gerenciar projetos
- ✅ Adicionar tarefas aos projetos
- ✔️ Marcar tarefas como concluídas
- 🗑️ Excluir projetos e tarefas
- 📊 Visualização organizada por projetos

## 🐛 Solução de Problemas

### Erro: "package.json não encontrado"
- Certifique-se de estar no diretório correto do projeto
- Execute `launch.bat` da raiz do projeto

### Erro de conexão com MongoDB
- Verifique se o MongoDB está rodando (local)
- Verifique a string de conexão no `.env`
- Para MongoDB Atlas, confirme:
  - IP está na whitelist
  - Senha está correta
  - Cluster está ativo

### Porta já em uso
- Altere a porta no arquivo `.env`
- Ou finalize o processo que está usando a porta

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**Otavio de Quadros Sonnenstrahl**
- GitHub: [@Ort4vi0](https://github.com/Ort4vi0)
- Portfolio: [PORTFOLIO](https://github.com/Ort4vi0/PORTFOLIO)

## 🙏 Agradecimentos

- Node.js e Express pela excelente framework
- MongoDB pela robusta solução de banco de dados
- Comunidade open source

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

**Made with ❤️ and ☕**
