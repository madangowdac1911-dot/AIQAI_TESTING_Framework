# Project notes

- Stack: TypeScript + Playwright Test + playwright-bdd (Gherkin `.feature` files) + Allure (allure-playwright). Target app: ParaBank.
- Config: `playwright.config.ts`. It auto-runs `bddgen` (feature -> `.features-gen/` specs), so plain `npx playwright test` works.
- Steps use `Given/When/Then` from `fixtures/fixtures.ts` (fixtures: `loginPage`, `registerPage`, `accountsPage`, `testData`). One-time user setup is in `support/global-setup.ts`.
- Typecheck: `npm run typecheck`
- Run all: `npx playwright test` | headed: `npx playwright test --headed` | parallel: `npm run test:parallel`
- One feature: `npx playwright test login --headed` (filename regex) ; tags: `npx playwright test --grep @smoke`
- Report: `npm run report` (Allure 2 CLI, needs Java). `npm test` cleans `reports/` first; `npx playwright test` does not.
- Window size: headed chromium starts maximized (`MAXIMIZE=false` to disable); otherwise `VIEWPORT=1920x1080`.
- Credentials live in `.env` (gitignored); template in `.env.example`.
- ParaBank shows either "The username and password could not be verified." or "An internal error has occurred and has been logged." for invalid logins (varies with demo DB state); the step accepts both.
