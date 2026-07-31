# Smart Task - Project Rules

## 1. Tổng quan dự án

- **Tên**: Smart Task
- **Loại**: REST API Backend
- **Framework**: NestJS v11
- **Ngôn ngữ**: TypeScript (target ES2023)
- **Database**: MySQL (via TypeORM)
- **Authentication**: JWT (RSA256 key-pair) + OTP via Twilio
- **API Docs**: Swagger (tự động generate qua `@nestjs/swagger` plugin)
- **Package Manager**: Yarn
- **Port mặc định**: 3003

---

## 2. Cấu trúc thư mục

```
src/
├── main.ts                          # Entry point, bootstrap Swagger
├── app.module.ts                    # Root module
├── app.controller.ts                # Root controller
├── app.service.ts                   # Root service
│
├── common/                          # Shared / cross-cutting concerns
│   ├── config/
│   │   ├── configuration.ts         # App config (port, twilio...)
│   │   └── ormconfig.ts             # TypeORM DataSource config
│   ├── constants/
│   │   ├── enum.ts                  # Enums: Role, TaskStatus
│   │   └── message.ts              # Message constants (i18n keys)
│   ├── decorators/
│   │   ├── jwt-auth.decorator.ts    # @JwtAuth() decorator
│   │   └── role.decorator.ts        # @Roles() decorator
│   ├── guards/
│   │   └── jwt-auth.guard.ts        # JwtAuthGuard (CanActivate)
│   └── types/
│       ├── pagination.ts            # Pagination & PaginationResponse<T>
│       └── response.ts             # MessageResponse class
│
├── database/
│   ├── entities/                    # TypeORM entities
│   │   ├── user.entity.ts
│   │   ├── task.entity.ts
│   │   ├── token.entity.ts
│   │   └── tag.entity.ts
│   └── migrations/                  # TypeORM migrations
│       ├── 1785117767097-task-table.ts
│
│
├── helper/                          # Helper services (standalone)
│   ├── bcrypt.helper.ts             # PasswordService
│   ├── crypto.helper.ts             # generateKeyOfToken (RSA key-pair)
│   └── twilio.helper.ts             # TwilioService (send/verify OTP)
│
├── modules/                         # Feature modules
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── verify-otp.dto.ts
│   │   └── types/
│   │       └── login.type.ts
│   ├── tasks/
│   │   ├── task.module.ts
│   │   ├── task.controller.ts
│   │   ├── task.service.ts
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── updatee-task.dto.ts
│   │   └── types/
│   │       └── task-res.type.ts
│   ├── tags/
│   │   ├── tag.module.ts
│   │   ├── tag.controller.ts
│   │   ├── tag.service.ts
│   │   ├── dto/
│   │   │   └── create-tag.dto.ts
│   │   └── types/
│   │       └── tag.type.ts
│   ├── tokens/
│   │   ├── token.module.ts
│   │   ├── token.controller.ts
│   │   ├── token.service.ts
│   │   ├── dto/
│   │   │   └── token-payload.dto.ts
│   │   └── types/
│   │       ├── token.type.ts
│   │       └── token-data.type.ts
│   └── users/
│       ├── user.module.ts
│       ├── user.controller.ts
│       ├── user.service.ts
│       └── types/
│           └── user.type.ts
│
└── utils/
    └── functions.ts                 # generateUUID, generateTimestamp, generateUserId
```

---

## 3. Quy tắc đặt tên (Naming Conventions)

### 3.1. Files

| Loại          | Pattern                                          | Ví dụ                         |
| ------------- | ------------------------------------------------ | ----------------------------- |
| Module        | `<feature>.module.ts`                            | `task.module.ts`              |
| Controller    | `<feature>.controller.ts`                        | `task.controller.ts`          |
| Service       | `<feature>.service.ts`                           | `task.service.ts`             |
| Entity        | `<feature>.entity.ts`                            | `task.entity.ts`              |
| DTO           | `<action>-<feature>.dto.ts`                      | `create-task.dto.ts`          |
| Response Type | `<feature>-res.type.ts` hoặc `<feature>.type.ts` | `task-res.type.ts`            |
| Helper        | `<library>.helper.ts`                            | `bcrypt.helper.ts`            |
| Migration     | `<timestamp>-<description>.ts`                   | `1785117767097-task-table.ts` |

