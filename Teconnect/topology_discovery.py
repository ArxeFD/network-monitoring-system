from netmiko import ConnectHandler
from . import deviceClass
#import deviceClass

ips = list()
neighbors = list()
queueToConnect = set()
relatedToKeyList = list()
DevicesObj = list()
nodes = list()

def startDiscovery(username, password):
    global ips, neighbors, queueToConnect, DevicesObj

    if not queueToConnect:
        print("No hay dispositivos en la lista")
        return

    ip = queueToConnect.pop()

    if ip == '':
        return

    ips.append(ip)

    device = {
        "device_type": "cisco_ios",
        "host": ip,
        "username": username,
        "password": password,
    }
    #Hago conexión con el dispositivo
    connection = ConnectHandler(**device)

    #Hago la lógica de los nodos
    hostname = checkHostname(connection)
    id = connection.host
    deviceType = checkDevice(connection)
    new_device = deviceClass.Device(hostname, id, deviceType)
    DevicesObj.append(new_device)
    print(DevicesObj)

    #Hago la lógica para sacar los enlaces de los nodos
    interfacesIp(connection)
    ipsRelatedToKey(connection)
    findDeviceNeighbors(connection)
    addToQueue(connection)
    checkForSameDevice()

    connection.disconnect()
    startDiscovery(username, password)

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
        if neighDict['to'] == '':
            continue
        neighbors.append(neighDict)

def addToQueue(conn): #Agrego a la cola ips que no estén en ips para no hacer bucles
    output = conn.send_command("show cdp neigh detail", use_textfsm=True)
    for i in output:
        management_ip = i["management_ip"]
        if management_ip.startswith("148"):
            localPort = i["local_port"]
            natNodeAndLink(conn, management_ip, localPort)
            continue
        if management_ip not in ips:
            queueToConnect.add(i["management_ip"])

def checkForSameDevice():
    global queueToConnect
    ips_set = set(ips)
    queueToConnect -= ips_set

def ipsRelatedToKey(conn): #Agrego ips relacionadas a la ip del host al que me conecto
    global relatedToKeyList
    output = conn.send_command("show ip int brief", use_textfsm=True)
    ipsList = [interface["ip_address"] for interface in output if interface["ip_address"] != "unassigned"]
    relation = {conn.host : ipsList}
    relatedToKeyList.append(relation)

def updateLinksWithRelatedIPs():
    global neighbors, relatedToKeyList
    
    for link in neighbors:
        to_ip = link['to']
        for related_ips_dict in relatedToKeyList:
            for device_ip, related_ips in related_ips_dict.items():
                if to_ip in related_ips:
                    link['to'] = device_ip

#Funcion excluisva para cuando salga la ip pública
def natNodeAndLink(conn, natIp, fromPort):
    neighDict = {'from': conn.host, 'to' : natIp, 'fromInt' : fromPort, 'toInt' : ''}
    natNode = {'key': natIp, 'foot': 'Internet', 'img': 'static/img/cloud-svgrepo-com.svg'}
    neighbors.append(neighDict)
    nodes.append(natNode)

#Funciones necesarias para crear los objetos y agregar nodos
def checkHostname(conn):
    output = conn.send_command("show version", use_textfsm=True)
    hostname = output[0]["hostname"]
    return hostname

def checkDevice(conn):
    output = conn.send_command("show ip int brief", use_textfsm=True)
    if len(output) > 10:
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

#Funciones que llamará el socket para pedir la información que requiere
def initQueue(ip):
    queueToConnect.add(ip)

def returnNodes():
    return nodes
def returnNeighbors():
    return neighbors

#Funciones para redescubrir la red
def restartIps():
    global ips
    ips = list()
def restartNeighbors():
    global neighbors
    neighbors = list()
def restartRelatedToKey():
    global relatedToKeyList
    relatedToKeyList = list()
def restartDevicesObj():
    global DevicesObj
    DevicesObj = list()
def restartNodes():
    global nodes
    nodes = list()
'''
startDiscovery()
addNodes()
updateLinksWithRelatedIPs()
print("\n")
print(relatedToKeyList)
print(nodes)
print(neighbors)
'''