import psycopg2
# Connect to PostgreSQL
def get_items_status():
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

print(get_items_status())