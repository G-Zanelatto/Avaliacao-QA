import { expect, test, Page } from '@playwright/test';
import { platform, release } from 'node:os';
import { LoginPage } from '../pages/LoginPage';
import { ProdutosPage } from '../pages/ProdutosPage';
import { DetalhesProdutoPage } from '../pages/DetalhesProdutoPage';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ResumoPedidoPage } from '../pages/ResumoPedidoPage';
import { CompraConcluidaPage } from '../pages/CompraConcluidaPage';
import { catalogoZA, luminaria, mochila } from '../suporte/dados-teste';
import { registrarEvidencia } from '../suporte/evidencias';
import { lerTextoDoPdf } from '../suporte/ler-pdf';

// O Playwright abre um contexto novo para cada teste: nenhum CT depende do anterior.
test.beforeEach(async ({ page, browser }, testInfo) => {
    testInfo.annotations.push({
        type: 'ambiente',
        description: `${platform()} ${release()}; ${browser.browserType().name()} ${browser.version()}`,
    });
    const login = new LoginPage(page);
    await login.abrir();
});

// Preparação usada nos testes que precisam de uma compra em andamento.
async function entrarNaLoja(page: Page) {
    const login = new LoginPage(page);
    const produtos = new ProdutosPage(page);
    await login.entrar();
    await produtos.conferirCatalogoInicial();
}

async function abrirCheckout(page: Page, quantidadeProdutos = 1) {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);
    const checkout = new CheckoutPage(page);

    await entrarNaLoja(page);
    await produtos.adicionarProduto(mochila.nome);
    if (quantidadeProdutos === 2) {
        await produtos.adicionarProduto(luminaria.nome);
    }

    await produtos.abrirCarrinho();
    await carrinho.conferirCarrinho(quantidadeProdutos);
    await carrinho.conferirProduto(mochila.nome, mochila.preco);
    if (quantidadeProdutos === 2) {
        await carrinho.conferirProduto(luminaria.nome, luminaria.preco);
    }

    await carrinho.iniciarCheckout();
    await checkout.conferirFormulario(quantidadeProdutos);
}

test.describe('Login — BDD-01', () => {
    test('CT-01 — Entrar com uma conta válida pelo botão Login', {
        tag: ['@01', '@positivo', '@alta'],
    }, async ({ page }) => {
        const login = new LoginPage(page);
        const produtos = new ProdutosPage(page);

        await login.entrar('standard_user', 'secret_sauce');

        await produtos.conferirCatalogoInicial();
        await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    });

    test('CT-02 — Entrar após corrigir uma senha inválida', {
        tag: ['@01', '@positivo', '@alta'],
    }, async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const produtos = new ProdutosPage(page);

        await login.entrar('standard_user', 'senha_incorreta');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(page.getByTestId('error')).toHaveText(
            'Epic sadface: Username and password do not match any user in this service',
        );
        await registrarEvidencia(page, testInfo, 'senha-invalida');

        // Corrige apenas a senha, sem preencher novamente o usuário.
        await page.getByTestId('password').fill('secret_sauce');
        await page.getByTestId('login-button').click();

        await produtos.conferirCatalogoInicial();
    });
});

test.describe('Carrinho — BDD-02', () => {
    test('CT-03 — Adicionar uma mochila pelo catálogo', {
        tag: ['@02', '@positivo', '@alta'],
    }, async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const produtos = new ProdutosPage(page);
        const carrinho = new CarrinhoPage(page);
        await login.entrar();
        await produtos.conferirCatalogoInicial();

        await produtos.adicionarProduto(mochila.nome);

        const produto = page.getByTestId('inventory-item').filter({ hasText: mochila.nome });
        const removerButton = produto.getByRole('button', { name: 'Remove', exact: true });
        await expect(removerButton).toBeVisible();
        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
        await registrarEvidencia(page, testInfo, 'mochila-adicionada');
        await produtos.abrirCarrinho();
        await carrinho.conferirCarrinho(1);
        await carrinho.conferirProduto(mochila.nome, mochila.preco);
    });

    test('CT-04 — Adicionar um segundo produto pela tela de detalhes', {
        tag: ['@02', '@positivo', '@alta'],
    }, async ({ page }, testInfo) => {
        const produtos = new ProdutosPage(page);
        const detalhes = new DetalhesProdutoPage(page);
        const carrinho = new CarrinhoPage(page);

        await entrarNaLoja(page);
        await produtos.adicionarProduto(mochila.nome);
        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

        await produtos.abrirDetalhes(luminaria.nome);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=0');
        await detalhes.conferirProduto(luminaria.nome, luminaria.preco);
        await detalhes.adicionarAoCarrinho();

        await expect(page.getByTestId('remove')).toBeVisible();
        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
        await registrarEvidencia(page, testInfo, 'luminaria-adicionada-pelos-detalhes');
        await produtos.abrirCarrinho();
        await carrinho.conferirCarrinho(2);
        await carrinho.conferirProduto(mochila.nome, mochila.preco);
        await carrinho.conferirProduto(luminaria.nome, luminaria.preco);
    });
});

