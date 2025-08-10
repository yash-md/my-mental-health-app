import google.generativeai as genai
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
import csv
import os
import logging

logger = logging.getLogger(__name__)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

TIPS_CSV_FILE = 'tips.csv'

@api_view(['POST'])
def get_mood(request):
    text = request.data.get('text')
    username = request.data.get('username') 
    date = request.data.get('date')
    
    logger.info("Received mood request for user: %s, date: %s", username, date)

    if not text or len(text) < 20:
        return Response({'error': 'Journal entry must be at least 20 characters long'}, status=400)

    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = f'''Analyze the mood of the following journal entry. Provide a one-word mood (e.g., Happy, Anxious, Reflective),
    a brief analysis of the user's emotional state, and three actionable tips to help them based on their entry and one of them 
    must be a music recommendation. Format the output as follows:

Mood: [One-word mood]
Analysis: [Brief analysis]
Tip 1: [First tip]
Tip 2: [Second tip]
Tip 3: [Third tip]

Journal Entry:
{text}'''
    
    response = model.generate_content(prompt)
    logger.debug("AI response: %s", response.text)

    try:
        parts = response.text.strip().split('\n')
        mood = parts[0].replace('Mood: ', '').strip()
        analysis = parts[1].replace('Analysis: ', '').strip()
        tips = [
            parts[2].replace('Tip 1: ', '').strip(),
            parts[3].replace('Tip 2: ', '').strip(),
            parts[4].replace('Tip 3: ', '').strip()
        ]
        logger.debug("Parsed tips: %s", tips)

        file_exists = os.path.exists(TIPS_CSV_FILE)
        with open(TIPS_CSV_FILE, 'a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(['username', 'date', 'tip'])
            for tip in tips:
                writer.writerow([username, date, tip])
        logger.info("Tips written to CSV.")

        return Response({'mood': mood, 'analysis': analysis})

    except (IndexError, AttributeError) as e:
        logger.error("Error parsing AI response: %s", e)
        return Response({'error': 'Failed to parse AI response', 'details': str(e)}, status=500)

urlpatterns = [
    path('', get_mood),
]
