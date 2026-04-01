import pandas as pd
import ast
from datetime import datetime
import random
from gtts import gTTS
import pygame
import io
import re
from num2words import num2words

def Sectores(sector):
    secA = [1, 2]
    secC = [4, 5, 9]
    secD = [6, 10]
    secF = [8, 11]
    random.shuffle(secA)
    random.shuffle(secC)
    random.shuffle(secD)
    random.shuffle(secF)
    if (sector == 1):
        companias = [secA[0], secA[1], secF[0], secF[1], secC[0], secC[1], secC[2], 3, secD[0], secD[1], 7, 12, 15, 14, 16, 13]
        rescate = [2, 8, 12, 14, 13]
        hazmat = [11, 7]
        escalas = [9]
        mecanica = [8, 9, 10]
    elif (sector == 2):
        companias = [3, secC[0], secC[1], secC[2], secD[0], secD[1], 7, secF[0], secF[1], secA[0], secA[1], 15, 14, 12, 16, 13]
        rescate = [8, 2, 14, 12, 13]
        hazmat = [7, 11]
        escalas = [9]
        mecanica = [9, 10, 8]
    elif (sector == 3):
        companias = [secC[0], secC[1], secC[2], 3, 7, secD[0], secD[1], secF[0], secF[1], secA[0], secA[1], 15, 14, 12, 16, 13]
        rescate = [8, 2, 14, 12, 13]
        hazmat = [7, 11]
        escalas = [9]
        mecanica = [9, 10, 8]
    elif (sector == 4):
        companias = [secD[0], secD[1], secC[0], secC[1], secC[2], 3, 7, secF[0], secF[1], secA[0], secA[1], 15, 14, 13, 12, 16]
        rescate = [8, 2, 14, 13, 12]
        hazmat = [7, 11]
        escalas = [9]
        mecanica = [10, 9, 8]
    elif (sector == 5):
        companias = [7, secC[0], secC[1], secC[2], 3, secD[0], secD[1], 15, secF[0], secF[1], secA[0], secA[1], 14, 12, 13, 16]
        rescate = [8, 2, 14, 12, 13]
        hazmat = [7, 11]
        escalas = [9]
        mecanica = [9, 10, 8]
    elif (sector == 6):
        companias = [secF[0], secF[1], secA[0], secA[1], secC[0], secC[1], secC[2], 3, secD[0], secD[1], 7, 12, 16, 15, 14, 13]
        rescate = [8, 2, 12, 14, 13]
        hazmat = [11, 7]
        escalas = [9]
        mecanica = [8, 9, 10]
    elif (sector ==7):
        companias = [12, secA[0], secA[1], secF[0], secF[1], 3, secC[0], secC[1], secC[2], secD[0], secD[1], 7, 16, 15, 14, 13]
        rescate = [12, 2, 8, 14, 13]
        hazmat = [11, 7]
        escalas = [9]
        mecanica = [8, 9, 10]
    elif (sector == 8):
        companias = [13, 15, 14, secD[0], secD[1], 7, 3, secC[0], secC[1], secC[2], secF[0], secF[1], secA[0], secA[1], 12, 16]
        rescate = [13, 14, 8, 2, 12]
        hazmat = [7, 11]
        escalas = [9]
        mecanica = [10, 9, 8]
    elif (sector == 9):
        companias = [14, 15, 7, secD[0], secD[1], secC[0], secC[1], secC[2], 3, secF[0], secF[1], secA[0], secA[1], 13, 12, 16]
        rescate = [14, 8, 2, 13, 12]
        hazmat = [7, 11]
        escalas = [9]
        mecanica = [10, 9, 8]
    elif (sector == 10):
        companias = [15, 14, 7, secC[0], secC[1], secC[2], secD[0], secD[1], 3, secF[0], secF[1], 13, secA[0], secA[1], 16, 12]
        rescate = [14, 8, 13, 2, 12]
        hazmat = [7, 11]
        escalas = [9]
        mecanica = [9, 10, 8]
    elif (sector == 11):
        companias = [16, secF[0], secF[1], 13, 3, secD[0], secD[1], secC[0], secC[1], secC[2], secA[0], secA[1], 12, 7, 15, 14]
        rescate = [8, 13, 2, 12, 14]
        hazmat = [11, 7]
        escalas = [9]
        mecanica = [8, 10, 9]
    return companias, rescate, hazmat, escalas, mecanica

