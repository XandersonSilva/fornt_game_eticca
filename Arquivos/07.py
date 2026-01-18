# Faça um programa que receba do usuário um arquivo texto. Crie outro arquivo texto contendo o texto do arquivo de entrada, mas com as vogais substituídas por ‘*’. Esse arquivo de saída deve ter o mesmo nome do arquivo de entrada, mas terminando em .out (por exemplo, se a entrada for arquivo.txt, a saída deve ser arquivo.txt.out). Escreva na tela o conteúdo desse arquivo.
import os

nome_entrada = input()
nome_saida = nome_entrada + ".out"
vogais = "aeiouAEIOU"

with open(nome_entrada, 'r') as arq_entrada, open(nome_saida, 'w') as arq_saida:
    
    for linha in arq_entrada:
        nova_linha = ""

        for letra in linha:
            if letra in vogais:
                nova_linha += "*"
            else:
                nova_linha += letra
        
        arq_saida.write(nova_linha)


with open(nome_saida, 'r') as arq_resultado:
    print(arq_resultado.read())


