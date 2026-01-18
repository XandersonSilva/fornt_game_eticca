# Faça um programa que receba dois arquivos do usuário, e crie um terceiro arquivo com o conteúdo dos dois primeiros juntos (o conteúdo do primeiro seguido do conteúdo do segundo). O nome do terceiro arquivo deve ser o nome do primeiro arquivo seguido do nome do segundo arquivo. Mostre na tela o conteúdo do terceiro arquivo.


nome_entrada1 = input()
nome_entrada2 = input()

nome_saida = nome_entrada1 + nome_entrada2

with open(nome_entrada1, 'r') as arq1, open(nome_entrada2, 'r') as arq2, open(nome_saida, 'w') as arq_resultado:

    arq_resultado.write(arq1.read())

    arq_resultado.write(arq2.read())

with open(nome_saida, 'r') as arq_resultado:
    print(arq_resultado.read())