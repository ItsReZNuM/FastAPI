import requests
import random
from datetime import datetime

BASE_URL = "http://sanasaki.ir/"


CITIES = [
    "تهران", "مشهد", "اصفهان", "کرج", "شیراز", "تبریز", "قم", "اهواز", "کرمانشاه",
    "ارومیه", "رشت", "زاهدان", "همدان", "کرمان", "یزد", "اردبیل", "بندرعباس",
    "اراک", "اسلامشهر", "زنجان", "سنندج", "قزوین", "خرم‌آباد", "گرگان",
    "ساری", "بجنورد", "بوشهر", "بیرجند", "ایلام", "شهرکرد", "یاسوج"
]

DEPARTMENTS = ["فنی مهندسی", "علوم پایه", "اقتصاد"]
MAJORS = {
    "فنی مهندسی": [
        "مهندسی کامپیوتر", "مهندسی برق", "مهندسی مکانیک", "مهندسی عمران",
        "مهندسی صنایع", "مهندسی شیمی", "مهندسی مواد", "مهندسی هوافضا",
        "مهندسی نفت", "مهندسی معماری"
    ],
    "علوم پایه": [
        "ریاضی", "فیزیک", "شیمی", "زیست‌شناسی", "زمین‌شناسی",
        "آمار", "علوم کامپیوتر", "بیوشیمی", "میکروبیولوژی", "ژنتیک"
    ],
    "اقتصاد": [
        "اقتصاد", "مدیریت بازرگانی", "حسابداری", "مدیریت مالی",
        "مدیریت صنعتی", "اقتصاد کشاورزی", "اقتصاد بین‌الملل",
        "بانکداری", "بیمه", "مدیریت دولتی"
    ]
}

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

COURSE_NAMES = [
    "برنامه‌نویسی", "ریاضیات", "فیزیک عمومی", "اقتصاد کلان", "شیمی عمومی",
    "مدارهای الکتریکی", "مکانیک سیالات", "آمار کاربردی", "مدیریت مالی",
    "ساختمان داده", "هوش مصنوعی", "شیمی آلی", "اقتصاد خرد", "طراحی سازه",
    "ریاضی مهندسی"
]

def random_birth_date():
    year = random.randint(1300, 1400)
    month = random.randint(1, 12)
    day = random.randint(1, 31)
    return f"{year}/{month:02d}/{day:02d}"

def random_postal_code():
    return "".join([str(random.randint(0, 9)) for _ in range(10)])

def random_hphone():
    area_codes = ["021", "031", "071", "051", "011", "041", "061"]
    return f"{random.choice(area_codes)}{random.randint(1000000, 9999999):07d}"

def random_cphone():
    return f"09{random.randint(100000000, 999999999):09d}"

def random_persian_address(index):
    street_names = ["آزادی", "انقلاب", "ولیعصر", "جمهوری", "فردوسی"]
    alley_names = ["اول", "دوم", "سوم", "چهارم", "پنجم"]
    address = f"خیابان {random.choice(street_names)} کوچه {random.choice(alley_names)} پلاک {index + 1}"
    return address[:100]  # Ensure address is within 100 characters

# Generate student data
students = []
for i in range(11):
    department = random.choice(DEPARTMENTS)
    major = random.choice(MAJORS[department])
    student_data = {
        "stid": f"403114150{i+1:02d}",
        "fname": random.choice(FIRST_NAMES),
        "lname": random.choice(LAST_NAMES),
        "id": f"{random.randint(1000000000, 9999999999):010d}",
        "birth": random_birth_date(),
        "born_city": random.choice(CITIES),
        "address": random_persian_address(i),
        "postal_code": random_postal_code(),
        "cphone": random_cphone(),
        "hphone": random_hphone(),
        "father": random.choice(FATHER_NAMES),
        "ids_number": f"{random.randint(100000, 999999):06d}",
        "ids_letter": random.choice("الف ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی".split()),
        "ids_code": f"{random.randint(10, 99):02d}",
        "department": department,
        "major": major,
        "married": random.choice(["مجرد", "متاهل"]),
        "scourse_ids": None  # Optional field, set to None as per main.py
    }
    students.append(student_data)

# Generate professor data
professors = []
for i in range(11):
    department = random.choice(DEPARTMENTS)
    major = random.choice(MAJORS[department])
    professor_data = {
        "lid": f"{random.randint(100000, 999999):06d}",
        "fname": random.choice(FIRST_NAMES),
        "lname": random.choice(LAST_NAMES),
        "id": f"{random.randint(1000000000, 9999999999):010d}",
        "birth": random_birth_date(),
        "born_city": random.choice(CITIES),
        "address": random_persian_address(i),
        "postal_code": random_postal_code(),
        "cphone": random_cphone(),
        "hphone": random_hphone(),
        "department": department,
        "major": major,
        "lcourse_ids": None  # Optional field, set to None as per main.py
    }
    professors.append(professor_data)

# Generate course data
courses = []
for i in range(11):
    course_data = {
        "cid": f"{random.randint(10000, 99999):05d}",
        "Cname": random.choice(COURSE_NAMES),
        "department": random.choice(DEPARTMENTS),
        "credit": random.randint(1, 4)
    }
    courses.append(course_data)

def add_data(endpoint, data_list):
    for data in data_list:
        response = requests.post(f"{BASE_URL}/{endpoint}/", json=data)
        if response.status_code == 200:
            print(f"Added Successfully: {data}")
        else:
            print(f"Error in adding data: {data}, Status code: {response.status_code}, Message: {response.text}")

print("Adding Students...")
add_data("students", students)

print("\nAdding Professors...")
add_data("professors", professors)

print("\nAdding Courses...")
add_data("courses", courses)