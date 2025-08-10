from rest_framework import serializers

class JournalSerializer(serializers.Serializer):
    username = serializers.CharField()
    title = serializers.CharField()
    content = serializers.CharField()
    date = serializers.CharField()
