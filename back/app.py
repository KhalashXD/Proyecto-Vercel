from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from Despacho import Despacho
from Disponibles import Disponibles
from Orden import orden
from Clima import get_climate_data
from db import last_action, accion_carro_db, estado_carro, carro_id, query_acciones, query_emergencias, query_carros_activos_emergencia, query_coord, acciones, query_coord_carro, carros_estado, query_emergencias_activas, estado_carro2, query_emergencias_totales, query_mando_carro, query_bombero, query_mando_emergencia, query_clave_bombero, query_evaluaciones, query_claves, query_instrucciones, query_ci, query_externos, query_info
import os
from Alert import alert
import osmnx as ox
G = ox.load_graphml("ciudad.graphml")
from datetime import datetime
id_emergencia = None
despacho = None
id_acciones = None
coord = None
app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/despacho', methods=['POST'])
def despacho():
    global despacho, resultado, id_acciones, coord, id_emergencia
    data = request.json  # This converts the JSON payload into a Python dictionary
    # You can now access data like a regular Python dictionary
    despacho, resultado, id_accion, coord, id_emergencia, id_acciones = Despacho(data['clave'], data['calle'], data['interseccion'], G, data['direccion'], data['informacion'])
    # Further processing can be done here
    print(resultado)
    return jsonify({"resultado": resultado, "despacho": despacho, "id": id_emergencia})

@app.route('/carros_mando', methods=['POST'])
def carros_mando():
    now = datetime.now()
    current_datetime = now.strftime("%d-%m-%Y %H:%M:%S")
    data = request.json # This converts the JSON payload into a Python dictionary
    despacho = data['despacho']
    # You can now access data like a regular Python dictionary
    id_carro = carro_id(despacho[int(data['despachoIndex'])])
    del despacho[0]
    id_accion = id_acciones[int(data['despachoIndex'])]
    del id_acciones[0]
    id_estado_carro = estado_carro(coord[0], coord[1], 1, data['integerValue'], data['selectedId'], id_carro, id_accion, id_emergencia)
    resultado = 0
    # Further processing can be done here
    return jsonify({"resultado": resultado})

@app.route('/carros_mando2', methods=['POST'])
def carros_mando2():
    now = datetime.now()
    current_datetime = now.strftime("%d-%m-%Y %H:%M:%S")
    data = request.json # This converts the JSON payload into a Python dictionary
    print(data)
    id_emergencia = int(data['id'])
    coord = query_coord(id_emergencia)
    despacho = data['despacho']
    # You can now access data like a regular Python dictionary
    id_acciones2 = []
    last = last_action()
    for i in despacho:
        last = last
        id_acciones2.append(last)
    id_carro = carro_id(despacho[int(data['despachoIndex'])])[0]
    with open('../front/public/carros.json', 'r') as file:
        data_json = json.load(file)
    for item in data_json:
        if item['carro'] in despacho:  # Identify the entry by name or other property
            item['estado'] = 1  # Change status to the new value
            item['x'] = coord[0]  # Modify lat and lon as needed
            item['y'] = coord[1]
    with open('../front/public/carros.json', 'w') as file:
        json.dump(data_json, file, indent=4)
    del despacho[0]
    id_accion = id_acciones2[int(data['despachoIndex'])]
    del id_acciones2[0]
    id_estado_carro = estado_carro(coord[0], coord[1], 1, data['integerValue'], data['selectedId'], id_carro, id_accion, id_emergencia)
    # Further processing can be done here
    return jsonify({"resultado": 'Dotación registrada'})

@app.route('/api/fire-risk', methods=['GET'])
def get_fire_risk():
    # Replace with your actual coordinates and API key
    lat, lon = -33.04333216880508, -71.36532899755102
    data = get_climate_data(lat, lon)
    return jsonify(data)

@app.route('/emergencia_info/<int:id>', methods=['GET'])
def emergencia_info(id):
    data_emergencia = query_emergencias(id)
    data_acciones = query_acciones(id)
    # Further processing can be done here
    return jsonify({"data_e": data_emergencia, "data_a": data_acciones})

