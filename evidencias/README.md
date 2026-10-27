# Registros de execução

- `execucao-com-chromium.json`: registro completo da execução de 26/10/2026, com 20 testes aprovados no WebKit e, no Chromium, 10 aprovados e 10 falhas de conexão.
- `resultados.json`: recorte desse registro, contendo somente os 20 testes do WebKit, com seus resultados e anexos. Os horários e a duração em `stats` correspondem à execução completa de origem.
- `ultima-execucao/`: capturas e comprovante preservados da execução posterior de 26/10/2026, registrada na aba Execucao da planilha. Os caminhos dos anexos são os mesmos usados na execução anterior.
- `falhas-de-acesso.json` e `CT-02-falha-de-acesso.png`: registro de um timeout ocorrido antes do ajuste na abertura da página.

Durante a preparação do repositório em 27/10/2026, `playwright test --list` substituiu o JSON da execução posterior por uma listagem sem execução. O arquivo `resultados.json` foi recuperado a partir do registro anterior, que continuava salvo em `execucao-com-chromium.json`. As capturas foram preservadas. Os resultados recuperados não representam uma nova execução.

Para listar os testes sem substituir os resultados salvos, use:

```bash
npx playwright test --list --project=webkit --reporter=list
```