test.describe('Formulário de checkout — BDD-03', () => {
    test('CT-05 — Abrir o checkout com um produto', {
        tag: ['@03', '@positivo', '@alta'],
    }, async ({ page }) => {
        const produtos = new ProdutosPage(page);
        const carrinho = new CarrinhoPage(page);
        const checkout = new CheckoutPage(page);

        await entrarNaLoja(page);
        await produtos.adicionarProduto(mochila.nome);
        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

        await produtos.abrirCarrinho();
        await carrinho.conferirCarrinho(1);
        await carrinho.conferirProduto(mochila.nome, mochila.preco);
        await carrinho.iniciarCheckout();

        await checkout.conferirFormulario(1);
    });

    test('CT-06 — Abrir o checkout com dois produtos e cancelar', {
        tag: ['@03', '@positivo', '@media'],
    }, async ({ page }, testInfo) => {
        const checkout = new CheckoutPage(page);
        const carrinho = new CarrinhoPage(page);

        await abrirCheckout(page, 2);
        await registrarEvidencia(page, testInfo, 'formulario-com-dois-itens');

        await checkout.cancelar();

        await carrinho.conferirCarrinho(2);
        await carrinho.conferirProduto(mochila.nome, mochila.preco);
        await carrinho.conferirProduto(luminaria.nome, luminaria.preco);
        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
    });
});

test.describe('Resumo do pedido — BDD-04', () => {
    test('CT-07 — Avançar para o resumo com um produto e dados completos', {
        tag: ['@04', '@positivo', '@alta'],
    }, async ({ page }) => {
        const checkout = new CheckoutPage(page);
        const resumo = new ResumoPedidoPage(page);

        await abrirCheckout(page);

        await checkout.preencherDados('Ana', 'Silva', '01310-100');
        await checkout.continuar();

        await resumo.conferirResumo(1);
        await resumo.conferirProduto(mochila.nome, mochila.preco);
        await resumo.conferirValores('$29.99', '$2.40', '$32.39');
    });

    test('CT-08 — Conferir o resumo de dois produtos e o arredondamento do imposto', {
        tag: ['@04', '@positivo', '@alta'],
    }, async ({ page }) => {
        const checkout = new CheckoutPage(page);
        const resumo = new ResumoPedidoPage(page);

        await abrirCheckout(page, 2);

        await checkout.preencherDados('Ana', 'Silva', '01310-100');
        await checkout.continuar();

        // Valores esperados da planilha: 29.99 + 9.99 = 39.98; imposto = 3.20.
        await resumo.conferirResumo(2);
        await resumo.conferirProduto(mochila.nome, mochila.preco);
        await resumo.conferirProduto(luminaria.nome, luminaria.preco);
        await resumo.conferirValores('$39.98', '$3.20', '$43.18');
    });
});

test.describe('Conclusão da compra — BDD-05', () => {
    test('CT-09 — Finalizar a compra e voltar ao catálogo com o carrinho vazio', {
        tag: ['@05', '@positivo', '@alta'],
    }, async ({ page }, testInfo) => {
        const checkout = new CheckoutPage(page);
        const resumo = new ResumoPedidoPage(page);
        const conclusao = new CompraConcluidaPage(page);
        const produtos = new ProdutosPage(page);
        const carrinho = new CarrinhoPage(page);

        await abrirCheckout(page);
        await checkout.preencherDados('Ana', 'Silva', '01310-100');
        await checkout.continuar();
        await resumo.conferirResumo(1);
        await resumo.conferirProduto(mochila.nome, mochila.preco);
        await resumo.conferirValores('$29.99', '$2.40', '$32.39');

        await resumo.finalizarCompra();

        await conclusao.conferirConclusao();
        await registrarEvidencia(page, testInfo, 'compra-finalizada');
        await conclusao.voltarParaProdutos();
        await produtos.conferirCatalogoInicial();
        await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
        await produtos.abrirCarrinho();
        await carrinho.conferirCarrinho(0);
    });

    test('CT-10 — Finalizar uma compra com dois produtos e baixar o comprovante PDF', {
        tag: ['@05', '@positivo', '@media'],
    }, async ({ page }, testInfo) => {
        const checkout = new CheckoutPage(page);
        const resumo = new ResumoPedidoPage(page);
        const conclusao = new CompraConcluidaPage(page);

        await abrirCheckout(page, 2);
        await checkout.preencherDados('Ana', 'Silva', '01310-100');
        await checkout.continuar();
        await resumo.conferirResumo(2);
        await resumo.conferirProduto(mochila.nome, mochila.preco);
        await resumo.conferirProduto(luminaria.nome, luminaria.preco);
        await resumo.conferirValores('$39.98', '$3.20', '$43.18');

        await resumo.finalizarCompra();
        await conclusao.conferirConclusao();
        const caminho = testInfo.outputPath('comprovante.pdf');
        const nomeArquivo = await conclusao.baixarComprovante(caminho);

        expect(nomeArquivo).toMatch(/^swag-labs-order-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.pdf$/);
        await testInfo.attach('comprovante-do-pedido', { path: caminho, contentType: 'application/pdf' });

        const texto = await lerTextoDoPdf(caminho);
        expect(texto).toContain(mochila.nome);
        expect(texto).toContain(luminaria.nome);
        expect(texto).toContain(mochila.preco);
        expect(texto).toContain(luminaria.preco);
        expect(texto).toMatch(/Item total\s*\$39\.98/);
        expect(texto).toMatch(/Tax\s*\$3\.20/);
        expect(texto).toMatch(/\bTotal\s*\$43\.18/);
        await expect(page.getByTestId('back-to-products')).toBeVisible();
        await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    });
});

