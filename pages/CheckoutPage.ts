import { expect, Page } from '@playwright/test';

export class CheckoutPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async conferirFormulario(quantidadeItens: number) {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        await expect(this.page.getByTestId('title')).toHaveText('Checkout: Your Information');

        await expect(this.page.getByTestId('firstName')).toBeVisible();
        await expect(this.page.getByTestId('lastName')).toBeVisible();
        await expect(this.page.getByTestId('postalCode')).toBeVisible();
        await expect(this.page.getByTestId('firstName')).toHaveValue('');
        await expect(this.page.getByTestId('lastName')).toHaveValue('');
        await expect(this.page.getByTestId('postalCode')).toHaveValue('');

        await expect(this.page.getByTestId('cancel')).toBeVisible();
        await expect(this.page.getByTestId('continue')).toBeVisible();
        await expect(this.page.getByTestId('shopping-cart-badge')).toHaveText(String(quantidadeItens));
    }

    async preencherDados(primeiroNome: string, sobrenome: string, codigoPostal: string) {
        await this.page.getByTestId('firstName').fill(primeiroNome);
        await this.page.getByTestId('lastName').fill(sobrenome);
        await this.page.getByTestId('postalCode').fill(codigoPostal);
    }

    async continuar() {
        await this.page.getByTestId('continue').click();
    }

    async cancelar() {
        await this.page.getByTestId('cancel').click();
    }

    async conferirErro(mensagem: string) {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        await expect(this.page.getByTestId('error')).toHaveText(mensagem);
        await expect(this.page.getByTestId('shopping-cart-badge')).toHaveText('1');
        await expect(this.page.getByTestId('checkout-summary-container')).toHaveCount(0);
    }
}
