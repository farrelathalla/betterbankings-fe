import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure logic tests run fine in the default node environment.
    environment: "node",
    include: ["lib/**/*.test.ts", "lib/**/*.test.tsx"],
  },
});
