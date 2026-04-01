import psycopg2
from datetime import datetime

def emergencias_db(clave, calle, interseccion, fecha, x, y):
    # Create a cursor object
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    # Example: Creating a table
    insert_query = '''
        INSERT INTO emergencias (clave, calle, interseccion, fecha, x, y)
        VALUES (%s, %s, %s, %s, %s, %s)'''
    data = (clave, calle, interseccion, fecha, x, y)
    # Execute the insert command for each employee
    cursor.execute(insert_query, data)

    conn.commit()

    cursor.execute("SELECT currval(pg_get_serial_sequence('emergencias', 'id_emergencia'))")
    inserted_id = cursor.fetchone()[0]

    # Close the connection
    cursor.close()
    # Close the connection
    conn.close()

    return inserted_id

def acciones(tipo, estado, info, id_emergencia, id_carro, id_bombero):
    # Create a cursor object
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    now = datetime.now()
    current_datetime = now.strftime("%d-%m-%Y %H:%M:%S")
    # Example: Creating a table
    insert_query = '''
        INSERT INTO acciones (tipo, fecha, estado, info, id_emergencia, id_carro, id_bombero)
        VALUES (%s, %s, %s, %s, %s, %s, %s)'''
    data = (tipo, current_datetime, estado, info, id_emergencia, id_carro, id_bombero)
    # Execute the insert command for each employee
    cursor.execute(insert_query, data)

    conn.commit()

    cursor.execute("SELECT currval(pg_get_serial_sequence('acciones', 'id_accion'))")
    inserted_id = cursor.fetchone()[0]

    # Close the connection
    cursor.close()
    # Close the connection
    conn.close()

    return inserted_id

def accion_carro_db(carros, id_emergencia):
    # Create a cursor object
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    now = datetime.now()
    current_datetime = now.strftime("%d-%m-%Y %H:%M:%S")
    # Example: Creating a table
    insert_query = '''
        INSERT INTO acciones (tipo, fecha, estado, info, id_emergencia, id_carro, id_bombero)
        VALUES (%s, %s, %s, %s, %s, %s, %s)'''

    for carro in carros:
        nombre_buscado = int(carro)

        # Ejecutar el query para obtener el id del elemento con el nombre especificado
        cursor.execute("SELECT id_carro FROM carros WHERE clave = %s", (nombre_buscado,))
        id_carro = cursor.fetchone()[0]
        data = ('Despacho inicial', current_datetime, 0, 'Carro despachado por Central CBVA', id_emergencia, id_carro, 1)
        # Execute the insert command for each employee
        cursor.execute(insert_query, data)

    conn.commit()

    cursor.execute("SELECT currval(pg_get_serial_sequence('acciones', 'id_accion'))")
    inserted_id = cursor.fetchall()

    # Close the connection
    cursor.close()
    # Close the connection
    conn.close()

    return inserted_id

def estado_carro(x, y, estado, bomberos, cargo, id_carro, id_accion, id_emergencia):
    # Create a cursor object
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    now = datetime.now()
    current_datetime = now.strftime("%d-%m-%Y %H:%M:%S")
    # Example: Creating a table
    insert_query = '''
            INSERT INTO estado_carros (x, y, estado, bomberos, fecha, cargo, id_carro, id_accion)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'''

    data = (x, y, estado, bomberos, current_datetime, cargo, id_carro, id_accion)
    cursor.execute(insert_query, data)

    cursor.execute("SELECT nombre, apellido_p, apellido_m, clave FROM bomberos WHERE id_bombero = %s", (cargo,))
    # Obtener el resultado
    name = cursor.fetchone()

    insert_query2 = '''
                INSERT INTO acciones (tipo, fecha, estado, info, id_emergencia, id_carro, id_bombero)
                VALUES (%s, %s, %s, %s, %s, %s, %s)'''
    info = f'{name[3]} {name[0]} {name[1]} {name[2]} - Bomberos: {bomberos}'
    data = ('Dotación', current_datetime, 0, info, id_emergencia, id_carro, cargo)
    # Execute the insert command for each employee
    cursor.execute(insert_query2, data)

    conn.commit()

    cursor.execute("SELECT currval(pg_get_serial_sequence('estado_carros', 'id_estadocarro'))")
    inserted_id = cursor.fetchone()[0]

    # Close the connection
    cursor.close()
    # Close the connection
    conn.close()

    return inserted_id

