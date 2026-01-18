# Abra um arquivo texto, calcule e escreva na tela o número de caracteres, o número de linhas e o número de palavras neste arquivo. Também escreva na tela quantas vezes cada letra ocorre no arquivo (ignorando letras com acento). Obs.: palavras são separadas por um ou mais caracteres espaço, tabulação ou nova linha.


def estatisticas(nome_arquivo):
    with open(nome_arquivo, 'r') as arquivo:
        conteudo = arquivo.read()

    num_caracteres = len(conteudo)
    
    if num_caracteres == 0:
        num_linhas = 0
    else:
        num_linhas = len(conteudo.splitlines())

    lista_palavras = conteudo.split()
    num_palavras = len(lista_palavras)

    print(f"{num_caracteres}")
    print(f"{num_linhas}")
    print(f"{num_palavras}")

    alfabeto = "abcdefghijklmnopqrstuvwxyz"
    contagem = {letra: 0 for letra in alfabeto}

    for char in conteudo:
        if char.isalpha():
            char_lower = char.lower()
            if char_lower in contagem:
                contagem[char_lower] += 1

    for letra in alfabeto:
        print(f"{letra}: {contagem[letra]}")
            
            
nome = input()

estatisticas(nome)
