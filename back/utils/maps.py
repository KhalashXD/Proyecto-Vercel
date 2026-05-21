

# utils/maps.py

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

geolocator = Nominatim(
    user_agent="emergency_management"
)

"""
def obtener_coordenadas(calle_1, calle_2):
    
    #Obtiene coordenadas aproximadas de una intersección: FUNCIONA AUNQUE NO ENCUENTRE ESQUINA
    

    busquedas = [
        f"{calle_1} y {calle_2}, Villa Alemana, Chile",
        f"{calle_1} esquina {calle_2}, Villa Alemana, Chile",
        f"{calle_1}, Villa Alemana, Chile",
        f"{calle_2}, Villa Alemana, Chile",
    ]

    for direccion in busquedas:

        print(f"Buscando: {direccion}")

        location = geolocator.geocode(
            direccion,
            timeout=10
        )

        if location:
            print("Encontrado:", location.address)

            return {
                "latitude": location.latitude,
                "longitude": location.longitude
            }

    raise Exception(
        f"No se encontraron coordenadas para "
        f"{calle_1} y {calle_2}"
    )


def calcular_distancia(lat1, lng1, lat2, lng2):

    return geodesic(
        (lat1, lng1),
        (lat2, lng2)
    ).km
#OTRA FUNCION
def obtener_coordenadas(calle_1, calle_2):
    
    #Obtiene coordenadas de una intersección de calles: NO FUNCIONA SI NO ENCUENTRA LA ESQUINA
    

    busquedas = [
        f"intersección de {calle_1} con {calle_2}, Villa Alemana, Chile",
        f"{calle_1} y {calle_2}, Villa Alemana, Chile",
        f"{calle_1} esquina {calle_2}, Villa Alemana, Chile",
        f"{calle_1} con {calle_2}, Villa Alemana, Chile",
    ]

    for direccion in busquedas:

        print(f"Buscando: {direccion}")

        try:
            location = geolocator.geocode(
                direccion,
                timeout=10
            )

            if location:
                print("Encontrado:", location.address)

                return {
                    "latitude": location.latitude,
                    "longitude": location.longitude
                }

        except Exception as e:
            print("Error geocoding:", e)

    raise Exception(
        f"No se encontró la intersección entre "
        f"{calle_1} y {calle_2}"
    )
"""
# utils/maps.py

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

geolocator = Nominatim(
    user_agent="emergency_management"
)


def obtener_coordenadas(calle_1, calle_2):
    """
    Obtiene coordenadas de una intersección.
    Si no existe, usa una aproximación.
    """

    # 1. Buscar intersección exacta
    busquedas_interseccion = [
        f"intersección de {calle_1} con {calle_2}, Villa Alemana, Chile",
        f"{calle_1} y {calle_2}, Villa Alemana, Chile",
        f"{calle_1} esquina {calle_2}, Villa Alemana, Chile",
        f"{calle_1} con {calle_2}, Villa Alemana, Chile",
    ]

    for direccion in busquedas_interseccion:

        print(f"Buscando: {direccion}")

        location = geolocator.geocode(
            direccion,
            timeout=10
        )

        if location:
            print("Intersección encontrada:")
            print(location.address)

            return {
                "latitude": location.latitude,
                "longitude": location.longitude
            }

    print("No se encontró intersección exacta.")
    print("Intentando aproximación...")

    # 2. Fallback: buscar calle individual
    busquedas_aproximadas = [
        f"{calle_1}, Villa Alemana, Chile",
        f"{calle_2}, Villa Alemana, Chile",
    ]

    for direccion in busquedas_aproximadas:

        print(f"Buscando aproximación: {direccion}")

        location = geolocator.geocode(
            direccion,
            timeout=10
        )

        if location:
            print("Ubicación aproximada encontrada:")
            print(location.address)

            return {
                "latitude": location.latitude,
                "longitude": location.longitude
            }

    raise Exception(
        f"No se encontraron coordenadas para "
        f"{calle_1} y {calle_2}"
    )


def calcular_distancia(lat1, lng1, lat2, lng2):

    return geodesic(
        (lat1, lng1),
        (lat2, lng2)
    ).km