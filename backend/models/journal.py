import csv
import os

CSV_FILE = 'journals.csv'

def get_user_journals(username):
    if not os.path.exists(CSV_FILE):
        return []
    with open(CSV_FILE, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        entries = []
        for row in reader:
            if row['USERNAME'] == username:
                lowercase_row = {k.lower(): v for k, v in row.items()}
                entries.append(lowercase_row)
        return entries

def add_journal_entry(entry):
    print("Entry before writing to CSV:", entry)
    file_exists = os.path.exists(CSV_FILE)
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=['username', 'title', 'content', 'date'])
        if not file_exists:
            writer.writeheader()
        writer.writerow(entry)
