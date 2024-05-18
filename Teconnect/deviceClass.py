from pprint import pprint
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
    
    def banner1(self, data):
        config_commands = [
            'banner motd #'+data+'#'
        ]
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set(config_commands)
        conn.disconnect()

    def set_hostname(self, hostname):
        config_commands = [
            'hostname ' + hostname
        ]
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set(config_commands)
        conn.disconnect()

    def ntpServer(self, server):
        config_commands = [
            'ntp server ' + server
        ]
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set(config_commands)
        conn.disconnect()

    def vtpServer(self, domain, password):
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set('vtp mode server')
        conn.send_config_set('vtp domain '+domain)
        conn.send_config_set('vtp password '+password)
        conn.disconnect()

    def vtpClient(self, domain, password):
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set('vtp mode client')
        conn.send_config_set('vtp domain '+domain)
        conn.send_config_set('vtp password '+password)
        conn.disconnect()

    def crearVlan(self, num, name):
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set('vlan '+num)
        conn.send_config_set('name '+name)
        conn.disconnect()

    def crearPoolv4(self, nombre, router, dns, domain, network):
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set('ip dhcp pool '+nombre)
        conn.send_config_set('default-router '+router)
        conn.send_config_set('dns-server '+dns)
        conn.send_config_set('domain-name '+domain)
        conn.send_config_set('network '+network)
        conn.disconnect()

    def excluirDHCP(self, excluded):
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set('ip dhcp excluded-address '+excluded)
        conn.disconnect()

    def showVersion(self):
        conn = ConnectHandler(**self.ssh_info)
        output = conn.send_command("show version")
        conn.disconnect()
        return output

    def showRunn(self):
        conn = ConnectHandler(**self.ssh_info)
        output = conn.send_command("show runn")
        conn.disconnect()
        return output

    def showLicense(self):
        conn = ConnectHandler(**self.ssh_info)
        output = conn.send_command("show license all")
        conn.disconnect()
        return output

    def showIntBr(self):
        conn = ConnectHandler(**self.ssh_info)
        output = conn.send_command("show ip interface brief")
        conn.disconnect()
        return output

    def showProcesses(self):
        conn = ConnectHandler(**self.ssh_info)
        output = conn.send_command("show processes cpu")
        conn.disconnect()
        newOutput = output.split(' PID ')[0]
        return newOutput

    def servicePassword(self):
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set("service password-encryption")
        conn.disconnect()

    def msgSync(self):
        conn = ConnectHandler(**self.ssh_info)
        conn.send_config_set("logging synchronous")
        conn.disconnect()

    