import { expect, Page } from '@playwright/test';

export class DetalhesProdutoPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async conferirProduto(nome: string, preco: string) {
        const detalhes = this.page.locator('div.inventory_details');
        // Aguarda os detalhes, pois a URL pode mudar antes do conteúdo.
        await expect(detalhes).toBeVisible();
        await expect(detalhes.getByTestId('inventory-item-name')).toHaveText(nome);
        await expect(detalhes.getByTestId('inventory-item-price')).toHaveText(preco);
    }

    async adicionarAoCarrinho() {
        await this.page.getByTestId('add-to-cart').click();
    }
}
