from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from models import journal
from serializers.journal_serializer import JournalSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
def journal_view(request):
    if request.method == 'POST':
        journal.add_journal_entry(request.data)
        return Response({'message': 'Journal entry added successfully'})
    elif request.method == 'GET':
        username = request.GET.get('username')
        entries = journal.get_user_journals(username)
        logger.debug("Retrieved journal entries for user: %s", username)
        return Response(entries)

urlpatterns = [
    path('', journal_view),
]