# Faça um programa que receba do usuário um arquivo texto e mostre na tela quantas letras são vogais.

arquivo = open(input(), 'r')

contador = 0

for linha in arquivo:
    vogais = "aeiou"
    for letra in linha:
        if letra.lower() in vogais:
            contador += 1

print(contador)