# Testes do Swag Labs

Projeto de avaliação de QA com Playwright e TypeScript. São 20 casos de teste, ligados a dez cenários BDD: 13 de prioridade Alta, 6 de Média e 1 de Baixa.

## Instalação

Com Node.js 24 e npm instalados, execute na pasta do projeto:

```bash
npm ci
npx playwright install webkit
npm test
```

Os testes acessam https://www.saucedemo.com/ e precisam de conexão com a internet.

## Comandos úteis

```bash
npx playwright test                  # Rodar os testes
npx playwright show-report           # Consultar o relatório HTML
npx playwright show-report           # Rodar a UI
npm test -- --grep CT-01 --headed    # Executar apenas o CT-01
npm run test:alta                    # Executar os casos de Alta
npm run test:ui                      # Abrir a interface do Playwright
```

O navegador padrão é o WebKit. Para executar no Chromium, instale com `npx playwright install chromium` e use `npm run test:chromium`.

## Arquivos

- `tests/saucedemo.spec.ts`: os vinte testes.
- `pages/` e `suporte/`: ações das telas, dados e capturas de evidências.
- `features/`: cenários Gherkin, relacionados aos testes pelos IDs e tags.
- `evidencias/`: screenshots, comprovantes e resultados em JSON.

## Resultados

Os vinte casos passaram no WebKit, sem repetição. Na execução com Chromium, dez passaram e dez falharam ao abrir o site, com erros de conexão. Esse resultado está em `evidencias/execucao-com-chromium.json`.

As capturas estão em `evidencias/ultima-execucao/`. O arquivo `evidencias/resultados.json` reúne os vinte resultados do WebKit extraídos da execução arquivada em `execucao-com-chromium.json`; a origem está descrita em `evidencias/README.md`. O CT-10 também confere os produtos e os valores do comprovante PDF. Uma nova execução substitui as evidências atuais e o relatório HTML.

Nos casos negativos, a mensagem de erro é esperada: o teste passa quando ela aparece corretamente. Se uma execução falhar, o Playwright tenta mais uma vez e registra as duas tentativas no relatório. A captura `evidencias/CT-02-falha-de-acesso.png` e o arquivo `evidencias/falhas-de-acesso.json` guardam um timeout de carregamento ocorrido antes do ajuste na abertura da página.

## Documentação

Os casos, as prioridades e os resultados estão em `Casos_de_Teste_Swag_Labs_20.xlsx`. O relatório está em `Avaliacao_Pratica_GabrielZanelatto.docx` e `Avaliacao_Pratica_GabrielZanelatto.pdf`.