def Uno(e, bombas, mecanica, escalas, rescate, forestal, hazmat):
    carros = []
    if (e==1):
        for j in range(4):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if len(i)==2:
                    if i[:1] == bombas[0][:1]:
                        bombas.remove(i)
                if len(i)==3:
                    if i[:2] == bombas[0][:2]:
                        bombas.remove(i)
        carros.append(escalas[0])
    elif (e==2):
        for j in range(5):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if len(i) == 2:
                    if i[:1] == bombas[0][:1]:
                        bombas.remove(i)
                if len(i) == 3:
                    if i[:2] == bombas[0][:2]:
                        bombas.remove(i)
            for i in reversed(rescate):
                if len(i) == 2:
                    if i[:1] == bombas[0][:1]:
                        rescate.remove(i)
                if len(i) == 3:
                    if i[:2] == bombas[0][:2]:
                        rescate.remove(i)
        carros.append(escalas[0])
        carros.append(rescate[0])
    elif (e==3):
        for j in range(4):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if len(i) == 2:
                    if i[:1] == bombas[0][:1]:
                        bombas.remove(i)
                if len(i) == 3:
                    if i[:2] == bombas[0][:2]:
                        bombas.remove(i)
            for i in reversed(mecanica):
                if len(i) == 2:
                    if i[:1] == bombas[0][:1]:
                        mecanica.remove(i)
                if len(i) == 3:
                    if i[:2] == bombas[0][:2]:
                        mecanica.remove(i)
            for i in reversed(rescate):
                if len(i) == 2:
                    if i[:1] == bombas[0][:1]:
                        rescate.remove(i)
                if len(i) == 3:
                    if i[:2] == bombas[0][:2]:
                        rescate.remove(i)
        carros.append(mecanica[0])
        carros.append(escalas[0])
        carros.append(rescate[0])
    elif (e==4):
        for j in range(5):
            carros.append(bombas[0])
            for i in reversed(rescate):
                if len(i) == 2:
                    if i[:1] == bombas[0][:1]:
                        rescate.remove(i)
                if len(i) == 3:
                    if i[:2] == bombas[0][:2]:
                        rescate.remove(i)
            for i in reversed(mecanica):
                if len(i) == 2:
                    if i[:1] == bombas[0][:1]:
                        mecanica.remove(i)
                if len(i) == 3:
                    if i[:2] == bombas[0][:2]:
                        mecanica.remove(i)
            for i in reversed(bombas):
                if len(i) == 2:
                    if i[:1] == bombas[0][:1]:
                        bombas.remove(i)
                if len(i) == 3:
                    if i[:2] == bombas[0][:2]:
                        bombas.remove(i)
        carros.append(mecanica[0])
        carros.append(escalas[0])
        carros.append(rescate[0])
        for i in reversed(rescate):
            if i[:2] == rescate[0][:2]:
                rescate.remove(i)
        carros.append(rescate[0])

    return carros

def Dos(e, bombas, mecanica, escalas, rescate, forestal, hazmat):
    carros = []
    if (e == 1):
        carros.append(forestal[0])
        for i in reversed(bombas):
            if i[:2] == forestal[0][:2]:
                bombas.remove(i)
        carros.append(bombas[0])
    elif (e == 2):
        for i in range(3):
            carros.append(forestal[0])
            for i in reversed(forestal):
                if i[:2] == forestal[0][:2]:
                    forestal.remove(i)
    elif (e == 3):
        carros.append(bombas[0])

    return carros

def Tres(e, bombas, mecanica, escalas, rescate, forestal, hazmat):
    carros = []
    if (e == 1):
        carros.append(bombas[0])
    elif (e == 2):
        for i in range(2):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)
    elif (e == 3):
        carros.append(hazmat[0])
        for i in reversed(bombas):
            if i[:2] == hazmat[0][:2]:
                bombas.remove(i)
        for i in range(2):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)

    return carros

def Cuatro(e, bombas, mecanica, escalas, rescate, forestal, hazmat):
    carros = []
    if (e == 1):
        carros.append(bombas[0])
    elif (e == 2):
        carros.append(hazmat[0])
        for i in reversed(bombas):
            if i[:2] == hazmat[0][:2]:
                bombas.remove(i)
        carros.append(bombas[0])
    elif (e == 3):
        for i in range(2):
            carros.append(hazmat[0])
            for i in reversed(hazmat):
                if i[:2] == hazmat[0][:2]:
                    hazmat.remove(i)
            for i in reversed(rescate):
                if i[:2] == hazmat[0][:2]:
                    rescate.remove(i)
            for i in reversed(bombas):
                if i[:2] == hazmat[0][:2]:
                    bombas.remove(i)
        carros.append(rescate[0])
        carros.append(bombas[0])
    elif (e == 4):
        for i in range(2):
            carros.append(hazmat[0])
            for i in reversed(hazmat):
                if i[:2] == hazmat[0][:2]:
                    hazmat.remove(i)
            for i in reversed(rescate):
                if i[:2] == hazmat[0][:2]:
                    rescate.remove(i)
            for i in reversed(bombas):
                if i[:2] == hazmat[0][:2]:
                    bombas.remove(i)
        carros.append(rescate[0])
        for i in reversed(bombas):
            if i[:2] == rescate[0][:2]:
                bombas.remove(i)
        for i in range(2):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)

    return carros

