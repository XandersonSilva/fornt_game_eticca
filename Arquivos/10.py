# Faça um programa que receba o nome de um arquivo de entrada e outro de saída. O arquivo de entrada contém em cada linha o nome de uma cidade e o seu número de habitantes, separados por uma tabulação. O programa deverá ler o arquivo de entrada, armazenar os dados das cidades em uma lista de dicionários, e gerar um arquivo de saída onde aparece o nome da cidade mais populosa seguida pelo seu número de habitantes. Mostre na tela lista dos dicionários e o conteúdo desse arquivo de saída.


nome_entrada = input()
nome_saida = nome_entrada + ".out"

lista_cidades = []

with open(nome_entrada, 'r') as arq_entrada:
    for linha in arq_entrada:
        linha_limpa = linha.strip()
        
        if not linha_limpa:
            continue
            
        coluna = linha_limpa.split('\t')
        
        if len(coluna) >= 2:
            dicionario = {}
            dicionario['nome'] = coluna[0]
            dicionario['habitantes'] = int(coluna[1])
            lista_cidades.append(dicionario)

maior_cidade = lista_cidades[0]

for cidade in lista_cidades:
    print(cidade)
    
    if cidade['habitantes'] > maior_cidade['habitantes']:
        maior_cidade = cidade

with open(nome_saida, 'w') as arq_saida:
    arq_saida.write(f"{maior_cidade['nome']}\t{maior_cidade['habitantes']}")

with open(nome_saida, 'r') as arq_leitura_final:
    print(arq_leitura_final.read())

