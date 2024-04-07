import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email):
    # Email configuration
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'esportscardnepal@gmail.com'
    smtp_password = 'gwml canw ldcc cban'
    # Create the email content
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = to_email
    msg['Subject'] = 'Token Recharged Success'
    # Attach the message to the email
    msg.attach(MIMEText('Thank You for your contribution to us.', 'plain'))
    # Connect to the SMTP server
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)
    # Send the email
    server.sendmail(smtp_username, to_email, msg.as_string())
    # Close the SMTP server connection
    server.quit()
    
def send_email_add(to_email, amount):
    # Email configuration
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'esportscardnepal@gmail.com'
    smtp_password = 'gwml canw ldcc cban'

    # Create the email content
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = to_email
    msg['Subject'] = 'Balance Recharged Success'

    # Attach the message to the email
    message_body = f'Your wallet has been recharged by Rs. {amount}'  # Properly interpolate amount
    msg.attach(MIMEText(message_body, 'plain'))

    # Connect to the SMTP server
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    # Send the email
    server.sendmail(smtp_username, to_email, msg.as_string())

    # Close the SMTP server connection
    server.quit()
    
def send_email_buy(to_email, amount):
    # Email configuration
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'esportscardnepal@gmail.com'
    smtp_password = 'gwml canw ldcc cban'

    # Create the email content
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = to_email
    msg['Subject'] = 'Token Purchase'

    # Attach the message to the email
    message_body = f'Your wallet has been deducted by Rs. {amount}'  # Properly interpolate amount
    msg.attach(MIMEText(message_body, 'plain'))

    # Connect to the SMTP server
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    # Send the email
    server.sendmail(smtp_username, to_email, msg.as_string())

    # Close the SMTP server connection
    server.quit()
