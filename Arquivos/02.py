# Faça um programa que receba do usuário um arquivo texto e mostre na tela quantas linhas esse arquivo possui.


arquivo = open(input(), 'r')

contador = 0

for linha in arquivo:
    contador += 1

print(contador)