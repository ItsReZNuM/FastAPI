import requests
import random
from datetime import datetime

# Base URL for the API (update if running locally or on a different host)
BASE_URL = "http://localhost:8000"  # Change to "http://localhost:8000" for local testing

# Expanded list of valid cities
CITIES = [
    "تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "قم", "اهواز", "کرمان",
    "رشت", "کرج", "همدان", "یزد", "اردبیل", "بندرعباس", "اراک"
]

# Departments (no validator for specific values, but using reasonable ones)
DEPARTMENTS = ["فنی مهندسی", "علوم پایه", "اقتصاد"]

# Majors (no specific validator, but aligned with departments)
MAJORS = [
    "مهندسی کامپیوتر", "مهندسی برق", "مهندسی مکانیک", "ریاضی", "فیزیک",
    "شیمی", "اقتصاد", "حسابداری", "مدیریت بازرگانی", "زیست‌شناسی",
    "مهندسی عمران", "علوم کامپیوتر", "مدیریت مالی", "زمین‌شناسی", "آمار"
]

# Expanded lists for names
FIRST_NAMES = [
    "علی", "محمد", "حسین", "رضا", "مهدی", "احمد", "محمدرضا",
    "حسن", "امیر", "جواد", "سجاد", "مجید", "کاظم", "عباس", "نیما"
]
LAST_NAMES = [
    "احمدی", "محمدی", "حسینی", "رضایی", "مهدوی", "کریمی", "رحیمی",
    "علوی", "موسوی", "نعمتی", "زارعی", "شریفی", "جعفری", "صادقی", "قاسمی"
]
FATHER_NAMES = [
    "حسن", "عباس", "کاظم", "جواد", "اکبر", "محسن", "رسول",
    "قاسم", "ناصر", "یدالله", "رحمان", "حبیب", "اسماعیل", "بهرام", "فرهاد"
]

# Expanded list for course names
COURSE_NAMES = [
    "برنامه‌نویسی", "ریاضیات", "فیزیک", "اقتصاد کلان", "شیمی",
    "مدارهای الکتریکی", "مکانیک سیالات", "آمار کاربردی",
    "مدیریت مالی", "ساختمان داده‌ها", "هوش مصنوعی",
    "شیمی آلی", "اقتصاد خرد", "طراحی سازه", "ریاضی مهندسی"
]

# Generate random birth date in Persian calendar format
def random_birth_date():
    year = random.randint(1300, 1400)
    month = random.randint(1, 12)
    day = random.randint(1, 28)  # Avoid invalid days
    return f"{year}/{month:02d}/{day:02d}"

# Generate random 10-digit postal code
def random_postal_code():
    return "".join([str(random.randint(0, 9)) for _ in range(10)])

# Generate random home phone number
def random_hphone():
    return f"021{random.randint(10000000, 99999999)}"

# Generate random 6-digit IDS
def random_ids():
    return f"{random.randint(100000, 999999):06d}"

# Generate random 10-digit national ID
def random_national_id():
    return f"{random.randint(1000000000, 9999999999):010d}"

# Function to add data and collect teacher IDs
def add_data(endpoint, data_list):
    teacher_ids = []
    for data in data_list:
        response = requests.post(f"{BASE_URL}/{endpoint}/", json=data)
        if response.status_code == 200:
            print(f"Added Successfully: {data}")
            if endpoint == "teachers":
                teacher_ids.append(response.json()["teacher_id"])
        else:
            print(f"Error in adding data: {data}, Status code: {response.status_code}, Message: {response.text}")
    return teacher_ids

# Sample teacher data (5 records)
teachers = [
    {
        "teacher_fname": random.choice(FIRST_NAMES),
        "teacher_lname": random.choice(LAST_NAMES),
        "father": random.choice(FATHER_NAMES),
        "IDS": random_ids(),
        "BornCity": random.choice(CITIES),
        "Address": f"خیابان نمونه {i+1}، تهران",
        "PostalCode": random_postal_code(),
        "HPhone": random_hphone(),
        "Department": random.choice(DEPARTMENTS),
        "national_id": random_national_id(),
        "birth_date": random_birth_date()
    } for i in range(5)
]

# Add teachers first to get their IDs
print("Adding Teachers...")
teacher_ids = add_data("teachers", teachers)

# Sample student data (5 records)
students = [
    {
        "student_fname": random.choice(FIRST_NAMES),
        "student_lname": random.choice(LAST_NAMES),
        "father": random.choice(FATHER_NAMES),
        "IDS": random_ids(),
        "BornCity": random.choice(CITIES),
        "Address": f"خیابان نمونه {i+1}، تهران",
        "PostalCode": random_postal_code(),
        "HPhone": random_hphone(),
        "Department": random.choice(DEPARTMENTS),
        "Major": random.choice(MAJORS),
        "Married": random.choice(["مجرد", "متاهل"]),
        "national_id": random_national_id(),
        "birth_date": random_birth_date()
    } for i in range(5)
]

# Sample course data (5 records, using teacher IDs)
courses = [
    {
        "course_name": random.choice(COURSE_NAMES),
        "units": random.randint(1, 4),
        "department": random.choice(DEPARTMENTS),
        "teacher_id": random.choice(teacher_ids) if teacher_ids else f"{100000+i:06d}"  # Fallback if no teachers
    } for i in range(5)
]

# Add students and courses
print("\nAdding Students...")
add_data("students", students)

print("\nAdding Courses...")
add_data("courses", courses)