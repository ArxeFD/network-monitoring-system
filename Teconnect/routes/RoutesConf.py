from Teconnect.topology_discovery import DevicesObj
from Teconnect import app, socketio

@socketio.on('BannerConf')
def bannerConf(data):
    ip = data['ip']
    banner = data['banner']
    print(ip)

    try:
        for i in DevicesObj:
            if i.id == ip:
                i.banner1(banner)
                print("configurado banner")
    except Exception as e:
        print("Error encontrado: " + str(e))

@socketio.on('hostname')
def hostnameConf(data):
    ip = data['ip']
    hostname = data['hostname']
    print(ip)
    print(hostname)
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.set_hostname(hostname)
                print("configurado hostname")
    except Exception as e:
        print("Error encontrado: " + str(e))

@socketio.on('ntpServer')
def ntpServerConf(data):
    ip = data['ip']
    serverIP = data['server']
    print(ip)
    print(serverIP)
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.ntpServer(serverIP)
                print("configurado servidor NTP")
    except Exception as e:
        print("Error encontrado: " + str(e))

@socketio.on('vtpServer')
def ntpServerConf(data):
    ip = data['ip']
    domain = data['domain']
    password = data['password']
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.vtpServer(domain, password)
                print("configurado servidor VTP")
    except Exception as e:
        print("Error encontrado: " + str(e))

@socketio.on('vtpClient')
def ntpClientConf(data):
    ip = data['ip']
    domain = data['domain']
    password = data['password']
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.vtpClient(domain, password)
                print("configurado cliente VTP")
    except Exception as e:
        print("Error encontrado: " + str(e))

@socketio.on('crearVlan')
def createVlan(data):
    ip = data['ip']
    num = data['num']
    name = data['name']
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.crearVlan(num, name)
                print("VLAN creada")
    except Exception as e:
        print("Error encontrado: " + str(e))

@socketio.on('excluirDHCP')
def excludeDHCP(data):
    ip = data['ip']
    excluded = data['excluded']
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.excluirDHCP(excluded)
                print("IP(s) excluidas")
    except Exception as e:
        print("Error encontrado: " + str(e))

@socketio.on('show_version')
def showVersionOutput(data):
    ip = data['ip']
    try:
        for i in DevicesObj:
            if i.id == ip:
                output = i.showVersion()
                print("Enviado show version")
    except Exception as e:
        print("Error encontrado: " + str(e))
    
    socketio.emit('showVersionOutput', output)

@socketio.on('show_running')
def showRunningOutput(data):
    ip = data['ip']
    try:
        for i in DevicesObj:
            if i.id == ip:
                output = i.showRunn()
                print("Enviado show running")
    except Exception as e:
        print("Error encontrado: " + str(e))
    
    socketio.emit('showRunningOutput', output)

@socketio.on('show_license')
def showFileOutput(data):
    ip = data['ip']
    try:
        for i in DevicesObj:
            if i.id == ip:
                output = i.showLicense()
                print("Enviado show license")
    except Exception as e:
        print("Error encontrado: " + str(e))
        output = e
    
    socketio.emit('showed_license', output)

@socketio.on('show_proc')
def showFileOutput(data):
    ip = data['ip']
    try:
        for i in DevicesObj:
            if i.id == ip:
                output = i.showProcesses()
                print("Enviado show processes")
    except Exception as e:
        print("Error encontrado: " + str(e))
    
    socketio.emit('showed_proc', output)

@socketio.on('crearPoolV4')
def crearPoolV4(data):
    ip = data['ip']
    nombre = data['nombre']
    router = data['router']
    dns =  data['dns']
    domain = data['domain']
    network = data['network']
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.crearPoolv4(nombre, router, dns, domain, network)
                print("Pool "+nombre+" Creado")
    except Exception as e:
        print("Error encontrado: " + str(e))
    

@socketio.on('show_int_br')
def showFileOutput(data):
    ip = data['ip']
    try:
        for i in DevicesObj:
            if i.id == ip:
                output = i.showIntBr()
                print("Enviado show int br")
    except Exception as e:
        print("Error encontrado: " + str(e))
    
    socketio.emit('showed_int_br', output)

@socketio.on('service_password_encryption')
def servicePass(data):
    ip = data['ip']
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.servicePassword()
                print("contraseñas cifradas")
    except Exception as e:
        print("Error encontrado: " + str(e))

    socketio.emit('service_password_encrypted')

@socketio.on('msg_sync')
def servicePass(data):
    ip = data['ip']
    try:
        for i in DevicesObj:
            if i.id == ip:
                i.msgSync()
                print("mensajes sincronizados")
    except Exception as e:
        print("Error encontrado: " + str(e))

    socketio.emit('msg_synced')