### 3.2. Classes

| Loại          | Pattern                 | Ví dụ              |
| ------------- | ----------------------- | ------------------ |
| Module        | `<Feature>Module`       | `TaskModule`       |
| Controller    | `<Feature>Controller`   | `TaskController`   |
| Service       | `<Feature>Service`      | `TaskService`      |
| Entity        | `<Feature>Entity`       | `TaskEntity`       |
| DTO           | `<Action><Feature>Dto`  | `CreateTaskDto`    |
| Response Type | `<Feature>Response`     | `TaskResponse`     |
| List Response | `<Feature>ListResponse` | `TaskListResponse` |
| Guard         | `<Name>Guard`           | `JwtAuthGuard`     |

### 3.3. Database

- **Tên bảng**: singular, lowercase → `user`, `task`, `token`, `tag`
- **Tên cột**: `snake_case` → `user_id`, `start_at`, `created_at`, `smart_score`
- **Primary Key**: `id` (UUID string, 36 chars)
- **Foreign Key column**: `<referenced_table>_id` → `user_id`, `parent_id`
- **Timestamp columns**: `created_at`, `updated_at`, `deleted_at`

### 3.4. Variables & Properties

- **Entity properties**: `snake_case` cho các field mapping trực tiếp với DB (`user_id`, `start_at`)
- **DTO properties**: Đồng nhất với entity (`snake_case` cho DB fields)
- **Service/Controller**: `camelCase` cho logic code
- **Constants**: `UPPER_SNAKE_CASE` → `MESSAGE.TASK_CREATED`, `TaskStatus.IN_PROGRESS`
- **Enum values**: `UPPER_SNAKE_CASE` cho key, `snake_case` cho value string

---

## 4. Quy tắc kiến trúc (Architecture Rules)

### 4.1. Module Pattern

Mỗi feature module tuân theo cấu trúc:

```
modules/<feature>/
├── <feature>.module.ts       # NestJS Module definition
├── <feature>.controller.ts   # HTTP route handlers
├── <feature>.service.ts      # Business logic
├── dto/                      # Data Transfer Objects (input validation)
│   ├── create-<feature>.dto.ts
│   └── update-<feature>.dto.ts
└── types/                    # Response types (output format)
    └── <feature>.type.ts
```

### 4.2. Dependency Flow

```
Controller → Service → Repository (TypeORM)
                     → Other Services (via DI)
                     → Helpers (via DI)
```

- **Controller**: Chỉ xử lý HTTP request/response, delegate logic cho Service.
- **Service**: Chứa business logic, inject Repository và các service khác.
- **Entity**: Chỉ define schema, không chứa business logic.
- **Guard**: Xử lý authentication/authorization, inject TokenService + UserService.

### 4.3. Module Dependencies

- Module cần sử dụng service từ module khác **phải import module đó** (không import trực tiếp service).
- Service cần shared phải được **exports** từ module gốc.
- `TokenModule` và `UserModule` được share rộng rãi (Auth, Task, Guard đều dùng).

---

## 5. Quy tắc Authentication & Authorization

### 5.1. JWT Flow

- Sử dụng **RSA256 key-pair** (2048-bit) — mỗi token session sinh cặp key riêng.
- Access Token: expire `1d`, Refresh Token: expire `7d`, Verify Token: expire `15m`.
- Token payload chứa: `{ userId, phone, tokenId }`.
- Public key được lưu trong DB (`token` table) để verify.

### 5.2. Guards & Decorators

- **`@JwtAuth()`**: Composite decorator = `UseGuards(JwtAuthGuard)`. Dùng ở controller level hoặc method level.
- **`@Roles('admin')`**: Set metadata `roles`, được kiểm tra trong `JwtAuthGuard`.
- **`@ApiBearerAuth()`**: Khai báo Swagger cần Bearer token.
- User đã authenticate được gắn vào `request['userLogged']`.

