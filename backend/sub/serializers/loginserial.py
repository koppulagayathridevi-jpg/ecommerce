# from django.contrib.auth import authenticate
# from rest_framework import serializers
# from rest_framework_simplejwt.tokens import RefreshToken


# class LoginSerializer(serializers.Serializer):

#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, data):

#         username = data.get('username')
#         password = data.get('password')

#         user = authenticate(
#             username=username,
#             password=password
#         )

#         if user is None:
#             raise serializers.ValidationError(
#                 "Invalid username or password"
#             )

#         refresh = RefreshToken.for_user(user)

#         return {
#             'username': user.username,
#             'email': user.email,
#             'access': str(refresh.access_token),
#             'refresh': str(refresh),
#         }


from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        username = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid username or password"
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid username or password"
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "User account is inactive"
            )

        refresh = RefreshToken.for_user(user)

        return {
            "username": user.username,
            "email": user.email,

            # Admin information
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,

            # JWT tokens
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }