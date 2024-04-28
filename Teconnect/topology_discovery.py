from netmiko import ConnectHandler
from pprint import pprint

def establish_connection(ip):
    ips.append(ip)
    device = {
        "device_type": "cisco_ios",
        "host": ip,
        "username": "gmedina",
        "password": "cisco", 
    }
    for i in ips:
        if i not in ips:
            ssh_connection = ConnectHandler(**device)
            output = showNeighbors()
            ssh_connection.disconnect()
            return output
        else:
            establish_connection(ip)
          
    

def showNeighbors(): #Quité el argumento "connection" pero sí tiene que ir algo de la conexión
    #sh_cdp = connection.send_command("show ip int brief", use_textfsm=True)
    sh_cdp = sh_cdp_neighbors()
    
    for _neigh in sh_cdp:
        _neigh = {_neigh["destination_host"]+_neigh["remote_port"] : _neigh["management_ip"]}
        toMapTopology.append(_neigh)
        print(toMapTopology)
    
    

#Función de ejemplo imitando datos reales
def sh_cdp_neighbors():
    return [{'capabilities': 'Switch IGMP',
  'destination_host': 'S1.uag.mx',
  'local_port': 'GigabitEthernet0/0/0',
  'management_ip': '192.168.1.2',
  'platform': 'cisco C1000-24T-4G-L',
  'remote_port': 'GigabitEthernet1/0/1',
  'software_version': 'Cisco IOS Software, C1000 Software '
                      '(C1000-UNIVERSALK9-M), Version 15.2(7)E6, RELEASE '
                      'SOFTWARE (fc2)'},
 {'capabilities': 'Router Switch IGMP',
  'destination_host': 'R2.uag.mx',
  'local_port': 'GigabitEthernet0/0/1',
  'management_ip': '192.168.2.2',
  'platform': 'cisco C8200L-1N-4T',
  'remote_port': 'GigabitEthernet0/0/0',
  'software_version': 'Cisco IOS Software [Bengaluru], c8000be Software '
                      '(X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 17.6.6a, '
                      'RELEASE SOFTWARE (fc3)'}]

#Guardo ips para que no se vuelva a conectar a la misma
ips = []
toMapTopology = []

showNeighbors()

'''
# Enviar comandos y recibir salida
output = ssh_connection.send_command("show ip int brief", use_textfsm=True)
pprint(output)


# Cerrar la conexión SSH
ssh_connection.disconnect()
'''