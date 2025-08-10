import csv
import os

CSV_FILE = 'users.csv'

def get_all_users():
    users = []
    if not os.path.exists(CSV_FILE):
        return users
    with open(CSV_FILE, newline='') as file:
        reader = csv.DictReader(file)
        users.extend(reader)
    return users

def save_user(data):
    file_exists = os.path.exists(CSV_FILE)
    with open(CSV_FILE, 'a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=['name', 'email', 'phone', 'username', 'password'])
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)

def find_user_by_username(username):
    users = get_all_users()
    return next((user for user in users if user['username'] == username), None)