def estado_carro2(x, y, estado, bomberos, cargo, id_carro, id_accion):
    # Create a cursor object
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    now = datetime.now()
    current_datetime = now.strftime("%d-%m-%Y %H:%M:%S")
    # Example: Creating a table
    insert_query = '''
            INSERT INTO estado_carros (x, y, estado, bomberos, fecha, cargo, id_carro, id_accion)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'''

    data = (x, y, estado, bomberos, current_datetime, cargo, id_carro, id_accion)
    cursor.execute(insert_query, data)

    conn.commit()

    cursor.execute("SELECT currval(pg_get_serial_sequence('estado_carros', 'id_estadocarro'))")
    inserted_id = cursor.fetchone()[0]

    # Close the connection
    cursor.close()
    # Close the connection
    conn.close()

    return inserted_id

def carro_id(carro):
    # Create a cursor object
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    cursor.execute("SELECT id_carro FROM carros WHERE clave = %s", (carro,))

    # Obtener el resultado
    id_resultado = cursor.fetchone()

    # Close the connection
    cursor.close()
    # Close the connection
    conn.close()

    return id_resultado

def query_emergencias(id):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    cursor.execute("SELECT clave, calle, interseccion, fecha, x, y FROM emergencias WHERE id_emergencia = %s", (id,))
    clave = cursor.fetchone()
    clave = list(clave)

    cursor.execute("SELECT info  FROM acciones WHERE id_emergencia = %s AND tipo = 'Cambio de clave' ORDER BY fecha DESC", (id,))
    data4 = cursor.fetchone()
    if data4 != None:
        clave[0] = f'{data4[0]}'
    # Obtener el resultado

    clave[3] = f'{clave[3]}'
    # Close the connection
    cursor.close()
    # Close the connection
    conn.close()

    return clave

def query_acciones(id_emergencia):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    # Ejecutar consulta en la tabla 'acciones'
    cursor.execute("SELECT tipo, fecha, estado, info, id_carro, id_bombero FROM acciones WHERE id_emergencia = %s",
                   (id_emergencia,))

    # Obtener el resultado
    data = cursor.fetchall()

    acciones_list = []

    for i in data:
        # Convertir la tupla en una lista para que sea modificable
        i = list(i)

        # Consultar la clave del carro usando el id_carro
        cursor.execute("SELECT clave FROM carros WHERE id_carro = %s", (i[4],))
        carro = cursor.fetchone()  # Obtiene la clave del carro

        # Consultar los detalles del bombero usando el id_bombero
        cursor.execute("SELECT nombre, apellido_p, apellido_m, clave FROM bomberos WHERE id_bombero = %s", (i[5],))
        bombero = cursor.fetchone()  # Obtiene los datos del bombero en una tupla

        i[1] = f'{i[1]}'

        if carro:
            i[4] = carro[0]  # Reemplazar el id_carro con la clave obtenida

        if bombero:
            # Construir el nombre completo del bombero
            if bombero[3] == '0  ':
                nombre_completo = f"{bombero[0]} {bombero[1]} {bombero[2]}"
            else:
                nombre_completo = f"{bombero[3]} {bombero[0]} {bombero[1]} {bombero[2]}"
            i[5] = nombre_completo

        # Añadir la lista modificada a acciones_list
        acciones_list.append(i)

    # Cerrar la conexión
    cursor.close()
    conn.close()

    acciones_list.reverse()

    return acciones_list

