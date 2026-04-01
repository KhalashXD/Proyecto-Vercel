def C1(clave, bombas, forestal, rescate, aljibe):
    despacho = []
    carros = [bombas, forestal, rescate, aljibe]
    error = 0
    no_disp = []
    if clave == 1:
        b = 3
    else:
        b = 4
    for i in range(b):
        try:
            despacho.append(bombas[0])
            carro = str(bombas[0])
            for k in carros:
                for j in reversed(k):
                    if str(j)[:1] == carro[:1]:
                        k.remove(j)
                        if str(j) != carro and j not in no_disp:
                            no_disp.append(j)
        except IndexError:
            error += 1

    return despacho, bombas, forestal, rescate, aljibe, error, no_disp

    return despacho, bombas, forestal, rescate, aljibe, error, no_disp


def C2(clave, bombas, forestal, rescate, aljibe):
    despacho = []
    carros = [bombas, forestal, rescate, aljibe]
    error = 0
    no_disp = []
    if clave == 1 or clave == 3 or clave == 4:
        f = 1
    elif clave == 2:
        f = 2
    for i in range(f):
        try:
            despacho.append(forestal[0])
            carro = str(forestal[0])
            for k in carros:
                for j in reversed(k):
                    if str(j)[:1] == carro[:1]:
                        k.remove(j)
                        if str(j) != carro and j not in no_disp:
                            no_disp.append(j)
        except IndexError:
            error += 1

    return despacho, bombas, forestal, rescate, aljibe, error, no_disp


def C3(clave, bombas, forestal, rescate, aljibe):
    despacho = []
    carros = [bombas, forestal, rescate, aljibe]
    error = 0
    no_disp = []
    for i in range(clave):
        try:
            despacho.append(bombas[0])
            carro = str(bombas[0])
            for k in carros:
                for j in reversed(k):
                    if str(j)[:1] == carro[:1]:
                        k.remove(j)
                        if str(j) != carro and j not in no_disp:
                            no_disp.append(j)
        except IndexError:
            error += 1

    return despacho, bombas, forestal, rescate, aljibe, error, no_disp


def C4(clave, bombas, forestal, rescate, aljibe):
    despacho = []
    carros = [bombas, forestal, rescate, aljibe]
    error = 0
    error_r = 0
    no_disp = []
    if clave == 1:
        b = 2
        r = 0
    elif clave == 2:
        b = 2
        r = 1
    elif clave == 3:
        b = 3
        r = 2
    for i in range(r):
        try:
            despacho.append(rescate[0])
            carro = str(rescate[0])
            for k in carros:
                for j in reversed(k):
                    if str(j)[:1] == carro[:1]:
                        k.remove(j)
                        if str(j) != carro and j not in no_disp:
                            no_disp.append(j)
        except IndexError:
            error_r += 1
    for i in range(b):
        try:
            despacho.append(bombas[0])
            carro = str(bombas[0])
            for k in carros:
                for j in reversed(k):
                    if str(j)[:1] == carro[:1]:
                        k.remove(j)
                        if str(j) != carro and j not in no_disp:
                            no_disp.append(j)
        except IndexError:
            error += 1

    return despacho, bombas, forestal, rescate, aljibe, error, error_r, no_disp


def C5(clave, bombas, forestal, rescate, aljibe):
    despacho = []
    carros = [bombas, forestal, rescate, aljibe]
    error = 0
    error_r = 0
    no_disp = []
    if clave == 1:
        b = 0
        r = 1
    elif clave == 2:
        b = 1
        r = 2
    elif clave == 3:
        b = 2
        r = 2
    elif clave == 4:
        b = 3
        r = 2
    for i in range(r):
        try:
            despacho.append(rescate[0])
            carro = str(rescate[0])
            for k in carros:
                for j in reversed(k):
                    if str(j)[:1] == carro[:1]:
                        k.remove(j)
                        if str(j) != carro and j not in no_disp:
                            no_disp.append(j)
        except IndexError:
            error_r += 1
    for i in range(b):
        try:
            despacho.append(bombas[0])
            carro = str(bombas[0])
            for k in carros:
                for j in reversed(k):
                    if str(j)[:1] == carro[:1]:
                        k.remove(j)
                        if str(j) != carro and j not in no_disp:
                            no_disp.append(j)
        except IndexError:
            error += 1

    return despacho, bombas, forestal, rescate, aljibe, error, no_disp


def C6(clave, bombas, forestal, rescate, aljibe):
    despacho = []
    carros = [bombas, forestal, rescate, aljibe]
    error = 0
    no_disp = []
    if clave == 1 or clave == 2 or clave == 3 or clave == 4 or clave == 7:
        r = 1
    else:
        r = 2
    for i in range(r):
        try:
            despacho.append(rescate[0])
            carro = str(rescate[0])
            for k in carros:
                for j in reversed(k):
                    if str(j)[:1] == carro[:1]:
                        k.remove(j)
                        if str(j) != carro and j not in no_disp:
                            no_disp.append(j)
        except IndexError:
            error += 1

    return despacho, bombas, forestal, rescate, aljibe, error, no_disp