import re
import random
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, validator
from typing import List

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://reznum.ir", "https://api.reznum.ir"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
DATABASE_URL = "sqlite:///./university.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    STID = Column(String, unique=True, index=True)
    student_fname = Column(String)
    student_lname = Column(String)
    father = Column(String)
    IDS = Column(String)
    BornCity = Column(String)
    Address = Column(String)
    PostalCode = Column(String)
    HPhone = Column(String)
    Department = Column(String)
    Major = Column(String)
    Married = Column(String)
    national_id = Column(String)
    birth_date = Column(String)

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(String, unique=True, index=True)
    teacher_fname = Column(String)
    teacher_lname = Column(String)
    father = Column(String)
    IDS = Column(String)
    BornCity = Column(String)
    Address = Column(String)
    PostalCode = Column(String)
    HPhone = Column(String)
    Department = Column(String)
    national_id = Column(String)
    birth_date = Column(String)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String)
    units = Column(Integer)
    department = Column(String)
    teacher_id = Column(String, ForeignKey("teachers.teacher_id"))

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class StudentCreate(BaseModel):
    student_fname: str
    student_lname: str
    father: str
    IDS: str
    BornCity: str
    Address: str
    PostalCode: str
    HPhone: str
    Department: str
    Major: str
    Married: str
    national_id: str
    birth_date: str

    @validator("student_fname", "student_lname", "father")
    def validate_persian_name(cls, v):
        if not re.match(r'^[آ-ی\s]+$', v):
            raise ValueError("فقط حروف فارسی و فاصله مجاز است")
        return v

    @validator("IDS")
    def validate_IDS(cls, v):
        if not re.match(r'^\d{6}$', v):
            raise ValueError("سریال شناسنامه باید ۶ رقم باشد")
        return v

    @validator("PostalCode")
    def validate_postal_code(cls, v):
        if not re.match(r'^\d{10}$', v):
            raise ValueError("کد پستی باید ۱۰ رقم باشد")
        return v

    @validator("HPhone")
    def validate_phone(cls, v):
        if not re.match(r'^0\d{2}\d{8}$', v):
            raise ValueError("تلفن ثابت باید با فرمت ۰۲۱xxxxxxxx باشد")
        return v

    @validator("national_id")
    def validate_national_id(cls, v):
        if not re.match(r'^\d{10}$', v):
            raise ValueError("کدملی باید ۱۰ رقم باشد")
        return v

    @validator("birth_date")
    def validate_birth_date(cls, v):
        try:
            year, month, day = map(int, v.split('/'))
            if not (1300 <= year <= 1400 and 1 <= month <= 12 and 1 <= day <= 31):
                raise ValueError("تاریخ تولد باید بین ۱۳۰۰ تا ۱۴۰۰ باشد")
        except:
            raise ValueError("فرمت تاریخ باید yyyy/mm/dd باشد")
        return v

class StudentResponse(StudentCreate):
    STID: str
    class Config:
        orm_mode = True

class TeacherCreate(BaseModel):
    teacher_fname: str
    teacher_lname: str
    father: str
    IDS: str
    BornCity: str
    Address: str
    PostalCode: str
    HPhone: str
    Department: str
    national_id: str
    birth_date: str

    @validator("teacher_fname", "teacher_lname", "father")
    def validate_persian_name(cls, v):
        if not re.match(r'^[آ-ی\s]+$', v):
            raise ValueError("فقط حروف فارسی و فاصله مجاز است")
        return v

    @validator("IDS")
    def validate_IDS(cls, v):
        if not re.match(r'^\d{6}$', v):
            raise ValueError("سریال شناسنامه باید ۶ رقم باشد")
        return v

    @validator("PostalCode")
    def validate_postal_code(cls, v):
        if not re.match(r'^\d{10}$', v):
            raise ValueError("کد پستی باید ۱۰ رقم باشد")
        return v

    @validator("HPhone")
    def validate_phone(cls, v):
        if not re.match(r'^0\d{2}\d{8}$', v):
            raise ValueError("تلفن ثابت باید با فرمت ۰۲۱xxxxxxxx باشد")
        return v

    @validator("national_id")
    def validate_national_id(cls, v):
        if not re.match(r'^\d{10}$', v):
            raise ValueError("کدملی باید ۱۰ رقم باشد")
        return v

    @validator("birth_date")
    def validate_birth_date(cls, v):
        try:
            year, month, day = map(int, v.split('/'))
            if not (1300 <= year <= 1400 and 1 <= month <= 12 and 1 <= day <= 31):
                raise ValueError("تاریخ تولد باید بین ۱۳۰۰ تا ۱۴۰۰ باشد")
        except:
            raise ValueError("فرمت تاریخ باید yyyy/mm/dd باشد")
        return v

