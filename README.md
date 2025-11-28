# Loja de Veículos

Aplicação web para venda de veículos com autenticação JWT e painel admin.

## Tecnologias

**Backend:**
- Java 21
- Spring Boot 3.2.12
- Spring Security com JWT
- Hibernate 6.4
- PostgreSQL

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios

**Infraestrutura:**
- Docker & Docker Compose
- pgAdmin (gerenciamento BD)

## Como Buildar e Rodar

### 1. Pré-requisitos
- Docker e Docker Compose instalados

### 2. Iniciar serviços (recomendado)

```bash
docker compose up -d
```

Isso sobe:
- **Backend** em http://localhost:8080
- **PostgreSQL** em localhost:5432
- **pgAdmin** em http://localhost:5050

### 3. Backend (alternativa local com Maven/Java 21)

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

**Variáveis de ambiente opcionais:**
- `APP_JWT_SECRET`: Segredo JWT (padrão: valor de teste em `application.yml`)
- `SPRING_DATASOURCE_URL`: URL do BD (padrão: `jdbc:postgresql://localhost:5432/veiculos`)
- `SPRING_DATASOURCE_USERNAME`: Usuário BD (padrão: `postgres`)
- `SPRING_DATASOURCE_PASSWORD`: Senha BD (padrão: `postgres`)

### 4. Frontend (local com Node.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend fica disponível em http://localhost:5173 (ou próxima porta disponível).

## Estrutura do Projeto

```
.
├── backend/                    # Java Spring Boot
│   ├── src/main/java/com/example/
│   │   ├── security/          # JWT, Security Config, CORS
│   │   └── vehicles/          # Controllers, Services, Entities
│   └── pom.xml
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── pages/             # Home, Login, Register, NewVehicle, EditVehicle
│   │   ├── components/        # Navbar, Footer, VehicleCard
│   │   ├── auth/              # AuthContext, ProtectedRoute
│   │   └── api/               # Axios instance com interceptor JWT
│   └── package.json
├── docker-compose.yml
└── .gitignore
```

## Funcionalidades

- ✅ Registro e login com JWT
- ✅ Listagem pública de veículos
- ✅ Upload de múltiplas imagens por veículo
- ✅ Edição e exclusão de veículos (admin only)
- ✅ Substituição de imagens ao editar
- ✅ CORS configurado para localhost:5173/5174
- ✅ Autenticação em todas as requisições (interceptor Axios)

## Endpoints Principais

**Auth:**
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login e obter token JWT

**Veículos (públicos):**
- `GET /api/vehicles` - Listar veículos (paginado)
- `GET /api/vehicles/{id}` - Detalhes de um veículo
- `GET /files/{vehicleId}/{filename}` - Download de imagem

**Admin:**
- `POST /api/admin/vehicles` - Criar veículo com imagens
- `PUT /api/admin/vehicles/{id}?replace=true` - Editar e substituir imagens
- `DELETE /api/admin/vehicles/{id}` - Deletar veículo

## Notas

- Usuários são criados como `ROLE_USER` por padrão
- Promote para `ROLE_ADMIN` via endpoint `PUT /api/admin/users/{id}/promote` ou direto no BD
- Token JWT válido por 24h (configurável em `app.jwt.expiration-ms`)
- Imagens são salvas em `/app/uploads` (ou valor de `VEHICLE_UPLOAD_DIR`)
