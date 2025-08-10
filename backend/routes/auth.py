from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.urls import path
import json
import csv
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            logger.info("Login request received.")
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            logger.debug("Attempting login for username: %s", username)

            if not username or not password:
                return JsonResponse({
                    'message': 'Username and password are required',
                    'success': False
                }, status=400)

            csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'users.csv')
            logger.debug("Looking for CSV at: %s", csv_path)
            
            if not os.path.exists(csv_path):
                return JsonResponse({
                    'error': f'User data file not found at {csv_path}',
                    'success': False
                }, status=500)

            with open(csv_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                
                for row in reader:
                    if row['USERNAME'] == username and row['PASSWORD'] == password:
                        logger.info("Login successful for user: %s", username)
                        return JsonResponse({
                            'message': 'Login successful', 
                            'success': True,
                            'user': {
                                'username': row['USERNAME'],
                                'name': row.get('NAME', ''),
                                'email': row.get('EMAIL', ''),
                            }
                        }, status=200)

            return JsonResponse({
                'message': 'Invalid credentials', 
                'success': False
            }, status=401)

        except Exception as e:
            logger.error("Login error: %s", str(e))
            return JsonResponse({
                'error': str(e),
                'success': False
            }, status=500)

    return JsonResponse({
        'message': 'Method not allowed',
        'success': False
    }, status=405)

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        try:
            logger.info("Registration request received.")
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            full_name = data.get('full_name')
            email = data.get('email')
            phone = data.get('phone')
            joined_date = datetime.now().isoformat()

            if not all([username, password, full_name, email, phone]):
                return JsonResponse({
                    'message': 'All fields are required',
                    'success': False
                }, status=400)

            csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'users.csv')
            
            # Check if username or email already exists
            if os.path.exists(csv_path):
                with open(csv_path, 'r', newline='', encoding='utf-8') as csvfile:
                    reader = csv.DictReader(csvfile)
                    for row in reader:
                        if row['USERNAME'].lower() == username.lower():
                            return JsonResponse({
                                'message': f'Username "{username}" is already taken. Please choose a different username.',
                                'success': False,
                                'error_type': 'username_exists'
                            }, status=400)
                        if row['EMAIL'].lower() == email.lower():
                            return JsonResponse({
                                'message': f'An account with email "{email}" already exists.',
                                'success': False,
                                'error_type': 'email_exists'
                            }, status=400)

            # Append new user to CSV
            with open(csv_path, 'a', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['USERNAME', 'PASSWORD', 'NAME', 'EMAIL', 'PHONE', 'JOINED']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                if not os.path.exists(csv_path) or os.stat(csv_path).st_size == 0:
                    writer.writeheader()

                writer.writerow({
                    'USERNAME': username,
                    'PASSWORD': password,
                    'NAME': full_name,
                    'EMAIL': email,
                    'PHONE': phone,
                    'JOINED': joined_date
                })
            
            logger.info("Successfully registered user: %s", username)
            return JsonResponse({
                'message': 'Registration successful!',
                'success': True
            }, status=201)

        except Exception as e:
            logger.error("Registration error: %s", str(e))
            return JsonResponse({
                'message': 'Registration failed. Please try again.',
                'success': False
            }, status=500)

    return JsonResponse({
        'message': 'Method not allowed',
        'success': False
    }, status=405)

@csrf_exempt
def change_password_view(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed', 'success': False}, status=405)

    try:
        logger.info("Change password request received.")
        data = json.loads(request.body)
        username = data.get('username')
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not all([username, current_password, new_password]):
            return JsonResponse({
                'message': 'All fields are required',
                'success': False
            }, status=400)

        csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'users.csv')
        
        if not os.path.exists(csv_path):
            return JsonResponse({
                'message': 'User data file not found',
                'success': False
            }, status=500)

        users = []
        user_found = False
        password_correct = False
        
        with open(csv_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['USERNAME'] == username:
                    user_found = True
                    if row['PASSWORD'] == current_password:
                        password_correct = True
                        row['PASSWORD'] = new_password
                        logger.info("Password updated for user: %s", username)
                users.append(row)

        if not user_found:
            return JsonResponse({
                'message': 'User not found',
                'success': False
            }, status=404)

        if not password_correct:
            return JsonResponse({
                'message': 'Current password is incorrect',
                'success': False
            }, status=400)

        with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['USERNAME', 'PASSWORD', 'NAME', 'EMAIL', 'PHONE', 'JOINED']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for user in users:
                writer.writerow({
                    'USERNAME': user.get('USERNAME', ''),
                    'PASSWORD': user.get('PASSWORD', ''),
                    'NAME': user.get('NAME', ''),
                    'EMAIL': user.get('EMAIL', ''),
                    'PHONE': user.get('PHONE', ''),
                    'JOINED': user.get('JOINED', '')
                })

        return JsonResponse({
            'message': 'Password changed successfully',
            'success': True
        }, status=200)

    except Exception as e:
        logger.error("Change password error: %s", str(e))
        return JsonResponse({
            'message': 'Server error occurred',
            'success': False
        }, status=500)

@csrf_exempt
def get_profile_view(request):
    if request.method == 'GET':
        try:
            username = request.GET.get('username')
            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)

            csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'users.csv')
            if not os.path.exists(csv_path):
                return JsonResponse({'error': 'User data file not found'}, status=500)

            with open(csv_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    if row['USERNAME'] == username:
                        return JsonResponse({
                            'user': {
                                'username': row.get('USERNAME', ''),
                                'name': row.get('NAME', ''),
                                'email': row.get('EMAIL', ''),
                                'phone': row.get('PHONE', ''),
                                'joined': row.get('JOINED', '')
                            }
                        })
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def update_profile_view(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')

            if not all([username, name, email, phone]):
                return JsonResponse({'error': 'Username, name, email, and phone are required'}, status=400)

            csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'users.csv')
            if not os.path.exists(csv_path):
                return JsonResponse({'error': 'User data file not found'}, status=500)

            users = []
            user_updated = False

            # Check for duplicates before updating
            with open(csv_path, 'r', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    if row['USERNAME'] != username:
                        if row['EMAIL'].lower() == email.lower():
                            return JsonResponse({'error': 'Email is already in use by another account'}, status=400)
                        if row['PHONE'] == phone:
                            return JsonResponse({'error': 'Phone number is already in use by another account'}, status=400)

            with open(csv_path, 'r', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    if row['USERNAME'] == username:
                        row['NAME'] = name
                        row['EMAIL'] = email
                        row['PHONE'] = phone
                        user_updated = True
                    users.append(row)
            
            if not user_updated:
                return JsonResponse({'error': 'User not found'}, status=404)

            with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['USERNAME', 'PASSWORD', 'NAME', 'EMAIL', 'PHONE', 'JOINED']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for user in users:
                    writer.writerow({
                        'USERNAME': user.get('USERNAME', ''),
                        'PASSWORD': user.get('PASSWORD', ''),
                        'NAME': user.get('NAME', ''),
                        'EMAIL': user.get('EMAIL', ''),
                        'PHONE': user.get('PHONE', ''),
                        'JOINED': user.get('JOINED', '')
                    })

            return JsonResponse({'message': 'Profile updated successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('change-password/', change_password_view, name='change-password'),
    path('profile/', get_profile_view, name='get_profile'),
    path('profile/update/', update_profile_view, name='update_profile'),
]