class TeacherResponse(TeacherCreate):
    teacher_id: str
    class Config:
        orm_mode = True

class CourseCreate(BaseModel):
    course_name: str
    units: int
    department: str
    teacher_id: str

    @validator("units")
    def validate_units(cls, v):
        if not 1 <= v <= 4:
            raise ValueError("تعداد واحد باید بین ۱ تا ۴ باشد")
        return v

class CourseResponse(CourseCreate):
    id: int
    class Config:
        orm_mode = True

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helpers
def generate_student_id(db: Session):
    last_student = db.query(Student).order_by(Student.id.desc()).first()
    if not last_student:
        return "40311415000"
    last_num = int(last_student.STID[-2:])
    if last_num >= 99:
        raise HTTPException(status_code=400, detail="ظرفیت شماره دانشجویی پر شده است")
    return f"403114150{last_num + 1:02d}"

def generate_teacher_id(db: Session):
    while True:
        teacher_id = f"{random.randint(100000, 999999)}"
        if not db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first():
            return teacher_id

# Routes
@app.post("/students", response_model=StudentResponse)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.national_id == student.national_id).first()
    if db_student:
        raise HTTPException(status_code=400, detail="کدملی قبلاً ثبت شده است")
    stid = generate_student_id(db)
    db_student = Student(**student.dict(), STID=stid)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.get("/students", response_model=List[StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()

@app.get("/students/{stid}", response_model=StudentResponse)
def get_student(stid: str, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.STID == stid).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="دانشجو یافت نشد")
    return db_student

@app.put("/students/{stid}", response_model=StudentResponse)
def update_student(stid: str, student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.STID == stid).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="دانشجو یافت نشد")
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.delete("/students/{stid}")
def delete_student(stid: str, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.STID == stid).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="دانشجو یافت نشد")
    db.delete(db_student)
    db.commit()
    return {"detail": "دانشجو حذف شد"}

@app.post("/teachers", response_model=TeacherResponse)
def create_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    db_teacher = db.query(Teacher).filter(Teacher.national_id == teacher.national_id).first()
    if db_teacher:
        raise HTTPException(status_code=400, detail="کدملی قبلاً ثبت شده است")
    teacher_id = generate_teacher_id(db)
    db_teacher = Teacher(**teacher.dict(), teacher_id=teacher_id)
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@app.get("/teachers", response_model=List[TeacherResponse])
def get_teachers(db: Session = Depends(get_db)):
    return db.query(Teacher).all()

@app.get("/teachers/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id: str, db: Session = Depends(get_db)):
    db_teacher = db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="استاد یافت نشد")
    return db_teacher

@app.put("/teachers/{teacher_id}", response_model=TeacherResponse)
def update_teacher(teacher_id: str, teacher: TeacherCreate, db: Session = Depends(get_db)):
    db_teacher = db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="استاد یافت نشد")
    for key, value in teacher.dict().items():
        setattr(db_teacher, key, value)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@app.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: str, db: Session = Depends(get_db)):
    db_teacher = db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="استاد یافت نشد")
    db.delete(db_teacher)
    db.commit()
    return {"detail": "استاد حذف شد"}

@app.post("/courses", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    db_teacher = db.query(Teacher).filter(Teacher.teacher_id == course.teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=400, detail="استاد یافت نشد")
    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.get("/courses", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@app.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="درس یافت نشد")
    return db_course

@app.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(course_id: int, course: CourseCreate, db: Session = Depends(get_db)):
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="درس یافت نشد")
    db_teacher = db.query(Teacher).filter(Teacher.teacher_id == course.teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=400, detail="استاد یافت نشد")
    for key, value in course.dict().items():
        setattr(db_course, key, value)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="درس یافت نشد")
    db.delete(db_course)
    db.commit()
    return {"detail": "درس حذف شد"}

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        ssl_keyfile="/etc/letsencrypt/live/api.reznum.ir/privkey.pem",
        ssl_certfile="/etc/letsencrypt/live/api.reznum.ir/fullchain.pem"
    )