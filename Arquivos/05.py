# Faça um programa que receba do usuário um arquivo texto e um caractere. Mostre na tela quantas vezes aquele caractere ocorre dentro do arquivo.

arquivo = open(input(), 'r')

caractere = input()
contador = 0 

for linha in arquivo:
    for letra in linha:
        if letra == caractere:
            contador += 1

print(contador)
