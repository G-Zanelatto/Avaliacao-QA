import type { Page, TestInfo } from '@playwright/test';

// Guarda a mensagem antes de corrigi-la: o screenshot final não mostraria esse erro.
export async function registrarEvidencia(page: Page, testInfo: TestInfo, nome: string) {
    const caminho = testInfo.outputPath(`${nome}.png`);
    await page.screenshot({ path: caminho, fullPage: true, timeout: 30_000 });
    await testInfo.attach(nome, { path: caminho, contentType: 'image/png' });
}