@app.route('/informacion', methods=['POST'])
def handle_info():
    data = request.json
    print(data)
    id_bombero = query_mando_emergencia(int(data['id']))
    a = acciones('Información', 0, data['info'], int(data['id']), None, id_bombero)
    # Process form1 data
    return jsonify({"message": "Form 1 received", "data": data})

@app.route('/externos', methods=['POST'])
def handle_externos():
    data = request.json
    print(data)
    id_bombero = query_mando_emergencia(int(data['id']))
    a = acciones('Recursos externos', 0, f'Solicitud de recursos externos: {data["externos"]}', int(data['id']), None, id_bombero)
    # Process form1 data
    return jsonify({"message": "Form 1 received", "data": data})

@app.route('/superacion', methods=['POST'])
def handle_superacion():
    data = request.json
    tipo = 'Superación'
    estado = data['estado']
    id_bombero = query_mando_emergencia(int(data['id']))
    info = 'Incidente Superado'
    id_carro = None
    id_emergencia = int(data['id'])
    if data['estado'] == 1:
        a = acciones(tipo, estado, info, id_emergencia, id_carro, id_bombero)
    # Process form1 data
    return jsonify({"message": "Form 1 received", "data": data})

@app.route('/evaluacion', methods=['POST'])
def handle_evaluacion():
    data = request.json
    print(data)
    id_bombero = query_mando_emergencia(int(data['id']))
    a = acciones('Evaluación', 0, data['evaluacion'], int(data['id']), None, id_bombero)
    # Process form1 data
    return jsonify({"message": "Form 1 received", "data": data})

@app.route('/evaluaciones/<int:id>', methods=['GET'])
def evaluaciones(id):
    eval = query_evaluaciones(id)
    # Further processing can be done here
    return jsonify({"evaluaciones": eval})

@app.route('/instrucciones', methods=['POST'])
def handle_instruccion():
    data = request.json
    print(data)
    id_bombero = query_mando_emergencia(int(data['id']))
    carros = ''
    for i in data['selectedItems']:
        carros = carros + 'U-' + str(i) + ' '
    a = acciones('Instrucciones', 0, f'Para {carros}: {data["text"]}', int(data['id']), None, id_bombero)
    # Process form1 data
    return jsonify({"message": "Form 1 received", "data": data})

@app.route('/carros/<int:id>', methods=['GET'])
def carros_emergencia(id):
    carros = query_carros_activos_emergencia(id)
    # Further processing can be done here
    return jsonify({"carros": carros})

@app.route('/desmov', methods=['POST'])
def handle_desmov():
    data = request.json
    print(data)
    for ca in range(len(data['carro'])):
        id_carro = carro_id(data['carro'][ca])
        if data['estado'][0] == 'En el lugar':
            estado = 2
            tipo = 'En el lugar'
            info = f'{data["carro"][ca]} en el lugar'
            id_bombero = query_mando_carro(id_carro)
        else:
            mando = query_mando_emergencia(int(data['id']))
            if mando != None:
                id_bombero = mando
            estado = 3
            tipo = 'Desmovilizado'
            info = f'{data["carro"][ca]} desmovilizado'
        x, y = query_coord(int(data['id']))[0], query_coord(int(data['id']))[1]
        with open('../front/public/carros.json', 'r') as file:
            data2 = json.load(file)
        for item in data2:
            if item['carro'] == int(data['carro'][ca]):  # Identify the entry by name or other property
                item['estado'] = estado  # Change status to the new value
                item['x'] = x  # Modify lat and lon as needed
                item['y'] = y
        with open('../front/public/carros.json', 'w') as file:
            json.dump(data2, file, indent=4)
        b = acciones(tipo, 0, info, int(data['id']), id_carro, id_bombero)
        mando = query_mando_emergencia(int(data['id']))
        if mando == None and data['estado'][0] == 'En el lugar':
            tipo2 = 'Asume como CI'
            bombero = query_bombero(id_bombero)
            c = acciones(tipo2, 0, bombero, int(data['id']), None, id_bombero)
        else:
            ci = query_clave_bombero(mando)
            ci_carro = query_clave_bombero(id_bombero)
            if int(ci_carro[-1]) < int(ci[-1]):
                tipo2 = 'Asume como CI'
                bombero = query_bombero(id_bombero)
                c = acciones(tipo2, 0, bombero, int(data['id']), None, id_bombero)
        a = estado_carro2(x, y, estado, None, None, id_carro, b)

    # Process form1 data
    return jsonify({"message": "Form 1 received", "data": data})