test.describe('Ordenação — BDD-06', () => {
    test('CT-11 — Ordenar os seis produtos por nome de Z a A', {
        tag: ['@06', '@positivo', '@media'],
    }, async ({ page }) => {
        const login = new LoginPage(page);
        const produtos = new ProdutosPage(page);
        await login.entrar();
        await produtos.conferirCatalogoInicial();

        await page.getByTestId('product-sort-container').selectOption('za');

        await expect(page.getByTestId('product-sort-container')).toHaveValue('za');
        await expect(page.getByTestId('inventory-item-name')).toHaveText(catalogoZA);
        await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    });

    test('CT-12 — Trocar a ordenação por preço para Z a A com um item no carrinho', {
        tag: ['@06', '@positivo', '@baixa'],
    }, async ({ page }, testInfo) => {
        const produtos = new ProdutosPage(page);
        const carrinho = new CarrinhoPage(page);

        await entrarNaLoja(page);
        await produtos.adicionarProduto(mochila.nome);
        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

        await page.getByTestId('product-sort-container').selectOption('lohi');
        await expect(page.getByTestId('product-sort-container')).toHaveValue('lohi');
        await page.getByTestId('product-sort-container').selectOption('za');

        await expect(page.getByTestId('product-sort-container')).toHaveValue('za');
        await expect(page.getByTestId('inventory-item-name')).toHaveText(catalogoZA);
        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
        const produto = page.getByTestId('inventory-item').filter({ hasText: mochila.nome });
        await expect(produto.getByRole('button', { name: 'Remove', exact: true })).toBeVisible();
        await registrarEvidencia(page, testInfo, 'ordenacao-za-com-item');
        await produtos.abrirCarrinho();
        await carrinho.conferirCarrinho(1);
        await carrinho.conferirProduto(mochila.nome, mochila.preco);
    });
});

