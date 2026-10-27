import { expect, Page } from '@playwright/test';
import { catalogoAZ } from '../suporte/dados-teste';

export class ProdutosPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async conferirCatalogoInicial() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(this.page.getByTestId('title')).toHaveText('Products');
        await expect(this.page.getByTestId('inventory-item-name')).toHaveText(catalogoAZ);
        await expect(this.page.getByTestId('product-sort-container')).toHaveValue('az');
        await expect(this.page.getByTestId('error')).toHaveCount(0);
    }

    async adicionarProduto(nome: string) {
        const produto = this.page.getByTestId('inventory-item').filter({ hasText: nome });
        const adicionarButton = produto.getByRole('button', { name: 'Add to cart', exact: true });
        await adicionarButton.click();
    }

    async abrirDetalhes(nome: string) {
        const produto = this.page.getByTestId('inventory-item').filter({ hasText: nome });
        await produto.getByTestId('inventory-item-name').click();
    }

    async abrirCarrinho() {
        await this.page.getByTestId('shopping-cart-link').click();
    }
}
