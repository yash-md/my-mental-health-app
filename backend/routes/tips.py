from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
import csv
import os
import logging

logger = logging.getLogger(__name__)

TIPS_CSV_FILE = 'tips.csv'

@api_view(['GET'])
def get_tips(request):
    username = request.GET.get('username')
    date = request.GET.get('date')

    logger.info("Received tips request for user: %s, date: %s", username, date)

    if not username or not date:
        return Response({'error': 'Username and date are required'}, status=400)

    if not os.path.exists(TIPS_CSV_FILE):
        logger.info("TIPS_CSV_FILE does not exist.")
        return Response({'tips': []})

    tips = []
    with open(TIPS_CSV_FILE, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            logger.debug("Reading row: %s", row) # Keep for debugging if needed, but change level
            # Compare the full ISO string for exact match
            if row['username'] == username and row['date'] == date:
                tips.append(row['tip'])
    
    logger.info("Found tips: %s", tips)
    return Response({'tips': tips})

@api_view(['GET'])
def get_journal_tips(request):
    username = request.GET.get('username')
    journal_date = request.GET.get('journal_date')

    if not username or not journal_date:
        return Response({'error': 'Username and journal date are required'}, status=400)

    if not os.path.exists(TIPS_CSV_FILE):
        return Response({'tips': []})

    tips = []
    with open(TIPS_CSV_FILE, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['username'] == username and row['date'].startswith(journal_date):
                tips.append(row['tip'])
    
    return Response({'tips': tips})

urlpatterns = [
    path('', get_tips),
    path('journal', get_journal_tips),
]