def query_carros_activos_emergencia(id_emergencia):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    # Ejecutar consulta en la tabla 'acciones'
    cursor.execute("SELECT id_carro, id_accion FROM acciones WHERE id_emergencia = %s AND tipo = %s",
                   (id_emergencia,'Despacho inicial',))
    # Obtener el resultado
    data = cursor.fetchall()
    ids = []
    for i in data:
        ids.append(i[0])
    ids = set(ids)
    carros = []
    for i in ids:
        cursor.execute("SELECT clave FROM carros WHERE id_carro = %s",
                       (i,))
        # Obtener el resultado
        data3 = cursor.fetchone()
        carros.append(data3[0])

    # Cerrar la conexión
    cursor.close()
    conn.close()

    return carros

def query_coord(id_emergencia):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    # Ejecutar consulta en la tabla 'acciones'
    cursor.execute("SELECT x, y FROM emergencias WHERE id_emergencia = %s",
                   (id_emergencia,))
    # Obtener el resultado
    data = cursor.fetchone()
    x = data[0]
    y = data[1]
    coord = (x,y)

    return coord

def query_coord_carro(id_carro):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    # Ejecutar consulta en la tabla 'acciones'
    cursor.execute("SELECT x, y FROM carros WHERE id_carro = %s",
                   (id_carro,))
    # Obtener el resultado
    data = cursor.fetchone()
    x = data[0]
    y = data[1]

    return x, y

def carros_estado():
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )

    # Create a cursor object
    cursor = conn.cursor()

    # Query to get the latest entry for a specific carro_id

    query = """
        SELECT estado
        FROM estado_carros
        WHERE id_carro = %s
        ORDER BY fecha DESC
        LIMIT 1;
    """
    query2 = """
        SELECT clave
        FROM carros
        WHERE id_carro = %s
    """
    estados = []
    claves = []
    for i in range(1,13):
        carro_id = i
    # Execute the query
        cursor.execute(query, (carro_id,))
        latest_entry = cursor.fetchone()
        estados.append(latest_entry[0])
        cursor.execute(query2, (carro_id,))
        latest_entry = cursor.fetchone()
        claves.append(latest_entry[0])

    # Close the connection
    cursor.close()
    conn.close()

    estado = {}
    for carro in claves:
        for e in estados:
            estado[carro] = e
            estados.remove(e)
            break

    return estado

def query_emergencias_activas():
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id_emergencia  FROM emergencias")
    data = cursor.fetchall()
    ids = []
    for i in data:
        id = i[0]
        cursor.execute("SELECT id_emergencia FROM acciones WHERE estado = 1 AND id_emergencia = %s", (id,))
        data2 = cursor.fetchone()
        if data2 == None:
            ids.append(id)

    # Cerrar la conexión
    ids.reverse()
    texts = []
    dates = []
    for j in ids:
        cursor.execute("SELECT clave, calle, interseccion, fecha  FROM emergencias WHERE id_emergencia = %s", (j,))
        data3 = cursor.fetchone()
        cursor.execute("SELECT info  FROM acciones WHERE id_emergencia = %s AND tipo = 'Cambio de clave' ORDER BY fecha DESC", (j,))
        data4 = cursor.fetchone()
        if data4 == None:
            text = f'Clave {data3[0]}  {data3[1]} / {data3[2]}'
        else:
            text = f'Clave {data4[0]}  {data3[1]} / {data3[2]}'
        date = f'{data3[3]}'
        texts.append(text)
        dates.append(date)
    cursor.close()
    conn.close()

    return ids, texts, dates

def query_emergencias_totales():
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id_emergencia, clave, calle, interseccion, fecha  FROM emergencias")
    data = cursor.fetchall()
    ids = []
    texts = []
    dates = []
    for i in data:
        id = i[0]
        cursor.execute(
            "SELECT info  FROM acciones WHERE id_emergencia = %s AND tipo = 'Cambio de clave' ORDER BY fecha DESC",
            (id,))
        data2 = cursor.fetchone()
        if data2 == None:
            text = f'Clave {i[1]}  {i[2]} / {i[3]}'
        else:
            text = f'Clave {data2[0]}  {i[2]} / {i[3]}'
        date = f'{i[4]}'
        ids.append(id)
        texts.append(text)
        dates.append(date)

    ids.reverse()
    texts.reverse()
    dates.reverse()

    cursor.close()
    conn.close()

    return ids, texts, dates

