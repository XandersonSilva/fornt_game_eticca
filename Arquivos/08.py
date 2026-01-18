# Faça um programa que leia o conteúdo de um arquivo e crie outro arquivo com o mesmo conteúdo, mas com todas as letras minúsculas convertidas para maiúsculas. Os nomes dos arquivos serão fornecidos, via teclado, pelo usuário. Escreva na tela o conteúdo dos dois arquivos, primeiro o do arquivo de entrada e depois o do arquivo de saída.

nome_entrada = input()
nome_saida = nome_entrada + ".out"

with open(nome_entrada, 'r') as arq_entrada, open(nome_saida, 'w') as arq_saida:
    
    for linha in arq_entrada:
        nova_linha = ""

        for letra in linha:
            nova_linha += letra.upper()

        
        arq_saida.write(nova_linha)

with open(nome_entrada, 'r') as arq_entrada:
    print(arq_entrada.read(), end='')

with open(nome_saida, 'r') as arq_resultado:
    print(arq_resultado.read())


