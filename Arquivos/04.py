# Faça um programa que receba do usuário um arquivo texto e mostre na tela quantas letras são vogais e quantas são consoantes.

arquivo = open(input(), 'r')

contador_vogais = 0
contador_consoantes = 0

for linha in arquivo:
    vogais = "aeiou"
    for letra in linha:
        if letra.isalpha():
            if letra.lower() in vogais:
                contador_vogais += 1
            else:
                contador_consoantes += 1

print(contador_vogais)
print(contador_consoantes)