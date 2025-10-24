## Aionz API
API REST desenvolvida com NestJS, TypeScript, Prisma e PostgreSQL.

### Como rodar o projeto

### 1. Instalar dependências
npm install

### 2. Configurar variáveis de ambiente
Crie o arquivo .env baseado no .env.example

### 3. Iniciar o banco de dados
docker-compose up -d

### 4. Gerar o Prisma Client e rodar migrations
npx prisma generate
npx prisma migrate dev

### 5. Iniciar a aplicação
npm run dev

API: http://localhost:3333
Swagger: http://localhost:3333/api