def Cinco(e, bombas, mecanica, escalas, rescate, forestal, hazmat):
    carros = []
    if (e == 1):
        carros.append(rescate[0])
        for i in reversed(bombas):
            if i[:2] == bombas[0][:2]:
                bombas.remove(i)
        carros.append(bombas[0])
    elif (e == 2):
        for i in range(2):
            carros.append(rescate[0])
            for i in reversed(rescate):
                if i[:2] == rescate[0][:2]:
                    rescate.remove(i)
            for i in reversed(bombas):
                if i[:2] == rescate[0][:2]:
                    bombas.remove(i)
        carros.append(bombas[0])
    elif (e == 3):
        for i in range(2):
            carros.append(rescate[0])
            for i in reversed(rescate):
                if i[:2] == rescate[0][:2]:
                    rescate.remove(i)
            for i in reversed(hazmat):
                if i[:2] == rescate[0][:2]:
                    hazmat.remove(i)
            for i in reversed(bombas):
                if i[:2] == rescate[0][:2]:
                    bombas.remove(i)
        carros.append(hazmat[0])
        for i in range(2):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)

    return carros

def Seis(e, bombas, mecanica, escalas, rescate, forestal, hazmat):
    carros = []
    if (e == 1):
        carros.append(rescate[0])
    elif (e == 2):
        carros.append(rescate[0])
    elif (e == 3):
        carros.append(rescate[0])
        for i in reversed(mecanica):
            if i[:2] == rescate[0][:2]:
                mecanica.remove(i)
        carros.append(mecanica[0])
    elif (e == 4):
        carros.append(rescate[0])
        for i in reversed(hazmat):
            if i[:2] == rescate[0][:2]:
                hazmat.remove(i)
        carros.append(hazmat[0])
    elif (e == 5):
        carros.append(rescate[0])
    elif (e == 6):
        carros.append(rescate[0])

    return carros

def Nueve(e, bombas, mecanica, escalas, rescate, forestal, hazmat):
    carros = []
    if (e==1):
        carros.append(hazmat[0])
        for i in reversed(bombas):
            if i[:2] == hazmat[0][:2]:
                bombas.remove(i)
        for i in range(3):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)
        carros.append(escalas[0])
    elif (e==2):
        for i in range(2):
            carros.append(rescate[0])
            for i in reversed(rescate):
                if i[:2] == rescate[0][:2]:
                    rescate.remove(i)
            for i in reversed(bombas):
                if i[:2] == rescate[0][:2]:
                    bombas.remove(i)
        for i in range(2):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)
    elif (e==3):
        for i in range(2):
            carros.append(rescate[0])
            for i in reversed(rescate):
                if i[:2] == rescate[0][:2]:
                    rescate.remove(i)
            for i in reversed(bombas):
                if i[:2] == rescate[0][:2]:
                    bombas.remove(i)
            for i in reversed(hazmat):
                if i[:2] == rescate[0][:2]:
                    hazmat.remove(i)
        carros.append(hazmat[0])
        for i in reversed(bombas):
            if i[:2] == hazmat[0][:2]:
                bombas.remove(i)
        for i in range(4):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)
    elif (e==4):
        for i in range(2):
            carros.append(rescate[0])
            for i in reversed(rescate):
                if i[:2] == rescate[0][:2]:
                    rescate.remove(i)
            for i in reversed(hazmat):
                if i[:2] == rescate[0][:2]:
                    hazmat.remove(i)
            for i in reversed(bombas):
                if i[:2] == rescate[0][:2]:
                    bombas.remove(i)
        carros.append(hazmat[0])
        for i in reversed(bombas):
            if i[:2] == hazmat[0][:2]:
                bombas.remove(i)
        for i in range(4):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)
    elif (e==5):
        for i in range(4):
            carros.append(bombas[0])
            for i in reversed(bombas):
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)

    return carros

def DiezOnceDoceTreceQuince(e, bombas, mecanica, escalas, rescate, forestal, hazmat):
    carros = []
    if (e == 1):
        carros.append(bombas[0])
    elif (e == 2):
        carros.append(bombas[0])
    elif (e == 3):
        carros.append(bombas[0])
    elif (e == 4):
        carros.append(bombas[0])
    elif (e == 5):
        carros = []

    return carros