### 5.3. Protected Routes

- Sử dụng `@JwtAuth()` ở class level cho toàn bộ controller (như `TaskController`).
- Lấy user hiện tại qua `req.userLogged.id`.

---

## 6. Quy tắc API Response

### 6.1. Success Response

- **Mutation operations** (create, update, delete): Trả về `MessageResponse`:
  ```typescript
  { statusCode: HttpStatus, message: string }
  ```
- **Query operations** (get list): Trả về `PaginationResponse<T>`:
  ```typescript
  { items: T[], total: number }
  ```
- **Query operations** (get single): Trả về entity/type trực tiếp.
- **Login**: Trả về `{ accessToken, refreshToken }`.

### 6.2. Error Handling

- Sử dụng NestJS built-in exceptions: `NotFoundException`, `UnauthorizedException`, `ForbiddenException`, `BadRequestException`.
- Tất cả error message dùng constant từ `MESSAGE` object (không hardcode string).
- Pattern: `try { ... } catch (error) { throw error; }` (re-throw để NestJS global handler xử lý).

### 6.3. Message Constants

- Format key: `UPPER_SNAKE_CASE` — `MESSAGE.TASK_CREATED`
- Format value: `<domain>.<action>` — `'task.task_created'`
- Các message được group theo domain: `auth.*`, `token.*`, `otp.*`, `user.*`, `task.*`, `tag.*`

---

## 7. Quy tắc Database & Entity

### 7.1. Entity Decorators

- `@Entity('<table_name>')` — tên bảng singular, lowercase.
- `@PrimaryGeneratedColumn('uuid')` — dùng UUID auto-generated (trừ `UserEntity` dùng `@PrimaryColumn()` với custom ID).
- `@Column({ type, length, nullable, default })` — luôn khai báo rõ type.
- Timestamp: dùng `@CreateDateColumn`, `@UpdateDateColumn`, `@DeleteDateColumn` (cho soft delete).

### 7.2. Relationships

- `@ManyToOne` / `@OneToMany` — dùng cho self-referencing (Task → sub_tasks).
- `@JoinColumn({ name: 'column_name' })` — chỉ định FK column.

### 7.3. TypeORM Config

- `synchronize: false` — **KHÔNG** dùng auto-sync, phải dùng migrations.
- Database: MySQL.
- Entity glob: `../../database/entities/*.entity{.ts,.js}`.
- Migration glob: `../../database/migrations/*{.ts,.js}`.

### 7.4. Migration Commands

```bash
# Tạo migration mới
yarn migrate:create <path>

# Chạy migration
yarn migrate:up

# Rollback migration
yarn migrate:down
```

---

## 8. Quy tắc DTO & Validation

### 8.1. Validation

- Sử dụng `@nestjs/class-validator` (không dùng `class-validator` trực tiếp).
- Các decorator phổ biến: `@IsNotEmpty()`, `@IsPhoneNumber('VN')`.
- DTO phải có `@ApiProperty()` cho Swagger documentation.

### 8.2. DTO Structure

- **Create DTO**: Chứa các field bắt buộc + optional.
- **Update DTO**: Tách riêng file, có thể dùng lại Create DTO.
- **Status DTO**: Riêng cho update trạng thái (`UpdateTaskStatusDto`).
- Optional fields dùng `?` và `@ApiProperty({ required: false })`.

---

## 9. Quy tắc Swagger

- Mỗi controller phải có `@ApiTags('<Tag>')`.
- Mỗi endpoint phải có `@ApiOperation({ summary })`.
- Mỗi endpoint phải có `@ApiResponse({ status, description })` cho các case: success, not found, unauthorized, bad request.
- Protected endpoints phải có `@ApiBearerAuth()`.
- Swagger UI: truy cập tại `/api`.
- Swagger plugin được enable trong `nest-cli.json`.

---

## 10. Quy tắc Code Style

### 10.1. Prettier

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

### 10.2. ESLint

