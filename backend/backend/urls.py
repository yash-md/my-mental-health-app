from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def ping_view(request):
    return JsonResponse({'message': 'pong'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('routes.auth')),
    path('journal-entry', include('routes.journal')),
    path('ping', ping_view),
    path('mood/', include('routes.mood')),
    path('tips/', include('routes.tips')),
    path('', include('routes.auth')),
]