def Ocho(e, bombas, mecanica, escalas, rescate, forestal, hazmat):#32
    if (e == 1 or e == 2 or e == 3 or e == 4):
        carros = Uno(e, bombas, mecanica, escalas, rescate, forestal, hazmat)
    elif (e == 5 or e == 6 or e == 7):
        e = e - 4
        carros = Dos(e, bombas, mecanica, escalas, rescate, forestal, hazmat)
    elif (e == 8 or e == 9 or e == 10):
        e = e - 7
        carros = Tres(e, bombas, mecanica, escalas, rescate, forestal, hazmat)
    elif (e == 11 or e == 12 or e == 13 or e == 14):
        e = e - 10
        carros = Cuatro(e, bombas, mecanica, escalas, rescate, forestal, hazmat)
    elif (e == 15 or e == 16 or e == 17):
        e = e - 14
        carros = Cinco(e, bombas, mecanica, escalas, rescate, forestal, hazmat)
    elif (e == 18 or e == 19 or e == 20 or e == 21 or e == 22 or e == 23):
        e = e - 17
        carros = Seis(e, bombas, mecanica, escalas, rescate, forestal, hazmat)
    elif (e == 24 or e == 25 or e == 26 or e == 27 or e == 28):
        e = e - 23
        carros = Nueve(e, bombas, mecanica, escalas, rescate, forestal, hazmat)
    elif (e == 29 or e == 30 or e == 31 or e == 32):
        e = e - 28
        carros = DiezOnceDoceTreceQuince(e, bombas, mecanica, escalas, rescate, forestal, hazmat)

    return carros

def Extra(e, bombas):
    carros = []
    for j in range(e):
        carros.append(bombas[0])
        for i in reversed(bombas):
            if len(i)==2:
                if i[:1] == bombas[0][:1]:
                    bombas.remove(i)
            if len(i)==3:
                if i[:2] == bombas[0][:2]:
                    bombas.remove(i)

    return carros

def Carros_Sector(companias, rescate, hazmat, escalas, mecanica, Disponibles):
    bombas_F = []
    rescate_F = []
    hazmat_F = []
    mecanica_F = []
    escalas_F = []
    forestal_F = []

    bombas_F.append(Disponibles[0][companias[0]][0])
    bombas_F.append(Disponibles[0][companias[1]][0])
    bombas_F.append(Disponibles[0][companias[2]][0])
    bombas_F.append(Disponibles[0][companias[3]][0])
    bombas_F.append(Disponibles[0][companias[4]][0])
    bombas_F.append(Disponibles[0][companias[0]][1])
    bombas_F.append(Disponibles[0][companias[1]][1])
    bombas_F.append(Disponibles[0][companias[2]][1])
    bombas_F.append(Disponibles[0][companias[3]][1])
    bombas_F.append(Disponibles[0][companias[4]][1])
    bombas_F.append(Disponibles[0][companias[5]][0])
    bombas_F.append(Disponibles[0][companias[6]][0])
    bombas_F.append(Disponibles[0][companias[7]][0])
    bombas_F.append(Disponibles[0][companias[8]][0])
    bombas_F.append(Disponibles[0][companias[9]][0])
    bombas_F.append(Disponibles[0][companias[5]][1])
    bombas_F.append(Disponibles[0][companias[6]][1])
    bombas_F.append(Disponibles[0][companias[7]][1])
    bombas_F.append(Disponibles[0][companias[8]][1])
    bombas_F.append(Disponibles[0][companias[9]][1])
    bombas_F.append(Disponibles[0][companias[10]][0])
    bombas_F.append(Disponibles[0][companias[11]][0])
    bombas_F.append(Disponibles[0][companias[12]][0])
    bombas_F.append(Disponibles[0][companias[13]][0])
    bombas_F.append(Disponibles[0][companias[14]][0])
    bombas_F.append(Disponibles[0][companias[15]][0])
    bombas_F.append(Disponibles[0][companias[10]][1])
    bombas_F.append(Disponibles[0][companias[11]][1])
    bombas_F.append(Disponibles[0][companias[12]][1])
    bombas_F.append(Disponibles[0][companias[13]][1])
    bombas_F.append(Disponibles[0][companias[14]][1])
    bombas_F.append(Disponibles[0][companias[15]][1])

    rescate_F.append(Disponibles[1][rescate[0]][0])
    rescate_F.append(Disponibles[1][rescate[1]][0])
    rescate_F.append(Disponibles[1][rescate[2]][0])
    rescate_F.append(Disponibles[1][rescate[3]][0])
    rescate_F.append(Disponibles[1][rescate[4]][0])

    hazmat_F.append(Disponibles[2][hazmat[0]][0])
    hazmat_F.append(Disponibles[2][hazmat[1]][0])

    mecanica_F.append(Disponibles[3][mecanica[0]][0])
    mecanica_F.append(Disponibles[3][mecanica[1]][0])
    mecanica_F.append(Disponibles[3][mecanica[2]][0])

    escalas_F.append(Disponibles[4][9][0])

    forestal_F.append(Disponibles[5][companias[0]][0])
    forestal_F.append(Disponibles[5][companias[1]][0])
    forestal_F.append(Disponibles[5][companias[2]][0])
    forestal_F.append(Disponibles[5][companias[3]][0])
    forestal_F.append(Disponibles[5][companias[4]][0])
    forestal_F.append(Disponibles[5][companias[0]][1])
    forestal_F.append(Disponibles[5][companias[1]][1])
    forestal_F.append(Disponibles[5][companias[2]][1])
    forestal_F.append(Disponibles[5][companias[3]][1])
    forestal_F.append(Disponibles[5][companias[4]][1])
    forestal_F.append(Disponibles[5][companias[5]][0])
    forestal_F.append(Disponibles[5][companias[6]][0])
    forestal_F.append(Disponibles[5][companias[7]][0])
    forestal_F.append(Disponibles[5][companias[8]][0])
    forestal_F.append(Disponibles[5][companias[9]][0])
    forestal_F.append(Disponibles[5][companias[5]][1])
    forestal_F.append(Disponibles[5][companias[6]][1])
    forestal_F.append(Disponibles[5][companias[7]][1])
    forestal_F.append(Disponibles[5][companias[8]][1])
    forestal_F.append(Disponibles[5][companias[9]][1])
    forestal_F.append(Disponibles[5][companias[10]][0])
    forestal_F.append(Disponibles[5][companias[11]][0])
    forestal_F.append(Disponibles[5][companias[12]][0])
    forestal_F.append(Disponibles[5][companias[13]][0])
    forestal_F.append(Disponibles[5][companias[14]][0])
    forestal_F.append(Disponibles[5][companias[15]][0])
    forestal_F.append(Disponibles[5][companias[10]][1])
    forestal_F.append(Disponibles[5][companias[11]][1])
    forestal_F.append(Disponibles[5][companias[12]][1])
    forestal_F.append(Disponibles[5][companias[13]][1])
    forestal_F.append(Disponibles[5][companias[14]][1])
    forestal_F.append(Disponibles[5][companias[15]][1])

    bombas_F = [value for value in bombas_F if value != 0]
    rescate_F = [value for value in rescate_F if value != 0]
    hazmat_F = [value for value in hazmat_F if value != 0]
    mecanica_F = [value for value in mecanica_F if value != 0]
    escalas_F = [value for value in escalas_F if value != 0]
    forestal_F = [value for value in forestal_F if value != 0]

    return bombas_F, rescate_F, hazmat_F, mecanica_F, escalas_F, forestal_F

