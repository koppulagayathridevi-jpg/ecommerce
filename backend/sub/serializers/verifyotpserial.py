from django.contrib.auth.models import User
from rest_framework import serializers

from ..models import EmailOTP


class VerifyOTPSerializer(serializers.Serializer):

    username = serializers.CharField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):

        try:
            user = User.objects.get(username=data['username'])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        try:
            otp_obj = EmailOTP.objects.get(user=user)
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError("OTP not found")

        if otp_obj.otp != data['otp']:
            raise serializers.ValidationError("Invalid OTP")

        user.is_active = True
        user.save()

        otp_obj.delete()

        data['user'] = user
        return data