@app.route('/desp', methods=['POST'])
def handle_desp():
    data = request.json
    print(data)
    dataE = query_emergencias(int(data['id']))
    id_bombero = query_mando_emergencia(int(data['id']))
    desp = ''
    despacho = data['selectedDespacho']
    c = alert(despacho)
    id_emergencia = int(data['id'])
    id_accion = accion_carro_db(despacho, id_emergencia)
    id_acciones = []
    id = id_accion[0][0] - len(despacho) + 1
    for i in data['selectedDespacho']:
        desp = desp + 'U-' + str(i) + ' '
    resultado = f'Sale {desp}a Clave {dataE[0]} {dataE[1]} / {dataE[2]}'
    a = acciones('Despacho', 0, resultado, int(data['id']), None, id_bombero)
    # Process form1 data
    return jsonify({"resultado": resultado, "despacho": data['selectedDespacho'], "id": int(data['id']), 'acciones': id_acciones})

@app.route('/disponibles/<int:id>', methods=['GET'])
def carros_disponibles(id):
    coord = query_coord(id)
    bombas_d, forestal_d, rescate_d, aljibe_d, disponibles, carros_d = Disponibles()
    bombas, forestal, rescate, aljibe, carros = orden(bombas_d, forestal_d, rescate_d, aljibe_d, coord, disponibles, G)
    # Process form1 data
    return jsonify({"carros": carros})

@app.route('/api/estados', methods=['GET'])
def estados():
    estados = carros_estado()
    return jsonify({"estados": estados})

@app.route('/clave', methods=['POST'])
def handle_clave():
    data = request.json
    print(data)
    tipo = 'Cambio de clave'
    estado = 0
    info = data['clave']
    id_carro = None
    id_bombero = query_mando_emergencia(int(data['id']))
    id_emergencia = int(data['id'])
    a = acciones(tipo, estado, info, id_emergencia, id_carro, id_bombero)
    # Process form1 data
    return jsonify({"message": "Form 1 received", "data": data})

@app.route('/estado-carro', methods=['POST'])
def handle_estado_carro():
    data = request.json
    print(data)
    estado = int(data['button'])
    id_carro = carro_id(data['carro'])
    x, y = query_coord_carro(id_carro)
    with open('../front/public/carros.json', 'r') as file:
        data2 = json.load(file)
    for item in data2:
        if item['carro'] == int(data['carro']):  # Identify the entry by name or other property
            item['estado'] = estado  # Change status to the new value
            item['x'] = x  # Modify lat and lon as needed
            item['y'] = y
    with open('../front/public/carros.json', 'w') as file:
        json.dump(data2, file, indent=4)
    a = estado_carro2(x, y, estado, None, None, id_carro, None)
    return jsonify({"message": "Form 1 received", "data": data})

@app.route('/emergencias', methods=['GET'])
def emergencias():
    ids, texts, dates = query_emergencias_activas()
    return jsonify({"ids": ids, "texts": texts, "dates": dates})

@app.route('/historial', methods=['GET'])
def historial():
    ids, texts, dates = query_emergencias_totales()
    return jsonify({"ids": ids, "texts": texts, "dates": dates})

@app.route('/mando', methods=['POST'])
def handle_mando():
    data = request.json
    print(data)
    a = acciones('Asume como CI', 0, data['nombre'], int(data['id']), None, 1+int(data['id_bombero']))
    return jsonify({"message": "Form 1 received", "data": data})

if __name__ == '__main__':
    app.run(debug=True)
