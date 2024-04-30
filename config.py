from netmiko import ConnectHandler

device = {
    'device-type':'cisco_ios',
    'host':'ip del dispositivo',
    'username':'gmedina',
    'password':'cisco'
}

def Banner1():
    conn = ConnectHandler(**device)
    conn.send_command("banner motd # ACCESO PROHIBIDO A PERSONAL NO AUTORIZADO #")
    conn.disconnect()

def Banner2():
    conn = ConnectHandler(**device)
    conn.send_command("banner motd # SOLO ACCESO AUTORIZADO #")
    conn.disconnect()

def Hostname():
    hostname = 'Lo que ponga el usuario'
    conn = ConnectHandler(**device)
    conn.send_command("hostname " +  hostname)
    conn.disconnect()