def Sector(X, Y):
    #import matplotlib.pyplot as plt
    from shapely.geometry import Polygon, Point

    # Define specific polygons
    # These are example coordinates, modify them as needed
    polygons = [
        [(-33.05801717935223, -71.6380986410349), (-33.053832094989836, -71.63731971872451),
         (-33.03928356770423, -71.62527418874198), (-33.02761645735469, -71.62801946596191),
         (-33.01981586380234, -71.633699576608), (-33.01918217101339, -71.63705033177183),
         (-33.04469223831729, -71.6372872375136), (-33.04591440274276, -71.6367254342526),
         (-33.04814093603491, -71.63889739322984), (-33.047899874342264, -71.64012132176273),
         (-33.05246328818639, -71.64313352632685), (-33.0568688358488, -71.64263422348324)],  #A
        [(-33.063582576132944, -71.62981218122178), (-33.06322532493337, -71.62623320701721),
         (-33.062436390064, -71.62538952823449), (-33.055232521279954, -71.62262870982342),
         (-33.04703482757988, -71.6138293240225), (-33.04629041270999, -71.6138382048518),
         (-33.04441445930689, -71.61941536577022), (-33.05542940731732, -71.62523286355267),
         (-33.05740188828857, -71.6256413817882)],  #B
        [(-33.04440531456661, -71.61945602422335), (-33.046264560542454, -71.61388591627916),
         (-33.04201479776171, -71.60908294884278), (-33.04276970480697, -71.61910580774835)],  #C
        [(-33.07987020760141, -71.63949954738526), (-33.0974639804976, -71.62015808917052),
         (-33.08923822078768, -71.60457431666491), (-33.06755915122975, -71.59934961085722),
         (-33.05993863674681, -71.60331837760776), (-33.05998074084935, -71.60321790250016),
         (-33.05585444308147, -71.60296671473114), (-33.053243828169215, -71.6078397575865),
         (-33.04713805587706, -71.61376778893545), (-33.05505442407803, -71.62265983595884),
         (-33.06233853840011, -71.62542290214765), (-33.063180593665514, -71.62632717811613),
         (-33.06334900375187, -71.62989404443624)], #D
        [(-33.04701410618245, -71.6138173303533), (-33.052124945768746, -71.60945797036071),
         (-33.05591011940887, -71.60294742283801), (-33.05287721724156, -71.60182196719354),
         (-33.05138460887833, -71.59438541182732), (-33.049665092723956, -71.59251914988904),
         (-33.04580800031319, -71.59317447850017), (-33.044339156029096, -71.59169286600428),
         (-33.0398110978546, -71.59680719425575), (-33.03491452158834, -71.59915782952643),
         (-33.04199611114421, -71.60903302463916), (-33.04622356289955, -71.61383401897686)], #E
        [(-33.078427958787024, -71.64185761097303), (-33.07993714215217, -71.63947280398278),
         (-33.05740820645373, -71.62557040676462), (-33.05532555242387, -71.62538696003868),
         (-33.04432106405859, -71.61951523568993), (-33.04275535110365, -71.61903160350309),
         (-33.039288316192504, -71.62531882203001), (-33.05371897191708, -71.63734488549625)], #F
        [(-33.05783782841109, -71.66257036621087), (-33.07031898750872, -71.64038942751677),
         (-33.058016524324195, -71.6380817491446), (-33.056771519728606, -71.64269811669193),
         (-33.05248090742452, -71.64322374271698), (-33.04790274674031, -71.64009283994461),
         (-33.048228397758145, -71.6388130548728), (-33.04587218921053, -71.63675625745071),
         (-33.04466532619455, -71.63728188351944), (-33.01913769469887, -71.6370483822881),
         (-33.017872978022424, -71.6397679257655), (-33.02113054470933, -71.65034900583686),
         (-33.02989586485687, -71.65801532974706)], #G
        [(-33.19770372106113, -71.70934801339983), (-33.23214171881977, -71.68286435811187),
         (-33.144601427722186, -71.5313993963514), (-33.083505022610275, -71.55379700249873),
         (-33.08566059742688, -71.60343494100849), (-33.10898814842843, -71.60146758375852),
         (-33.171646152934336, -71.68648715219149)], #H
        [(-33.034955967283096, -71.59898641533795), (-33.044178902503106, -71.591601493665),
         (-33.05171656624332, -71.57718331315093), (-33.05411669244847, -71.57532452330855),
         (-33.06321131357, -71.55723900169733), (-33.05137970120999, -71.55472712356703),
         (-33.027374749758906, -71.58592464898257)], #I
        [(-33.08603344526048, -71.60370092943407), (-33.08465378202086, -71.58223561184259),
         (-33.08376684419872, -71.55359558589558), (-33.063414091353735, -71.55706532220323),
         (-33.052028295234166, -71.57717803058979), (-33.04438764978285, -71.59164506698347),
         (-33.04566935268388, -71.593232912357), (-33.04941576191042, -71.5924683942142),
         (-33.04961293692859, -71.59270363056582), (-33.05020445933417, -71.5924683942142),
         (-33.052915552851765, -71.6016426119278), (-33.05991471764577, -71.6031128393087),
         (-33.06006258157666, -71.60323045800146), (-33.06735688099051, -71.5996431036391)], #J
        [(-33.096668383896386, -71.74821740206261), (-33.17169075066734, -71.68707799218627),
         (-33.109725868682, -71.60202762217332), (-33.10896529146172, -71.60187628667326),
         (-33.09311844054936, -71.59945492390408), (-33.089187979376845, -71.6046003197886),
         (-33.097048726007834, -71.62049051296138), (-33.078410007080436, -71.64167743719175),
         (-33.0702939563204, -71.64092076132638), (-33.05773796556904, -71.6630156965952)], #K
        ]

    # Plot the polygons
    #fig, ax = plt.subplots()

    for poly_coords in polygons:
        poly = Polygon(poly_coords)
        x, y = poly.exterior.xy
        #ax.fill(x, y, alpha=0.5)



    import random


    # Modified function to classify a point
    def classify_point(point, polygons):
        user_point = Point(point)
        min_distance = None
        closest_polygons = []

        # Check if the point is within any polygon
        for i, poly_coords in enumerate(polygons):
            poly = Polygon(poly_coords)
            if user_point.within(poly):
                return i

            # Calculate distance to each polygon
            distance = user_point.distance(poly)
            if min_distance is None or distance < min_distance:
                min_distance = distance
                closest_polygons = [i]
            elif distance == min_distance:
                closest_polygons.append(i)

        # Return a random closest polygon if the point is not within any polygon
        return random.choice(closest_polygons) if closest_polygons else None


    # Example user input (replace this with actual input in your application)
    user_input = (X, Y)  # Example coordinates outside the polygons

    # Classify the user input
    polygon_index = classify_point(user_input, polygons) + 1
    return polygon_index

