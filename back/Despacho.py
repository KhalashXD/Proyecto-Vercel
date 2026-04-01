from Claves import C1, C2, C3, C4, C5, C6
from Coordenadas import Coordenadas
from Disponibles import Disponibles
from Orden import orden
from db import emergencias_db, accion_carro_db, acciones
from Bot import Telegram
from Alert import alert
import json
def Despacho(clave, calle, interseccion, G, direccion, informacion):
    partes = clave.split('-')
    clave_primaria = int(partes[0])
    clave_secundaria = int(partes[1])
    bombas_d, forestal_d, rescate_d, aljibe_d, disponibles, carros_d = Disponibles()
    coord = Coordenadas(calle, interseccion)
    error = 0
    error_r = 0
    error_f = 0
    bombas, forestal, rescate, aljibe, carros = orden(bombas_d, forestal_d, rescate_d, aljibe_d, coord, disponibles, G)
    if clave_primaria == 1:
        despacho, bombas, forestal, rescate, aljibe, error, no_disp = C1(clave_secundaria, bombas, forestal, rescate,
                                                                         aljibe)
    elif clave_primaria == 2:
        despacho, bombas, forestal, rescate, aljibe, error_f, no_disp = C2(clave_secundaria, bombas, forestal, rescate,
                                                                         aljibe)
    elif clave_primaria == 3:
        despacho, bombas, forestal, rescate, aljibe, error, no_disp = C3(clave_secundaria, bombas, forestal, rescate,
                                                                         aljibe)
    elif clave_primaria == 4:
        despacho, bombas, forestal, rescate, aljibe, error, error_r, no_disp = C4(clave_secundaria, bombas, forestal,
                                                                                  rescate, aljibe)
    elif clave_primaria == 5:
        despacho, bombas, forestal, rescate, aljibe, error, no_disp = C5(clave_secundaria, bombas, forestal, rescate,
                                                                         aljibe)
    elif clave_primaria == 6:
        despacho, bombas, forestal, rescate, aljibe, error, no_disp = C6(clave_secundaria, bombas, forestal, rescate,
                                                                         aljibe)
    desp = ''
    from datetime import datetime
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    current_datetime = now.strftime("%d-%m-%Y %H:%M:%S")
    tipo = 'Clave inicial'
    estado = 0
    id_carro = None
    id_bombero = 1
    info = clave
    if error == 0 and error_r == 0 and error_f==0:
        for i in despacho:
            desp = desp + 'U-' + str(i) + ' '
        desp = desp + 'Clave ' + clave + ' ' + calle + ' con ' + interseccion
    else:
        for i in despacho:
            desp = desp + 'U-' + str(i) + ' '
        err = error + error_r + error_f
        desp = desp + f'{err} Externos '+ 'Clave ' + clave + ' ' + calle + ' con ' + interseccion
    id_emergencia = emergencias_db(clave, calle, interseccion, current_datetime, coord[0], coord[1])
    b = acciones('Despacho', 0, desp, id_emergencia, None, 1)
    a = acciones(tipo, estado, info, id_emergencia, id_carro, id_bombero)
    desp = desp + ' ' + current_time
    id_accion = accion_carro_db(despacho, id_emergencia)
    id_acciones = []
    id = id_accion[0][0] - len(despacho) + 1
    if direccion != '':
        a = acciones('Dirección exacta', 0, direccion, id_emergencia, None, 1)
    if informacion != '':
        b = acciones('Información inicial', 0, informacion, id_emergencia, None, 1)
    c = alert(despacho)
    d = Telegram(desp)
    for i in despacho:
        id_acciones.append(id)
        id = id + 1
    with open('../front/public/carros.json', 'r') as file:
        data = json.load(file)
    for item in data:
        if item['carro'] in despacho:  # Identify the entry by name or other property
            item['estado'] = 1  # Change status to the new value
            item['x'] = coord[0]  # Modify lat and lon as needed
            item['y'] = coord[1]
            item['calle'] = calle
            item['interseccion'] = interseccion
    with open('../front/public/carros.json', 'w') as file:
        json.dump(data, file, indent=4)

    return despacho, desp, id_accion, coord, id_emergencia, id_acciones