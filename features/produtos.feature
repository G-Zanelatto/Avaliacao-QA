Feature: Ordenação do catálogo
  Como cliente da loja
  Quero realizar as ações com os dados corretos
  Para comprar e receber mensagens claras quando houver uma pendência

  # Casos: CT-11, CT-12. Variações e verificações adicionais estão na planilha.
  @06 @positivo
  Scenario: BDD-06 - Ordenar produtos por nome de Z a A
    Given que o cliente está autenticado como "standard_user" no catálogo de seis produtos
    When seleciona "Name (Z to A)" no filtro
    Then deve ver todos os produtos em ordem alfabética decrescente pelo nome
    And nenhum produto deve desaparecer ou se repetir
    And o conteúdo do carrinho deve ser preservado
