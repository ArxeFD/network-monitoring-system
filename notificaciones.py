from email.message import EmailMessage
import smtplib
#import pywhatkit

#password = 'boaa bnpb dtkl jfrn'
def EnviarCorreo():
    remitente = 'teconnect.uag@outlook.com'
    password = 'vwfmttkirbhxllzs'
    destinatario = 'gaelloretomiranda@gmail.com'
    mensaje = 'Se detectó una desconexión en el router 2'

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

#def WhatsApp():
 #   pywhatkit.sendwhatmsg_instantly("Cel", "Se detectó una desconexión en el router 2")
 #   print("Mensaje Enviado")

EnviarCorreo()
#WhatsApp()