def query_bombero(id_bombero):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    cursor.execute("SELECT clave, nombre, apellido_p, apellido_m FROM bomberos WHERE id_bombero = %s;",
                   (id_bombero,))
    data = cursor.fetchone()
    text = f'{data[0]} {data[1]} {data[2]} {data[3]}'
    cursor.close()
    conn.close()

    return text

def query_mando_carro(id_carro):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    cursor.execute("SELECT cargo FROM estado_carros WHERE id_carro = %s AND estado = 1 ORDER BY fecha DESC LIMIT 1;", (id_carro,))
    data = cursor.fetchone()
    id_bombero = data[0]
    cursor.close()
    conn.close()

    return id_bombero

def query_mando_emergencia(id_emergencia):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id_bombero FROM acciones WHERE id_emergencia = %s AND tipo = 'Asume como CI' ORDER BY id_accion DESC LIMIT 1;", (id_emergencia,))
    data = cursor.fetchone()
    if data != None:
        id_bombero = data[0]
    else:
        id_bombero = None
    cursor.close()
    conn.close()

    return id_bombero

def query_clave_bombero(id_bombero):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()
    cursor.execute("SELECT clave FROM bomberos WHERE id_bombero = %s;", (id_bombero,))
    data = cursor.fetchone()
    clave = data[0]
    cursor.close()
    conn.close()

    return clave

def last_action():
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )

    # Create a cursor object
    cursor = conn.cursor()

    # Query to get the latest entry for a specific carro_id

    cursor.execute("SELECT id_accion FROM acciones ORDER BY fecha DESC LIMIT 1;")
    data = cursor.fetchone()
    accion = data[0]

    cursor.close()
    conn.close()

    return accion

def query_evaluaciones(id):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    cursor.execute("SELECT fecha, info, id_bombero FROM acciones WHERE id_emergencia = %s AND tipo = %s", (id,'Evaluación',))
    data = cursor.fetchall()

    evaluaciones_list = []
    for i in data:
        # Convertir la tupla en una lista para que sea modificable
        i = list(i)

        # Consultar los detalles del bombero usando el id_bombero
        cursor.execute("SELECT nombre, apellido_p, apellido_m, clave FROM bomberos WHERE id_bombero = %s", (i[2],))
        bombero = cursor.fetchone()  # Obtiene los datos del bombero en una tupla

        i[0] = f'{i[0]}'

        if bombero:
            # Construir el nombre completo del bombero
            if bombero[3] == '0  ':
                nombre_completo = f"{bombero[0]} {bombero[1]} {bombero[2]}"
            else:
                nombre_completo = f"{bombero[3]} {bombero[0]} {bombero[1]} {bombero[2]}"
            i[2] = nombre_completo

        # Añadir la lista modificada a acciones_list
        evaluaciones_list.append(i)


    cursor.close()
    # Close the connection
    conn.close()

    return evaluaciones_list

def query_claves(id):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    cursor.execute("SELECT fecha, info, id_bombero FROM acciones WHERE id_emergencia = %s AND tipo = %s", (id,'Cambio de clave',))
    data = cursor.fetchall()

    claves_list = []
    for i in data:
        # Convertir la tupla en una lista para que sea modificable
        i = list(i)

        # Consultar los detalles del bombero usando el id_bombero
        cursor.execute("SELECT nombre, apellido_p, apellido_m, clave FROM bomberos WHERE id_bombero = %s", (i[2],))
        bombero = cursor.fetchone()  # Obtiene los datos del bombero en una tupla

        i[0] = f'{i[0]}'

        if bombero:
            # Construir el nombre completo del bombero
            if bombero[3] == '0  ':
                nombre_completo = f"{bombero[0]} {bombero[1]} {bombero[2]}"
            else:
                nombre_completo = f"{bombero[3]} {bombero[0]} {bombero[1]} {bombero[2]}"
            i[2] = nombre_completo

        # Añadir la lista modificada a acciones_list
        claves_list.append(i)


    cursor.close()
    # Close the connection
    conn.close()

    return claves_list

