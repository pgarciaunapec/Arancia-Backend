# Admin Module Implementation (Backend)

## Scope
This document describes backend implementation for the Admin Module defined in `docs/ADMIN_MODULE_SPEC.md`.

## Implemented Features
- Generic secured admin endpoints under `/api/admin/collections/*`.
- Extended `AdminConfig` model with:
  - dynamic field metadata (`required`, `validators`, `enumOptions`, `reference`),
  - list defaults,
  - role permissions.
- New `AuditLog` model (`audit_logs`) with indexed fields for collection, doc and timestamp.
- CRUD with server-side validation and `editable` enforcement.
- Bulk operations:
  - `POST /api/admin/collections/:collection/bulk` (`update`, `delete`).
- Import:
  - `POST /api/admin/collections/:collection/import` (`csv`/`json`, `mapping`, `onConflict`).
- Export:
  - `GET /api/admin/collections/:collection/export?format=csv|json`.
- File upload:
  - `POST /api/admin/collections/:collection/:id/assets`.
- Audit query endpoint:
  - `GET /api/admin/audit`.
- Referential integrity checks on delete with optional `cascade=true`.
- Rate limiting for heavy admin endpoints.

## Security and Validation
- All admin collection and audit routes are protected by:
  - `authMiddleware`
  - `requireRole(["admin"])`
- Payload validation is generated from `AdminConfig` server-side.
- Protected fields (`_id`, `__v`, `createdAt`, `updatedAt`) are never writable.
- File upload restrictions:
  - MIME allow-list,
  - max size (5MB),
  - safe file names.

## Files Added/Updated
- `src/models/AdminConfig.ts`
- `src/models/AuditLog.ts`
- `src/services/admin.collections.service.ts`
- `src/controllers/admin.collections.controller.ts`
- `src/routes/admin/collections.routes.ts`
- `src/routes/admin/audit.routes.ts`
- `src/server.ts`
- `src/models/index.ts`

## Testing
### Unit
- `src/services/admin.collections.service.test.ts`
- `src/models/AdminConfig.test.ts`

### Integration
- `src/routes/admin.collections.routes.test.ts`
  - auth
  - CRUD
  - audit
  - import/export
  - bulk
  - upload

## Run Locally
```bash
cd Arancia-Backend
pnpm install
pnpm exec tsc --noEmit
npx vitest run --reporter verbose
npx vitest run --coverage
```

## CI Example
```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm test
pnpm test:coverage
```

## Coverage Gate
Configured in `vitest.config.ts` for critical backend admin module boundaries.

Current command:
```bash
npx vitest run --coverage
```

## Notes and Trade-offs
- Import currently runs in-request and returns immediate summary; the spec suggests background jobs for large files. This is kept as MVP behavior.
- Referential integrity is driven by `AdminConfig.reference` definitions. Collections without reference metadata cannot be automatically validated for inverse relationships.
- Upload storage is local (`uploads/admin`) for MVP; S3/MinIO can be introduced behind the same endpoint contract.
