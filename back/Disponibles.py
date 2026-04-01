import psycopg2
def Disponibles():
    import pandas as pd
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )

    # Create a cursor object
    cursor = conn.cursor()

    query = """
            SELECT estado, x, y
            FROM estado_carros
            WHERE id_carro = %s
            ORDER BY fecha DESC
            LIMIT 1;
        """
    entries = []
    x = []
    y = []
    for i in range(1, 13):
        carro_id = i
        # Execute the query
        cursor.execute(query, (carro_id,))
        latest_entry = cursor.fetchone()
        if latest_entry[0] == 0:
            x.append(latest_entry[1])
            y.append(latest_entry[2])
            entries.append(carro_id)
    query2 = """
                SELECT clave 
                FROM carros
                WHERE id_carro = %s
            """
    carros_d = []
    for i in entries:
        carro_id = i
        # Execute the query
        cursor.execute(query2, (carro_id,))
        latest_entry = cursor.fetchone()
        carros_d.append(latest_entry[0])
    data = {'carro': carros_d, 'x': x, 'y': y}
    df = pd.DataFrame(data)
    bomba = [11, 13, 21, 31, 41, 12, 22, 32, 42]
    forestal = [12, 22, 32, 42, 11, 13, 21, 31, 41]
    rescate = [14, 33]
    aljibe = [43]
    bombas_d = []
    forestal_d = []
    rescate_d = []
    aljibe_d = []
    for i in bomba:
        if i in carros_d:
            bombas_d.append(i)
    for i in forestal:
        if i in carros_d:
            forestal_d.append(i)
    for i in rescate:
        if i in carros_d:
            rescate_d.append(i)
    for i in aljibe:
        if i in carros_d:
            aljibe_d.append(i)

    return bombas_d, forestal_d, rescate_d, aljibe_d, df, carros_d