def CarrosDisponibles(EnServicio, CarrosNoDisponibles):
    new_EnServicio = []
    for category in EnServicio:
        new_category = []
        for car_entry in category:
            new_car_entry = [item for item in car_entry if not (isinstance(item, str) and item in CarrosNoDisponibles)]
            if new_car_entry:  # Check if new_car_entry is not empty
                new_category.append(new_car_entry)
        new_EnServicio.append(new_category)
    return new_EnServicio

def replace_numbers_with_words(text):
    # Encuentra todos los números en el texto y reemplázalos con palabras
    return re.sub(r'\b\d+\b', lambda x: num2words(int(x.group()), lang='es'), text)


def text_to_speech(text):
    # Reemplaza los números con palabras
    text = replace_numbers_with_words(text)

    # Convierte el texto a audio usando gTTS
    tts = gTTS(text, lang='es')

    # Guarda el audio en un buffer de memoria en lugar de un archivo
    audio_fp = io.BytesIO()
    tts.write_to_fp(audio_fp)
    audio_fp.seek(0)

    # Inicializa el mixer de pygame
    pygame.mixer.init()
    # Carga el audio desde el buffer de memoria
    pygame.mixer.music.load(audio_fp)
    # Reproduce el audio
    pygame.mixer.music.play()

    # Espera a que termine la reproducción
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)

