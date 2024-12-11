executado com o seguinte comando:
npx dotenv-cli -e .env.development -- nest start --watch

alguns comandos usados:
npm i --save @nestjs/platform-fastify
nest g module shared/infrastructure/env-config
nest g resource users
npm install -D @faker-js/faker
npm install @nestjs/config
npm install uuid
npm install -D @types/uuid
npm install class-validator
npm install bcryptjs
npm install -D @types/bcryptjs
npm install prisma -D
npm install @prisma/client
nest g module shared/infrastructure/database (no powershell)
npx prisma generate --schema .\src\shared\infrastructure\database\prisma\schema.prisma
npm install dotenv-cli
npx dotenv-cli -e .env.development -- npx prisma migrate dev --schema .\src\shared\infrastructure\database\prisma\schema.prisma
nest g interceptor shared/infrastructure/interceptors/wrapper-data (no powershell)
nest g filter shared/infrastructure/exception-filters/conflict-error
npm install --save @nestjs/jwt

executando nest no Powershell:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
