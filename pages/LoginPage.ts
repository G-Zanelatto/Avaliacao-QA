import { expect, Page } from '@playwright/test';
import { senhaPadrao, usuarioPadrao } from '../suporte/dados-teste';

export class LoginPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async abrir() {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(this.page.getByTestId('username')).toBeVisible();
    }

    async entrar(usuario = usuarioPadrao, senha = senhaPadrao) {
        await this.page.getByTestId('username').fill(usuario);
        await this.page.getByTestId('password').fill(senha);
        await this.page.getByTestId('login-button').click();
    }
}
