from netmiko import ConnectHandler
import deviceClass as deviceClass

ips = []
neighbors = []
queueToConnect = {"192.168.1.1"}
DevicesObj = []
nodes = []

def startDiscovery():
    global ips, neighbors, queueToConnect, DevicesObj

    if not queueToConnect:
        print("No hay dispositivos en la lista")
        return

    ip = queueToConnect.pop()

    ips.append(ip)

    device = {
        "device_type": "cisco_ios",
        "host": ip,
        "username": "gmedina",
        "password": "cisco",
    }
    #Hago conexión con el dispositivo
    connection = ConnectHandler(**device)

    #Hago la lógica de los nodos
    hostname = checkHostname(connection)
    id = connection.host
    deviceType = checkDevice(connection)
    new_device = deviceClass.Device(hostname, id, deviceType)
    DevicesObj.append(new_device)

    #Hago la lógica para sacar los enlaces de los nodos
    interfacesIp(connection)
    findDeviceNeighbors(connection)
    addToQueue(connection)
    print(queueToConnect)
    startDiscovery()

#Funciones necesarias para descubrir la topología y crear los enlaces entre los nodos
def interfacesIp(conn): #Función donde meto todas las ips de un dispositivo para que no se vuelvan a conectar de vuelta
    output = conn.send_command("show ip int brief", use_textfsm=True)
    for i in output:
        if i["ip_address"] != 'unassigned': #no quiero agregar las interfaces sin ip
            ips.append(i["ip_address"])

def findDeviceNeighbors(conn): #Pongo de dónde a donde está conectado
    output = conn.send_command("show cdp neigh detail", use_textfsm=True)
    for i in output:
        neighDict = {'from': conn.host, 'to' : i["management_ip"], 'fromInt' : i["local_port"], 'toInt' : i["remote_port"]}
        neighbors.append(neighDict)

def addToQueue(conn): #Agrego a la cola ips que no estén en ips para no hacer bucles
    output = conn.send_command("show cdp neigh detail", use_textfsm=True)
    for i in output:
        if i["management_ip"] not in ips:
            queueToConnect.add(i["management_ip"])


#Funciones necesarias para crear los objetos y agregar nodos
def checkHostname(conn):
    output = conn.send_command("show version", use_textfsm=True)
    hostname = output[0]["hostname"]
    return hostname

def checkDevice(conn):
    output = conn.send_command("show ip int brief", use_textfsm=True)
    if len(output) > 6:
        device = "Switch"
    else:
        device = "Router"

    return device

def addNodes():
    for i in DevicesObj:
        if i.device_type == "Switch":
            img = "static/img/switch.svg"
        else:
            img = "static/img/router-svgrepo-com.svg"

        nodes.append({'key': i.id, 'foot': i.hostname,'img': img})

startDiscovery()
addNodes()
print(neighbors)
print("\n")
print(nodes)