test.describe('Usuário bloqueado — BDD-07', () => {
    test('CT-13 — Impedir o login de uma conta bloqueada', {
        tag: ['@07', '@negativo', '@alta'],
    }, async ({ page }) => {
        const login = new LoginPage(page);

        await login.entrar('locked_out_user', 'secret_sauce');

        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(page.getByTestId('error')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
        await expect(page.getByTestId('login-button')).toBeVisible();
        await expect(page.getByTestId('inventory-item')).toHaveCount(0);
    });

    test('CT-14 — Manter o bloqueio ao tentar abrir o catálogo pela URL', {
        tag: ['@07', '@negativo', '@alta'],
    }, async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        await login.entrar('locked_out_user', 'secret_sauce');
        await expect(page.getByTestId('error')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
        await registrarEvidencia(page, testInfo, 'conta-bloqueada');

        await page.goto('/inventory.html');

        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(page.getByTestId('username')).toBeVisible();
        await expect(page.getByTestId('login-button')).toBeVisible();
        await expect(page.getByTestId('inventory-item')).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Add to cart', exact: true })).toHaveCount(0);
    });
});

test.describe('Primeiro nome obrigatório — BDD-08', () => {
    test('CT-15 — Tentar continuar com o primeiro nome vazio', {
        tag: ['@08', '@negativo', '@alta'],
    }, async ({ page }) => {
        const checkout = new CheckoutPage(page);
        await abrirCheckout(page);

        await checkout.preencherDados('', 'Silva', '01310-100');
        await checkout.continuar();

        await checkout.conferirErro('Error: First Name is required');
        await expect(page.getByTestId('firstName')).toHaveValue('');
        await expect(page.getByTestId('lastName')).toHaveValue('Silva');
        await expect(page.getByTestId('postalCode')).toHaveValue('01310-100');
    });

    test('CT-16 — Enviar o formulário vazio e conferir a primeira validação', {
        tag: ['@08', '@negativo', '@media'],
    }, async ({ page }, testInfo) => {
        const checkout = new CheckoutPage(page);
        await abrirCheckout(page);

        await checkout.continuar();
        await checkout.conferirErro('Error: First Name is required');
        await expect(page.getByTestId('firstName')).toHaveValue('');
        await expect(page.getByTestId('lastName')).toHaveValue('');
        await expect(page.getByTestId('postalCode')).toHaveValue('');
        await registrarEvidencia(page, testInfo, 'primeiro-erro-formulario-vazio');

        await page.getByTestId('firstName').fill('Ana');
        await checkout.continuar();

        await checkout.conferirErro('Error: Last Name is required');
        await expect(page.getByTestId('firstName')).toHaveValue('Ana');
        await expect(page.getByTestId('lastName')).toHaveValue('');
        await expect(page.getByTestId('postalCode')).toHaveValue('');
    });
});

test.describe('Sobrenome obrigatório — BDD-09', () => {
    test('CT-17 — Tentar continuar com o sobrenome vazio', {
        tag: ['@09', '@negativo', '@alta'],
    }, async ({ page }) => {
        const checkout = new CheckoutPage(page);
        await abrirCheckout(page);

        await checkout.preencherDados('Ana', '', '01310-100');
        await checkout.continuar();

        await checkout.conferirErro('Error: Last Name is required');
        await expect(page.getByTestId('firstName')).toHaveValue('Ana');
        await expect(page.getByTestId('lastName')).toHaveValue('');
        await expect(page.getByTestId('postalCode')).toHaveValue('01310-100');
    });

    test('CT-18 — Corrigir o sobrenome ausente e conseguir avançar', {
        tag: ['@09', '@negativo', '@media'],
    }, async ({ page }, testInfo) => {
        const checkout = new CheckoutPage(page);
        const resumo = new ResumoPedidoPage(page);

        await abrirCheckout(page);
        await checkout.preencherDados('Ana', '', '01310-100');
        await checkout.continuar();
        await checkout.conferirErro('Error: Last Name is required');
        await expect(page.getByTestId('firstName')).toHaveValue('Ana');
        await expect(page.getByTestId('lastName')).toHaveValue('');
        await expect(page.getByTestId('postalCode')).toHaveValue('01310-100');
        await registrarEvidencia(page, testInfo, 'sobrenome-ausente');

        await page.getByTestId('lastName').fill('Silva');
        await checkout.continuar();

        await resumo.conferirResumo(1);
        await resumo.conferirProduto(mochila.nome, mochila.preco);
        await resumo.conferirValores('$29.99', '$2.40', '$32.39');
    });
});

test.describe('Código postal obrigatório — BDD-10', () => {
    test('CT-19 — Tentar continuar com o código postal vazio', {
        tag: ['@10', '@negativo', '@alta'],
    }, async ({ page }) => {
        const checkout = new CheckoutPage(page);
        await abrirCheckout(page);

        await checkout.preencherDados('Ana', 'Silva', '');
        await checkout.continuar();

        await checkout.conferirErro('Error: Postal Code is required');
        await expect(page.getByTestId('firstName')).toHaveValue('Ana');
        await expect(page.getByTestId('lastName')).toHaveValue('Silva');
        await expect(page.getByTestId('postalCode')).toHaveValue('');
    });

    test('CT-20 — Corrigir o código postal ausente e conseguir avançar', {
        tag: ['@10', '@negativo', '@media'],
    }, async ({ page }, testInfo) => {
        const checkout = new CheckoutPage(page);
        const resumo = new ResumoPedidoPage(page);

        await abrirCheckout(page);
        await checkout.preencherDados('Ana', 'Silva', '');
        await checkout.continuar();
        await checkout.conferirErro('Error: Postal Code is required');
        await expect(page.getByTestId('firstName')).toHaveValue('Ana');
        await expect(page.getByTestId('lastName')).toHaveValue('Silva');
        await expect(page.getByTestId('postalCode')).toHaveValue('');
        await registrarEvidencia(page, testInfo, 'codigo-postal-ausente');

        await page.getByTestId('postalCode').fill('01310-100');
        await checkout.continuar();

        await resumo.conferirResumo(1);
        await resumo.conferirProduto(mochila.nome, mochila.preco);
        await resumo.conferirValores('$29.99', '$2.40', '$32.39');
    });
});
