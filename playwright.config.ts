import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: true,
  // Repete uma vez; se precisar da repetição, isso aparece no relatório.
  retries: 1,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  outputDir: './evidencias/ultima-execucao',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: './evidencias/resultados.json' }],
  ],
  use: {
    baseURL: 'https://www.saucedemo.com/',
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: { mode: 'on', fullPage: true },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    acceptDownloads: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
