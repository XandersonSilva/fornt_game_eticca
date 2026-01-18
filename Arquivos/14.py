# Dado um arquivo contendo um conjunto de nomes e datas de nascimento (DD MM AAAA, isto é, 3 inteiros em sequência), faça um programa que leia o nome do arquivo e a data de hoje e construa outro arquivo contendo o nome e a idade de cada pessoa do primeiro arquivo. No arquivo de entrada, o nome está separado da data de nascimento por uma tabulação, mas as informações da data de nascimento estão separadas por um espaço em branco. A data de hoje da entrada será dada em três inteiros diferentes, dia, mês e ano. O arquivo de saída deve ter o mesmo nome do arquivo de entrada, mas terminando em .out (por exemplo, se a entrada for arquivo.txt, a saída deve ser arquivo.txt.out). Escreva na tela o conteúdo desse arquivo.

nome_entrada = input()
nome_saida = nome_entrada + ".out"

dia = int(input())
mes = int(input())
ano = int(input())
pessoas = []

with open(nome_entrada, 'r') as arq_entrada, open(nome_saida, 'w') as arq_saida:

    for linha in arq_entrada:
        linha_limpa = linha.strip()
        
        if not linha_limpa:
            continue
            
        coluna = linha_limpa.split('\t')

        if len(coluna) >= 2:
            nome = coluna[0]
            nascimento = coluna[1]

            partes_data = nascimento.split(' ')

            dia_nasc = int(partes_data[0])
            mes_nasc = int(partes_data[1])
            ano_nasc = int(partes_data[2])

            idade = ano - ano_nasc

            if mes < mes_nasc:
                idade -= 1
            elif mes == mes_nasc and dia < dia_nasc:
                idade -= 1
            
            arq_saida.write(f"{nome}\t{idade}\n")

with open(nome_saida, 'r') as arq_final:
    print(arq_final.read(), end='')