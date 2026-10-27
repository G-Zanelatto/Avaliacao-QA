Feature: Inclusão de produtos no carrinho
  Como cliente da loja
  Quero realizar as ações com os dados corretos
  Para comprar e receber mensagens claras quando houver uma pendência

  # Casos: CT-03, CT-04. Variações e verificações adicionais estão na planilha.
  @02 @positivo
  Scenario: BDD-02 - Adicionar produto ao carrinho
    Given que o cliente está autenticado como "standard_user"
    And está vendo um produto que ainda não está no carrinho
    When adiciona esse produto ao carrinho
    Then o botão desse produto deve mostrar "Remove"
    And o contador deve aumentar em uma unidade
    And o carrinho deve conter o produto escolhido com seu preço e quantidade
