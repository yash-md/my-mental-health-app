from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    username = serializers.CharField()
    password = serializers.CharField()
