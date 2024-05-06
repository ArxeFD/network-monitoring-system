from netmiko import ConnectHandler

class Device():
    def __init__(self, hostname, id, device_type):
        self.hostname = hostname
        self.id = id
        self.device_type = device_type
        
        self.ssh_info = {
            "device_type": "cisco_ios",
            "host": id,
            "username": "gmedina",
            "password": "cisco", 
        }
    
    def banner1(self):#Opción 1 de un banner para el dispositivo
        conn = ConnectHandler(**self.ssh_info)
        conn.send_command("banner motd # ACCESO PROHIBIDO A PERSONAL NO AUTORIZADO #")
        conn.disconnect()
    
    