- Parser: `@typescript-eslint/parser`
- Extends: `@typescript-eslint/recommended` + `prettier/recommended`
- Các rule **TẮT**:
  - `@typescript-eslint/interface-name-prefix`
  - `@typescript-eslint/explicit-function-return-type`
  - `@typescript-eslint/explicit-module-boundary-types`
  - `@typescript-eslint/no-explicit-any`

### 10.3. TypeScript

- `strictNullChecks: true`
- `noImplicitAny: false` (cho phép implicit any)
- `experimentalDecorators: true` + `emitDecoratorMetadata: true`
- Module system: `nodenext`
- `skipLibCheck: true`

---

## 11. Quy tắc Import

- **Absolute imports** từ `src/`: `import { X } from 'src/common/...'`, `import { X } from 'src/database/...'`
- **Relative imports** trong cùng module: `import { X } from './...'`, `import { X } from '../...'`
- Import `@nestjs/swagger` decorators:
  - Một số nơi import trực tiếp từ `node_modules/` path (ví dụ: `node_modules/@nestjs/swagger/dist/decorators/api-operation.decorator`) — **cần thống nhất về dùng `@nestjs/swagger`**.

---

## 12. Quy tắc Helper & Utils

### 12.1. Helper (`src/helper/`)

- Là **Injectable services** (`@Injectable()`).
- Wrap các thư viện bên ngoài: `bcrypt`, `crypto`, `twilio`.
- Được provide trong module cần sử dụng.

### 12.2. Utils (`src/utils/`)

- Là **pure functions** (không dùng DI).
- Không có decorator `@Injectable()`.
- Export trực tiếp function: `export const generateUUID = () => {...}`.

---

## 13. Quy tắc Environment Variables

```env
# App
PORT=3003

# Database
DB_USERNAME=root
DB_PASSWORD=<password>
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_task

# Twilio
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_PHONE_NUMBER=<phone>
TWILIO_VERIFY_SERVICE_SID=<service_sid>
```

- Config được load qua `ConfigModule.forRoot()` với `isGlobal: true`.
- Access config qua `ConfigService.get<string>('twilio.accountSid')` (nested key).
- File `.env` nằm ở root, **KHÔNG** commit lên git (đã có trong `.gitignore`).

---

## 14. Quy tắc Response Type

- Response type dùng `class` (không dùng `interface`).
- Sử dụng `@Expose()` decorator từ `class-transformer` cho serialization.
- List response kế thừa `PaginationResponse<T>`.

---

## 15. Quy tắc chung khi thêm feature mới

1. **Tạo Entity** trong `src/database/entities/<feature>.entity.ts`.
2. **Tạo Migration** bằng `yarn migrate:create`.
3. **Tạo Module** theo cấu trúc `src/modules/<feature>/`:
   - `<feature>.module.ts` — khai báo imports, controllers, providers, exports.
   - `<feature>.controller.ts` — route handlers với Swagger decorators.
   - `<feature>.service.ts` — business logic, inject Repository.
   - `dto/` — input validation classes.
   - `types/` — response type classes.
4. **Register Module** trong `app.module.ts`.
5. **Thêm Message Constants** trong `src/common/constants/message.ts`.
6. Nếu cần **Enum mới**, thêm vào `src/common/constants/enum.ts`.
7. Nếu route cần **auth**, thêm `@JwtAuth()` + `@ApiBearerAuth()` và import `TokenModule` + `UserModule`.

---

## 16. Scripts

| Command                      | Mô tả                              |
| ---------------------------- | ---------------------------------- |
| `yarn dev`                   | Chạy dev server (watch mode)       |
| `yarn build`                 | Build production                   |
| `yarn start:prod`            | Chạy production (`node dist/main`) |
| `yarn lint`                  | ESLint fix                         |
| `yarn format`                | Prettier format                    |
| `yarn test`                  | Chạy unit tests                    |
| `yarn test:e2e`              | Chạy end-to-end tests              |
| `yarn migrate:create <path>` | Tạo migration mới                  |
| `yarn migrate:up`            | Chạy migrations                    |
| `yarn migrate:down`          | Rollback migration                 |
