## Back-end

API REST desenvolvida com NestJS, TypeScript, Prisma e PostgreSQL.

### Como rodar

1. Instalar dependências  
   ```bash
   npm install
   ```

2. Configurar variáveis de ambiente  
   Crie o arquivo `.env` com base no `.env.example`.

3. Iniciar o banco de dados  
   ```bash
   docker-compose up -d
   ```

4. Gerar o Prisma Client e executar as migrations  
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Iniciar a aplicação  
   ```bash
   npm run dev
   ```

- API: http://localhost:3333  
- Documentação (Swagger): http://localhost:3333/api

---

## Front-end

Aplicação desenvolvida com Angular.

### Como rodar

1. Na raiz do projeto front-end, instalar dependências:  
   ```bash
   npm install
   ```

2. Verificar se a `apiUrl` em `src/environments/environment.ts` aponta para a URL correta da API.

3. Iniciar o servidor de desenvolvimento:  
   ```bash
   ng serve
   ```
