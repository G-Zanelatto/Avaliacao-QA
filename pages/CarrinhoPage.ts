import { expect, Page } from '@playwright/test';

export class CarrinhoPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async conferirCarrinho(quantidade: number) {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
        await expect(this.page.getByTestId('title')).toHaveText('Your Cart');
        await expect(this.page.getByTestId('inventory-item')).toHaveCount(quantidade);
    }

    async conferirProduto(nome: string, preco: string) {
        const produto = this.page.getByTestId('inventory-item').filter({ hasText: nome });
        await expect(produto).toHaveCount(1);
        await expect(produto.getByTestId('inventory-item-name')).toHaveText(nome);
        await expect(produto.getByTestId('inventory-item-price')).toHaveText(preco);
        await expect(produto.getByTestId('item-quantity')).toHaveText('1');
    }

    async iniciarCheckout() {
        await this.page.getByTestId('checkout').click();
    }
}
