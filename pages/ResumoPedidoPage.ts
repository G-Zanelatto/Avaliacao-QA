import { expect, Page } from '@playwright/test';

export class ResumoPedidoPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async conferirResumo(quantidadeItens: number) {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        await expect(this.page.getByTestId('title')).toHaveText('Checkout: Overview');
        await expect(this.page.getByTestId('inventory-item')).toHaveCount(quantidadeItens);
        await expect(this.page.getByTestId('shopping-cart-badge')).toHaveText(String(quantidadeItens));
        await expect(this.page.getByTestId('payment-info-label')).toHaveText('Payment Information:');
        await expect(this.page.getByTestId('shipping-info-label')).toHaveText('Shipping Information:');
        await expect(this.page.getByTestId('cancel')).toBeVisible();
        await expect(this.page.getByTestId('finish')).toBeVisible();
        await expect(this.page.getByTestId('error')).toHaveCount(0);
    }

    async conferirProduto(nome: string, preco: string) {
        const produto = this.page.getByTestId('inventory-item').filter({ hasText: nome });
        await expect(produto).toHaveCount(1);
        await expect(produto.getByTestId('inventory-item-name')).toHaveText(nome);
        await expect(produto.getByTestId('inventory-item-price')).toHaveText(preco);
        await expect(produto.getByTestId('item-quantity')).toHaveText('1');
    }

    async conferirValores(subtotal: string, imposto: string, total: string) {
        await expect(this.page.getByTestId('subtotal-label')).toHaveText('Item total: ' + subtotal);
        await expect(this.page.getByTestId('tax-label')).toHaveText('Tax: ' + imposto);
        await expect(this.page.getByTestId('total-label')).toHaveText('Total: ' + total);
    }

    async finalizarCompra() {
        await this.page.getByTestId('finish').click();
    }
}
