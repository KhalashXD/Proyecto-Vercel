def Coordenadas(calle, interseccion):
    import pandas as pd
    import ast
    calles = pd.read_csv('inters.csv', sep='#', encoding='utf-8')
    calles['Intersecciones'] = calles['Intersecciones'].apply(ast.literal_eval)
    calles['X'] = calles['X'].apply(ast.literal_eval)
    calles['Y'] = calles['Y'].apply(ast.literal_eval)
    df = calles[calles['Calles']==calle]
    inters = df.iloc[0]['Intersecciones']
    x = df.iloc[0]['X']
    y = df.iloc[0]['Y']
    ind = inters.index(interseccion)
    coord = (x[ind], y[ind])
    return coord