# Faça um programa que leia um arquivo com diversos nomes e telefones cadastrados, um por linha, e separados por uma tabulação. Guarde essas informações em uma lista de dicionários. Imprima esses dicionários na tela, ordenados pelo nome. O nome do arquivo é dado como entrada para o programa.

nome_entrada = input()
lista = []
with open(nome_entrada, 'r') as arquivo:
    for linha in arquivo:
        linha_limpa = linha.strip()
        
        if not linha_limpa:
            continue
            
        coluna = linha_limpa.split('\t')
        
        if len(coluna) >= 2:
            dicionario = {}
            dicionario['nome'] = coluna[0]
            dicionario['telefone'] = coluna[1]
            lista.append(dicionario)

tamanho = len(lista)

for i in range(tamanho):
    for j in range(0, tamanho - i - 1):
        if lista[j]['nome'] > lista[j + 1]['nome']:
            temp = lista[j]
            lista[j] = lista[j + 1]
            lista[j + 1] = temp

for item in lista:
    print(item)