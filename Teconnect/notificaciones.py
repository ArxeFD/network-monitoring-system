from email.message import EmailMessage
import smtplib
import socket
import json

def EnviarCorreo(mensaje):
    remitente = 'teconnect.uag@outlook.com'
    password = 'vwfmttkirbhxllzs'
    destinatario = 'gaelloretomiranda@gmail.com'

    email = EmailMessage()
    email["From"] = remitente
    email["To"] = destinatario
    email["Subject"] = "Error en la red"
    email.set_content(mensaje)

    smtp = smtplib.SMTP('smtp.outlook.com', 587)
    smtp.starttls()
    smtp.login(remitente, password)
    smtp.sendmail(remitente,destinatario,email.as_string())
    #Puede que el correo llegue en spam
    smtp.quit()


HOST = '192.168.1.10'
PORT = 514

def parse_syslog_message(data):
    # Decodificar el mensaje
    mensaje = data.decode("utf-8")

    # Encontrar delimitadores, guardarlos como variables
    colon1_idx = mensaje.find(':') + 22  
    colon2_idx = mensaje.find(':', colon1_idx + 1) + 1

    # Usar variables como delimitadores
    part1 = mensaje[colon1_idx -19 :colon1_idx]
    part2 = mensaje[colon1_idx+2:colon2_idx-1]
    part3 = mensaje[colon2_idx+1:]


    #Crear json, asignar partes a json
    json_obj = {
    "Hora": part1,
    "Tipo": part2,
    "Descripcion": part3
    }


    return json_obj

#Con Af_Inet (Ipv4) y Sock_Dgram (Usar datagramas)

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
    s.bind((HOST, PORT))
    print(f"{HOST} Listening on port {PORT}")

    #Bucle para siempre recibir
    while True:
        data, addr = s.recvfrom(1024)
        json_string = json.dumps(parse_syslog_message(data))
        #mensaje = json_string
        mensaje = f"Se detectó el siguiente mensaje: {json_string['Descripcion']} a las {json_string['Hora']}"
        #EnviarCorreo(mensaje)

