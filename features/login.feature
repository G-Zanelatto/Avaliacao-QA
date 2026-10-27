Feature: Login e controle de acesso
  Como cliente da loja
  Quero realizar as ações com os dados corretos
  Para comprar e receber mensagens claras quando houver uma pendência

  # Casos: CT-01, CT-02. Variações e verificações adicionais estão na planilha.
  @01 @positivo
  Scenario: BDD-01 - Login com credenciais válidas
    Given que o cliente está na tela de login sem uma sessão ativa
    When informa "standard_user" e "secret_sauce" e confirma o login
    Then deve acessar o catálogo de produtos
    And deve ver os seis produtos e o filtro "Name (A to Z)" selecionado

  # Casos: CT-13, CT-14. Variações e verificações adicionais estão na planilha.
  @07 @negativo
  Scenario: BDD-07 - Impedir acesso de usuário bloqueado
    Given que o cliente está na tela de login sem sessão anterior
    When tenta entrar com "locked_out_user" e "secret_sauce"
    Then deve permanecer na tela de login
    And deve ver "Epic sadface: Sorry, this user has been locked out."
    And não deve conseguir acessar o catálogo mesmo pela URL direta
