import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts"],
    hookTimeout: 120000,
    testTimeout: 60000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/routes/admin/collections.routes.ts",
        "src/routes/admin/audit.routes.ts",
        "src/models/AdminConfig.ts",
        "src/models/AuditLog.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 50,
        statements: 80,
      },
    },
  },
});
