"""
Continuando o programa da questão anterior, escreva no arquivo de saída, além da idade, uma string que representa a sua maioridade:
◦ Se a idade for menor do que 18 anos, escreva “menor de idade”
◦ Se a idade for maior do que 18 anos, escreva “maior de idade”
◦ Se a idade for igual a 18 anos, escreva “entrando na maioridade”
"""

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

            maioridade = ''

            if mes < mes_nasc:
                idade -= 1
                
            elif mes == mes_nasc and dia < dia_nasc:
                idade -= 1
                

            if idade < 18:
                maioridade = "menor de idade"
            if idade > 18:
                maioridade = "maior de idade"
            if idade == 18:
                maioridade = "entrando na maioridade"
            
            arq_saida.write(f"{nome}\t{idade}\t{maioridade}\n")

with open(nome_saida, 'r') as arq_final:
    print(arq_final.read(), end='')