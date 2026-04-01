import osmnx as ox
import networkx as nx

def distancia(G, destino, origen):
    destino_nodo = ox.distance.nearest_nodes(G, X=destino[1], Y=destino[0])
    origen_nodo = ox.distance.nearest_nodes(G, X=origen[1], Y=origen[0])
    largo = nx.shortest_path_length(G, origen_nodo, destino_nodo, weight='length')
    return largo


def orden(bombas_d, forestal_d, rescate_d, aljibe_d, coord, disponibles, G):
    c_bombas = {}
    c_forestal = {}
    c_rescate = {}
    c_aljibe = {}
    for i in bombas_d:
        c = disponibles[disponibles['carro'] == i]
        x = (float(c.iloc[0]['x']), float(c.iloc[0]['y']))
        c_bombas[i] = x
    for i in forestal_d:
        c = disponibles[disponibles['carro'] == i]
        x = (float(c.iloc[0]['x']), float(c.iloc[0]['y']))
        c_forestal[i] = x
    for i in rescate_d:
        c = disponibles[disponibles['carro'] == i]
        x = (float(c.iloc[0]['x']), float(c.iloc[0]['y']))
        c_rescate[i] = x
    for i in aljibe_d:
        c = disponibles[disponibles['carro'] == i]
        x = (float(c.iloc[0]['x']), float(c.iloc[0]['y']))
        c_aljibe[i] = x
    bombas_o = sorted(c_bombas.keys(), key=lambda name: distancia(G, c_bombas[name], coord))
    forestal_o = sorted(c_forestal.keys(), key=lambda name: distancia(G, c_forestal[name], coord))
    rescate_o = sorted(c_rescate.keys(), key=lambda name: distancia(G, c_rescate[name], coord))
    aljibe_o = sorted(c_aljibe.keys(), key=lambda name: distancia(G, c_aljibe[name], coord))
    c_carros = {**c_bombas, **c_forestal, **c_rescate, **c_aljibe}
    carros = sorted(c_carros.keys(), key=lambda name: distancia(G, c_carros[name], coord))

    return bombas_o, forestal_o, rescate_o, aljibe_o, carros

