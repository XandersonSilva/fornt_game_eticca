# Faça uma função que recebe o nome do arquivo e uma palavra, e retorne o número de vezes que aquela palavra aparece no arquivo.

def funcao(arq_nome, palavra):
    contador = 0
    palavra = palavra.lower()

    with open(arq_nome, 'r') as arquivo:
        conteudo = arquivo.read().lower()
        indice = 0
        while True:
                indice = conteudo.find(palavra, indice)
                
                if indice == -1:
                    break

                contador += 1

                indice += 1

    return contador

nome = input()
palavra = input()
resultado = funcao(nome, palavra)

print(resultado)