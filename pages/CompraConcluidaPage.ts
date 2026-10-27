import { expect, Page } from '@playwright/test';

export class CompraConcluidaPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async conferirConclusao() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        await expect(this.page.getByTestId('title')).toHaveText('Checkout: Complete!');
        await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
        await expect(this.page.getByTestId('complete-text')).toHaveText(
            'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
        );
        await expect(this.page.getByTestId('back-to-products')).toBeVisible();
        await expect(this.page.getByTestId('generate-pdf-order')).toBeVisible();
        await expect(this.page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    }

    async voltarParaProdutos() {
        await this.page.getByTestId('back-to-products').click();
    }

    async baixarComprovante(caminho: string) {
        try {
            // Começa a esperar o download antes de clicar no botão.
            const aguardarDownload = this.page.waitForEvent('download');
            await this.page.getByTestId('generate-pdf-order').click();
            const download = await aguardarDownload;
            await download.saveAs(caminho);
            await expect(this.page.getByTestId('generate-pdf-order')).toHaveText('Generate PDF order');
            await expect(this.page.getByTestId('generate-pdf-order')).toBeEnabled();
            return download.suggestedFilename();
        } catch (erro) {
            throw new Error('Não foi possível baixar o comprovante do pedido.', { cause: erro });
        }
    }
}
