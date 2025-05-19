# 🌤️ Weather App

**Weather App** é uma aplicação web full-stack que oferece uma experiência personalizada de consulta climática, com recursos avançados como previsão estendida, qualidade do ar, alertas meteorológicos e histórico de buscas.

Este é um **monorepo** estruturado com:

- 🧠 **Backend**: [NestJS](https://nestjs.com/) + Prisma + PostgreSQL + Redis (caching)
- 🎨 **Frontend**: [React](https://react.dev/) + Vite + TailwindCSS + Shadcn/ui + React Router DOM
- ☁️ **APIs externas**: Integração com [OpenWeatherMap](https://openweathermap.org/) para dados climáticos

## 📁 Estrutura do projeto

```
weather-app/
├── server/               # API NestJS (autenticação, clima, histórico etc)
├── frontend/             # Interface React (Vite + Tailwind)
├── docker-compose.yml    # Orquestra serviços como banco de dados e Redis
├── .env*                 # Arquivos de variáveis de ambiente
```

## 🔧 Funcionalidades principais

- ✅ **Autenticação** com JWT (registro, login, logout, redefinição de senha)
- 📍 **Busca de clima por cidade ou coordenadas**
- 📊 **Previsão estendida (7 dias)**
- 💨 **Qualidade do ar por cidade**
- 🚨 **Sistema próprio de alertas climáticos (temperatura, vento, chuva, tempestade)**
- ❤️ **Gerenciamento de cidades favoritas**
- 🕒 **Histórico de buscas climáticas com paginação**
- 🧾 **Documentação completa via Swagger**

## ⚙️ Tecnologias utilizadas

| Camada       | Tecnologias                                             |
| ------------ | --------------------------------------------------------|
| **Frontend** | Vite, React, TailwindCSS, Shadcn/ui, Axios, React Router|
| **Backend**  | NestJS, Prisma, PostgreSQL, Redis, JWT, Bcrypt          |
| **Infra**    | Docker, docker-compose, Swagger, ESLint/Prettier        |

## 🧪 Como rodar o projeto localmente

### Pré-requisitos

- Node.js `v18+`
- Docker & Docker Compose
- npm

### 1. Clone o repositório

```bash
git clone https://github.com/RoberdanSantos/Weather-App
cd weather-app
```

### 2. Suba os serviços de infraestrutura

```bash
docker-compose up -d
```

> Isso iniciará o banco PostgreSQL e o Redis.

### 3. Configure variáveis de ambiente

Crie os arquivos `.env` em:

- `/server/.env`
- `/frontend/.env`

Exemplo de `.env` para o server:

```env
# OpenWeather API Key
WEATHER_API_KEY=your_openweather_api_key

# JWT secret para autenticação
JWT_SECRET=your_jwt_secret_key

# URL completa para conexão com o banco via Prisma
DATABASE_URL=postgresql://<db_user>:<db_password>@<db_host>:<db_port>/<db_name>

# Configurações de acesso direto ao PostgreSQL (usado em docker-compose ou testes)
POSTGRES_USER=<db_user>
POSTGRES_PASSWORD=<db_password>
POSTGRES_DB=<db_name>

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

Exemplo de `.env` para o frontend:

```env
# URL da API backend
VITE_API_ENDPOINT=http://localhost:3000
```

### 4. Inicialize o banco

```bash
cd backend
npx prisma migrate dev
```

### 5. Rode o server

```bash
cd server
npm run start:dev
```

Acesse a [documentação Swagger](http://localhost:3000/doc)

### 6. Rode o frontend

```bash
cd frontend
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

## 🛡️ Segurança e boas práticas

- Autenticação com JWT
- Validação de entrada com **class-validator**
- Erros tratados com mensagens no backend
- Caching com Redis para reduzir consumo de API externa

## 🧭 Próximos passos

- [ ] Deploy automatizado com CI/CD
- [ ] Notificações em tempo real
- [ ] Temas claro/escuro e acessibilidade aprimorada
- [ ] Testes E2E completos (Cypress ou Playwright)