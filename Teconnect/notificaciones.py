from email.message import EmailMessage
import smtplib
from twilio.rest import Client

#password = 'boaa bnpb dtkl jfrn'
def EnviarCorreo():
    remitente = 'teconnect.uag@outlook.com'
    password = 'vwfmttkirbhxllzs'
    destinatario = 'gaelloretomiranda@gmail.com'
    mensaje = 'Mensaje de prueba'

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

#def ´SMS():
    #account_sid = 'AC250cc50f0ae7c98fa5ae906ff9a8310b'
    #auth_token = 'AC250cc50f0ae7c98fa5ae906ff9a8310b'
    #twilio_number = '+12183187909'
    #target = '+523322068206'
    
    #client = Client(account_sid,auth_token)

    #message = client.messages.create(
        #body='Test',
        #from_= twilio_number,
        #to = target
    #)

    #print(message.body)



EnviarCorreo()
#SMS()