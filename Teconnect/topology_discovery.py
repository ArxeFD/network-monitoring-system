from netmiko import ConnectHandler
from pprint import pprint


ips = []
neighbors = []
queueToConnect = {"192.168.1.1"}

def startDiscovery():
    global ips, neighbors, queueToConnect

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

    connection = ConnectHandler(**device)
    interfacesIp(connection)
    findDeviceNeighbors(connection)
    addToQueue(connection)
    startDiscovery()

                

def interfacesIp(conn): #Función donde meto todas las ips de un dispositivo para que no se vuelvan a conectar de vuelta
    output = conn.send_command("show ip int brief", use_textfsm=True)
    for i in output:
        if i["ip_address"] != 'unassigned': #no quiero agregar las interfaces sin ip
            ips.append(i["ip_address"])

def findDeviceNeighbors(conn): #Pongo de dónde a donde está conectado
    output = conn.send_command("show cdp neigh detail", use_textfsm=True)
    for i in output:
        neighDict = {'from': conn.host, 'to' : i["management_ip"]}
        neighbors.append(neighDict)

def addToQueue(conn): #Agrego a la cola ips que no estén en ips para no hacer bucles
    output = conn.send_command("show cdp neigh detail", use_textfsm=True)
    for i in output:
        if i["management_ip"] not in ips:
            queueToConnect.add(i["management_ip"])


startDiscovery()
pprint(neighbors)


