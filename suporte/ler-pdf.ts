import { expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

export async function lerTextoDoPdf(caminho: string) {
    const arquivo = await readFile(caminho);
    expect(arquivo.length).toBeGreaterThan(0);
    expect(arquivo.subarray(0, 5).toString()).toBe('%PDF-');

    const leitor = new PDFParse({ data: new Uint8Array(arquivo) });
    try {
        const resultado = await leitor.getText();
        // Remove as quebras de linha para comparar os textos do comprovante.
        return resultado.text.replace(/\s+/g, ' ');
    } finally {
        await leitor.destroy();
    }
}
