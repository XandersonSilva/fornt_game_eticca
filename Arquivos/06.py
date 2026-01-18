# Faça um programa que receba do usuário um arquivo texto e mostre na tela quantas vezes cada letra do alfabeto aparece dentro do arquivo. Letras maiúsculas e minúsculas devem ser contadas juntas, e não separadamente.
def letra_aparece(arquivo):
    contagem = {}
    alfabeto = "abcdefghijklmnopqrstuvwxyz"
    for letra in alfabeto:
        contagem[letra] = 0

    for linha in arquivo:
        for letra in linha:
            if letra.isalpha():
                chave = letra.lower()
                if chave in contagem:
                    contagem[chave] += 1
            
    return contagem     

            

arquivo = open(input(), 'r')

resultado = letra_aparece(arquivo)

for letra in resultado:
    print(f"{letra}: {resultado[letra]}")