def Despacho(data, EnServicio):
    df = pd.read_csv("/C:/Users/savil/CBV/public/llamados.csv", sep='#')
    df['Carros'] = df['Carros'].apply(ast.literal_eval)
    df2 = pd.read_csv("/C:/Users/savil/CBV/public/carros.csv", sep='#')
    sectores = [0, 'Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo']
    CarrosEstado = df2['Carro'].tolist()
    EstadoCarros = df2['Estado'].tolist()
    CarrosNoDisponibles = []
    for i in range(len(CarrosEstado)):
        if int(EstadoCarros[i])==1 or int(EstadoCarros[i])==2:
            CarrosNoDisponibles.append(str(CarrosEstado[i]))
    Disponibles = CarrosDisponibles(EnServicio, CarrosNoDisponibles)

    clave = data['clave']
    calle = data['calle']
    interseccion = data['interseccion']
    direccion = data['direccion']
    informacion = data['informacion']
    coordenadas = data['coordenadas']

    clave_value = clave[3:]
    if '-' in clave_value:
        index_clave = clave_value.index('-')
        e = int(clave_value[:index_clave])
        e2 = int(clave_value[index_clave+1:])
    else:
        e = int(clave_value)

    index_coord = coordenadas.index(',')
    X = float(coordenadas[:index_coord])
    Y = float(coordenadas[index_coord + 1:])

    #link = Maps(coordenadas)

    sector = Sector(X, Y)
    sector_N = sectores[sector]
    companias, rescate, hazmat, escalas, mecanica = Sectores(sector)
    bombas_F, rescate_F, hazmat_F, mecanica_F, escalas_F, forestal_F = Carros_Sector(
        companias, rescate, hazmat, escalas, mecanica, Disponibles)
    if e == 1:
        carros = Uno(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 2:
        carros = Dos(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 3:
        carros = Tres(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 4:
        carros = Cuatro(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 5:
        carros = Cinco(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 6:
        carros = Seis(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 8:
        carros = Ocho(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 9:
        carros = Nueve(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 10:
        carros = DiezOnceDoceTreceQuince(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    elif e == 14:
        carros = Ocho(e2, bombas_F, mecanica_F, escalas_F, rescate_F, forestal_F, hazmat_F)
    if 1 in carros:
        carros.remove(1)
    ahora_df = datetime.now()
    fecha_df = ahora_df.strftime("%d/%m/%Y %H:%M:%S")
    superado_df = 0
    carros_N = ''
    for i in carros:
        CarrosNoDisponibles.append(i)
        carros_N = carros_N + i + ' '
    clave = clave[3:]
    if e==8 or e==14:
        if e2<5:
            clave = f'{e} de 1-{e2}'
        elif 5<=e2<8:
            clave = f'{e} de 2-{e2-4}'
        elif 8 <= e2 < 11:
            clave = f'{e} de 3-{e2 - 7}'
        elif 11<=e2<15:
            clave = f'{e} de 4-{e2-10}'
        elif 15<=e2<18:
            clave = f'{e} de 5-{e2-14}'
        elif 18<=e2<24:
            clave = f'{e} de 6-{e2-17}'
        elif 24<=e2<29:
            clave = f'{e} de 9-{e2-23}'
        elif e2 == 29:
            clave = f'{e} de 10'
        elif e2 == 30:
            clave = f'{e} de 11'
        elif e2 == 31:
            clave = f'{e} de 12'
        elif e2 == 32:
            clave = f'{e} de 13'
    elif e==10:
        if e2==1:
            clave = '10'
        elif e2==2:
            clave = '11'
        elif e2==3:
            clave = '12'
        elif e2==4:
            clave = '13'
        elif e2==5:
            clave = '15'
    carros_a_cambiar = []
    for i in carros:
        carros_a_cambiar.append(int(i))
    df2.loc[df2['Carro'].isin(carros_a_cambiar), 'Estado'] = 1
    df2.to_csv('/C:/Users/savil/CBV/public/carros.csv', sep='#', index=False)
    desp = f'{carros_N} Clave {clave}  {calle} con {interseccion}'
    llamado = [superado_df, clave, sector_N, calle, interseccion, carros, fecha_df, 0, direccion, informacion, X, Y]
    df.loc[len(df.index)] = llamado
    df.to_csv('/C:/Users/savil/CBV/public/llamados.csv', sep='#', index=False)

    pygame.mixer.init()
    pygame.mixer.music.load("/C:/Users/savil/Documents/PythonScripts/CentralCBV/tono.mp3")
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)
    text_to_speech(desp)

    return desp

def Adicionales(data, EnServicio):
    df = pd.read_csv("/C:/Users/savil/CBV/public/llamados.csv", sep='#')
    df['Carros'] = df['Carros'].apply(ast.literal_eval)
    df2 = pd.read_csv("/C:/Users/savil/CBV/public/carros.csv", sep='#')
    sectores = [0, 'Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo']
    CarrosEstado = df2['Carro'].tolist()
    EstadoCarros = df2['Estado'].tolist()
    CarrosNoDisponibles = []
    for i in range(len(CarrosEstado)):
        if int(EstadoCarros[i]) == 1 or int(EstadoCarros[i]) == 2:
            CarrosNoDisponibles.append(str(CarrosEstado[i]))
    Disponibles = CarrosDisponibles(EnServicio, CarrosNoDisponibles)

    clave = data['clave']
    calle = data['calle']
    interseccion = data['interseccion']
    cantidad = data['cantidad']
    superado = data['superado']

    condicion = (df['Clave'] == clave) & (df['Calle'] == calle) & (df['Interseccion'] == interseccion) & (
                df['Superado'] == 0)

    df3 = df[
        (df['Clave'] == clave) & (df['Calle'] == calle) & (df['Interseccion'] == interseccion) & (df['Superado'] == 0)]

    llamado = df3.iloc[0]
    sector = sectores.index(llamado['Sector'])
    sector_N = llamado['Sector']
    carros_i = llamado['Carros']
    fecha_df = llamado['Fecha']

    if superado == True:
        df.loc[condicion, 'Superado'] = 1
        carros_a_cambiar = []
        for i in carros_i:
            carros_a_cambiar.append(int(i))
        df2.loc[df2['Carro'].isin(carros_a_cambiar), 'Estado'] = 0
        desp = f' INCIDENTE SUPERADO Clave {clave}  {calle} con {interseccion}'
    else:
        companias, rescate, hazmat, escalas, mecanica = Sectores(sector)
        bombas_F, rescate_F, hazmat_F, mecanica_F, escalas_F, forestal_F = Carros_Sector(
            companias, rescate, hazmat, escalas, mecanica, Disponibles)
        carros = Extra(int(cantidad), bombas_F)
        if 1 in carros:
            carros.remove(1)
        carros_N = ''
        for i in carros:
            carros_i.append(i)
            CarrosNoDisponibles.append(i)
            carros_N = carros_N + i + ' '
        carros_a_cambiar = []
        for i in carros:
            carros_a_cambiar.append(int(i))

        df2.loc[df2['Carro'].isin(carros_a_cambiar), 'Estado'] = 1
        desp = f'Salen {carros_N} a Clave {clave}  {calle} con {interseccion}'
        df.loc[condicion, 'Carros'] = str(carros_i)
        pygame.mixer.init()
        pygame.mixer.music.load("/C:/Users/savil/Documents/PythonScripts/CentralCBV/tono.mp3")
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
    df2.to_csv('/C:/Users/savil/CBV/public/carros.csv', sep='#', index=False)
    df.to_csv('/C:/Users/savil/CBV/public/llamados.csv', sep='#', index=False)
    text_to_speech(desp)


    return desp

print('PRUEBA')