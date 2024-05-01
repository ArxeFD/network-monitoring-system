from netmiko import ConnectHandler

device = {
    'device-type':'cisco_ios',
    'host':'ip del dispositivo',
    'username':'gmedina',
    'password':'cisco'
}

def banner1():#Opción 1 de un banner para el dispositivo
    conn = ConnectHandler(**device)
    conn.send_command("banner motd # ACCESO PROHIBIDO A PERSONAL NO AUTORIZADO #")
    conn.disconnect()

def banner2():#Opción 2 de un banner para el dispositivo
    conn = ConnectHandler(**device)
    conn.send_command("banner motd # SOLO ACCESO AUTORIZADO #")
    conn.disconnect()

def hostname():#Cambiar el hostname del dispositivo
    hostname = 'Lo que ponga el usuario'
    conn = ConnectHandler(**device)
    conn.send_command("hostname " +  hostname)
    conn.disconnect()

def passEncryption():#Cifrar las contraseñas
    conn = ConnectHandler(**device)
    conn.send_command("service password encryption")
    conn.disconnect()

def showVersion():
    conn = ConnectHandler(**device)
    output = conn.send_command("show version")#Se guarda la información del dispositivo y ver si hay nuevas actualizaciones
    conn.disconnect()

def showConfig():
    conn = ConnectHandler(**device)
    output = conn.send_command("show ru")#Se guarda la configuración del dispositivo
    conn.disconnect()

def showInterfaceBrief():
    conn = ConnectHandler(**device)
    output = conn.send_command("show ip interface brief")#Se guarda la información de las interfaces del dispositivo y ver cuales están disponibles
    conn.disconnect()

def showLicense():
    conn = ConnectHandler(**device)
    output = conn.send_command("show licence all")#Se guarda la información de las licencias del dispositivo (contratos de soporte y ciclos de vida)
    conn.disconnect()

def showProcesses():
    conn = ConnectHandler(**device)
    output = conn.send_command("show processes")#Muestra un gráfico del historial de uso de CPU durante un período de tiempo determinado. Te da una idea de cómo se ha utilizado la CPU en intervalos de cinco minutos. 
    conn.disconnect()

def showFileSystem():
    conn = ConnectHandler(**device)
    output = conn.send_command("show file system")#muestra el estado de los sistemas de archivos en el dispositivo, incluyendo el almacenamiento disponible y utilizado en cada uno de ellos
    conn.disconnect()








