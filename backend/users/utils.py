import pyotp
from django.core.mail import send_mail
import base64
import binascii

def generate_otp(user):
    if not user.secret_key:
      raise ValueError("Секретный ключ отсутствует.")
    
    try:
        base64.b32decode(user.secret_key, casefold=True)
    except binascii.Error:
        raise ValueError("Неверный формат секретного ключа.")
    totp = pyotp.TOTP(user.secret_key)
    otp_code = totp.now()
    send_mail(
        'Your 2fa code',
        f'Your 2Fa code: {otp_code}',
        'from@example.com',
        [user.email],
    )
    return otp_code

def verify_otp(user, token):
    totp = pyotp.TOTP(user.secret_key)
    return totp.verify(token, valid_window=1)