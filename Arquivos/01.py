"""
Escreva um programa que:
◦ Crie/abra um arquivo texto de nome “arq.txt”
◦ Permita que o usuário grave diversas linhas nesse arquivo, até que o usuário entre com a linha ‘0’
◦ Feche o arquivo
Agora, abra e leia o arquivo, e escreva na tela o conteúdo do arquivo.
"""

arquivo = open("arq.txt", "w")
linha = input()
while linha != "0":
    print(linha)
    linha = input()
    if linha == "0":
        break