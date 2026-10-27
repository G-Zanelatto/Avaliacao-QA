Feature: Checkout e validação dos dados do cliente
  Como cliente da loja
  Quero realizar as ações com os dados corretos
  Para comprar e receber mensagens claras quando houver uma pendência

  # Casos: CT-05, CT-06. Variações e verificações adicionais estão na planilha.
  @03 @positivo
  Scenario: BDD-03 - Acessar o formulário de checkout
    Given que o cliente está autenticado como "standard_user" e tem produtos no carrinho
    When abre o carrinho e clica em "Checkout"
    Then deve ver a tela "Checkout: Your Information"
    And deve ver os campos "First Name", "Last Name" e "Zip/Postal Code"
    And deve ver os botões "Cancel" e "Continue"

  # Casos: CT-07, CT-08. Variações e verificações adicionais estão na planilha.
  @04 @positivo
  Scenario: BDD-04 - Avançar para o resumo do pedido
    Given que o cliente está no formulário de checkout com produtos no carrinho
    When preenche os três campos obrigatórios com os dados do caso de teste e clica em "Continue"
    Then deve ver a tela "Checkout: Overview"
    And deve ver os mesmos produtos, quantidades e preços do carrinho
    And deve ver o subtotal, o imposto de 8% arredondado e o total
    And deve ver os botões "Cancel" e "Finish"

  # Casos: CT-09, CT-10. Variações e verificações adicionais estão na planilha.
  @05 @positivo
  Scenario: BDD-05 - Finalizar a compra
    Given que o cliente está autenticado como "standard_user" no resumo de um pedido com produtos
    When clica em "Finish"
    Then deve ver a tela "Checkout: Complete!"
    And deve ver "Thank you for your order!"
    And deve ver "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    And deve ver os botões "Back Home" e "Generate PDF order"
    And o carrinho deve ficar vazio

  # Casos: CT-15, CT-16. Variações e verificações adicionais estão na planilha.
  @08 @negativo
  Scenario: BDD-08 - Impedir checkout sem primeiro nome
    Given que o cliente está autenticado e no formulário de checkout com uma mochila no carrinho
    When deixa "First Name" vazio e clica em "Continue"
    Then deve permanecer no formulário
    And deve ver "Error: First Name is required"
    And o pedido não deve ser concluído

  # Casos: CT-17, CT-18. Variações e verificações adicionais estão na planilha.
  @09 @negativo
  Scenario: BDD-09 - Impedir checkout sem sobrenome
    Given que o cliente está autenticado e no formulário de checkout com uma mochila no carrinho
    And preencheu o primeiro nome
    When deixa "Last Name" vazio e clica em "Continue"
    Then deve permanecer no formulário
    And deve ver "Error: Last Name is required"
    And o pedido não deve ser concluído

  # Casos: CT-19, CT-20. Variações e verificações adicionais estão na planilha.
  @10 @negativo
  Scenario: BDD-10 - Impedir checkout sem código postal
    Given que o cliente está autenticado e no formulário de checkout com uma mochila no carrinho
    And preencheu o primeiro nome e o sobrenome
    When deixa "Zip/Postal Code" vazio e clica em "Continue"
    Then deve permanecer no formulário
    And deve ver "Error: Postal Code is required"
    And o pedido não deve ser concluído