def query_instrucciones(id):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    cursor.execute("SELECT fecha, info, id_bombero FROM acciones WHERE id_emergencia = %s AND tipo = %s", (id,'Instrucciones',))
    data = cursor.fetchall()

    instrucciones_list = []
    for i in data:
        # Convertir la tupla en una lista para que sea modificable
        i = list(i)

        # Consultar los detalles del bombero usando el id_bombero
        cursor.execute("SELECT nombre, apellido_p, apellido_m, clave FROM bomberos WHERE id_bombero = %s", (i[2],))
        bombero = cursor.fetchone()  # Obtiene los datos del bombero en una tupla

        i[0] = f'{i[0]}'

        if bombero:
            # Construir el nombre completo del bombero
            if bombero[3] == '0  ':
                nombre_completo = f"{bombero[0]} {bombero[1]} {bombero[2]}"
            else:
                nombre_completo = f"{bombero[3]} {bombero[0]} {bombero[1]} {bombero[2]}"
            i[2] = nombre_completo

        # Añadir la lista modificada a acciones_list
        instrucciones_list.append(i)


    cursor.close()
    # Close the connection
    conn.close()

    return instrucciones_list

def query_ci(id):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    cursor.execute("SELECT fecha, info FROM acciones WHERE id_emergencia = %s AND tipo = %s", (id,'Asume como CI',))
    data = cursor.fetchall()

    ci_list = []
    for i in data:
        # Convertir la tupla en una lista para que sea modificable
        i = list(i)

        i[0] = f'{i[0]}'

        # Añadir la lista modificada a acciones_list
        ci_list.append(i)


    cursor.close()
    # Close the connection
    conn.close()

    return ci_list

def query_externos(id):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    cursor.execute("SELECT fecha, info, id_bombero FROM acciones WHERE id_emergencia = %s AND tipo = %s", (id,'Recursos externos',))
    data = cursor.fetchall()

    externos_list = []
    for i in data:
        # Convertir la tupla en una lista para que sea modificable
        i = list(i)

        # Consultar los detalles del bombero usando el id_bombero
        cursor.execute("SELECT nombre, apellido_p, apellido_m, clave FROM bomberos WHERE id_bombero = %s", (i[2],))
        bombero = cursor.fetchone()  # Obtiene los datos del bombero en una tupla

        i[0] = f'{i[0]}'

        if bombero:
            # Construir el nombre completo del bombero
            if bombero[3] == '0  ':
                nombre_completo = f"{bombero[0]} {bombero[1]} {bombero[2]}"
            else:
                nombre_completo = f"{bombero[3]} {bombero[0]} {bombero[1]} {bombero[2]}"
            i[2] = nombre_completo

        # Añadir la lista modificada a acciones_list
        externos_list.append(i)


    cursor.close()
    # Close the connection
    conn.close()

    return externos_list

def query_info(id):
    conn = psycopg2.connect(
        host="localhost",
        dbname="cbva_db",
        user="postgres",
        password="2701",
        port="5432",
    )
    cursor = conn.cursor()

    cursor.execute("SELECT fecha, info FROM acciones WHERE id_emergencia = %s AND tipo = %s", (id,'Información',))
    data = cursor.fetchall()

    info_list = []
    for i in data:
        # Convertir la tupla en una lista para que sea modificable
        i = list(i)

        i[0] = f'{i[0]}'

        # Añadir la lista modificada a acciones_list
        info_list.append(i)


    cursor.close()
    # Close the connection
    conn.close()

    return info_list
