const API_URL = "http://141.11.1.42:8000";
let editType = null;
let editId = null;
let notificationTimeout = null;
let isNotificationActive = false;

function showNotification(message, isError = false) {
    try {
        console.log("Attempting to show notification:", message, "isError:", isError);
        if (isNotificationActive) {
            console.log("Notification already active, closing previous...");
            closeNotification();
        }
        isNotificationActive = true;

        const notification = document.getElementById("notification");
        const messageEl = document.getElementById("notification-message");
        const progressBar = document.getElementById("progress-bar");

        if (!notification || !messageEl || !progressBar) {
            console.error("Notification elements not found in DOM");
            isNotificationActive = false;
            return;
        }

        // پاک کردن تایمر قبلی
        if (notificationTimeout) {
            console.log("Clearing previous timeout");
            clearTimeout(notificationTimeout);
        }

        messageEl.textContent = message;
        notification.classList.remove("hidden", "bg-green-500", "bg-red-500");
        notification.classList.add(isError ? "bg-red-500" : "bg-green-500");
        progressBar.style.width = "100%";
        progressBar.style.transition = "width 5s linear";

        // اطمینان از شروع انیمیشن
        setTimeout(() => {
            progressBar.style.width = "0%";
            console.log("Progress bar animation started");
        }, 10);

        notificationTimeout = setTimeout(() => {
            console.log("Notification timeout triggered");
            closeNotification();
            isNotificationActive = false;
        }, 5000);


        window.addEventListener("beforeunload", () => {
            console.log("Page is about to refresh, notification active:", isNotificationActive);
        }, { once: true });
    } catch (error) {
        console.error("Error in showNotification:", error);
        isNotificationActive = false;
    }
}

function closeNotification() {
    try {
        console.log("Closing notification");
        const notification = document.getElementById("notification");
        if (notification) {
            notification.classList.add("hidden");
            const progressBar = document.getElementById("progress-bar");
            if (progressBar) {
                progressBar.style.transition = "none";
                progressBar.style.width = "100%";
            }
            notificationTimeout = null;
            isNotificationActive = false;
        } else {
            console.error("Notification element not found in DOM");
        }
    } catch (error) {
        console.error("Error in closeNotification:", error);
    }
}

async function loadReport(type) {
    try {
        const response = await fetch(`${API_URL}/${type}`);
        if (!response.ok) throw new Error("خطا در بارگذاری داده‌ها");
        const data = await response.json();
        let html = `<table class="w-full text-right"><thead><tr>`;
        if (type === "students") {
            html += `<th>شماره دانشجویی</th><th>نام</th><th>نام خانوادگی</th><th>عملیات</th></tr>`;
            data.forEach(item => {
                html += `<tr>
                    <td>${item.STID}</td>
                    <td>${item.student_fname}</td>
                    <td>${item.student_lname}</td>
                    <td>
                        <button onclick="editItem('students', '${item.STID}')" class="bg-yellow-500 text-white p-1 rounded mx-1">🖌️</button>
                        <button onclick="deleteItem('students', '${item.STID}')" class="bg-red-500 text-white p-1 rounded mx-1">🗑️</button>
                    </td>
                </tr>`;
            });
        } else if (type === "teachers") {
            html += `<th>کد استادی</th><th>نام</th><th>نام خانوادگی</th><th>عملیات</th></tr>`;
            data.forEach(item => {
                html += `<tr>
                    <td>${item.teacher_id}</td>
                    <td>${item.teacher_fname}</td>
                    <td>${item.teacher_lname}</td>
                    <td>
                        <button onclick="editItem('teachers', '${item.teacher_id}')" class="bg-yellow-500 text-white p-1 rounded mx-1">🖌️</button>
                        <button onclick="deleteItem('teachers', '${item.teacher_id}')" class="bg-red-500 text-white p-1 rounded mx-1">🗑️</button>
                    </td>
                </tr>`;
            });
        } else if (type === "courses") {
            html += `<th>نام درس</th><th>واحد</th><th>دانشکده</th><th>عملیات</th></tr>`;
            data.forEach(item => {
                html += `<tr>
                    <td>${item.course_name}</td>
                    <td>${item.units}</td>
                    <td>${item.department}</td>
                    <td>
                        <button onclick="editItem('courses', ${item.id})" class="bg-yellow-500 text-white p-1 rounded mx-1">🖌️</button>
                        <button onclick="deleteItem('courses', ${item.id})" class="bg-red-500 text-white p-1 rounded mx-1">🗑️</button>
                    </td>
                </tr>`;
            });
        }
        html += `</table>`;
        document.getElementById("report-content").innerHTML = html;
    } catch (error) {
        showNotification(error.message, true);
    }
}

async function editItem(type, id) {
    console.log(`Editing ${type} with ID: ${id}`);
    editType = type;
    editId = id;
    try {
        const response = await fetch(`${API_URL}/${type}/${id}`);
        if (!response.ok) throw new Error(`خطا در بارگذاری داده‌ها: ${response.status}`);
        const data = await response.json();
        console.log("Data received:", data);
        let formHtml = "";
        if (type === "students") {
            formHtml = `
                <input type="text" name="student_fname" value="${data.student_fname}" placeholder="نام" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="student_lname" value="${data.student_lname}" placeholder="نام خانوادگی" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="father" value="${data.father}" placeholder="نام پدر" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="IDS" value="${data.IDS}" placeholder="سریال شناسنامه" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <select name="BornCity" class="city-select w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                    <option value="تهران" ${data.BornCity === "تهران" ? "selected" : ""}>تهران</option>
                    <option value="اصفهان" ${data.BornCity === "اصفهان" ? "selected" : ""}>اصفهان</option>
                    <option value="شیراز" ${data.BornCity === "شیراز" ? "selected" : ""}>شیراز</option>
                    <option value="مشهد" ${data.BornCity === "مشهد" ? "selected" : ""}>مشهد</option>
                    <option value="تبریز" ${data.BornCity === "تبریز" ? "selected" : ""}>تبریز</option>
                    <option value="کرج" ${data.BornCity === "کرج" ? "selected" : ""}>کرج</option>
                    <option value="اهواز" ${data.BornCity === "اهواز" ? "selected" : ""}>اهواز</option>
                    <option value="قم" ${data.BornCity === "قم" ? "selected" : ""}>قم</option>
                    <option value="کرمانشاه" ${data.BornCity === "کرمانشاه" ? "selected" : ""}>کرمانشاه</option>
                    <option value="ارومیه" ${data.BornCity === "ارومیه" ? "selected" : ""}>ارومیه</option>
                    <option value="رشت" ${data.BornCity === "رشت" ? "selected" : ""}>رشت</option>
                    <option value="زاهدان" ${data.BornCity === "زاهدان" ? "selected" : ""}>زاهدان</option>
                    <option value="همدان" ${data.BornCity === "همدان" ? "selected" : ""}>همدان</option>
                    <option value="کرمان" ${data.BornCity === "کرمان" ? "selected" : ""}>کرمان</option>
                    <option value="یزد" ${data.BornCity === "یزد" ? "selected" : ""}>یزد</option>
                    <option value="اردبیل" ${data.BornCity === "اردبیل" ? "selected" : ""}>اردبیل</option>
                    <option value="بندرعباس" ${data.BornCity === "بندرعباس" ? "selected" : ""}>بندرعباس</option>
                    <option value="اراک" ${data.BornCity === "اراک" ? "selected" : ""}>اراک</option>
                    <option value="ایلام" ${data.BornCity === "ایلام" ? "selected" : ""}>ایلام</option>
                    <option value="بوشهر" ${data.BornCity === "بوشهر" ? "selected" : ""}>بوشهر</option>
                    <option value="شهرکرد" ${data.BornCity === "شهرکرد" ? "selected" : ""}>شهرکرد</option>
                    <option value="بیرجند" ${data.BornCity === "بیرجند" ? "selected" : ""}>بیرجند</option>
                    <option value="ساری" ${data.BornCity === "ساری" ? "selected" : ""}>ساری</option>
                    <option value="گرگان" ${data.BornCity === "گرگان" ? "selected" : ""}>گرگان</option>
                    <option value="خرم‌آباد" ${data.BornCity === "خرم‌آباد" ? "selected" : ""}>خرم‌آباد</option>
                    <option value="سنندج" ${data.BornCity === "سنندج" ? "selected" : ""}>سنندج</option>
                    <option value="یاسوج" ${data.BornCity === "یاسوج" ? "selected" : ""}>یاسوج</option>
                    <option value="زنجان" ${data.BornCity === "زنجان" ? "selected" : ""}>زنجان</option>
                    <option value="قزوین" ${data.BornCity === "قزوین" ? "selected" : ""}>قزوین</option>
                    <option value="بجنورد" ${data.BornCity === "بجنورد" ? "selected" : ""}>بجنورد</option>
                    <option value="سمنان" ${data.BornCity === "سمنان" ? "selected" : ""}>سمنان</option>
                </select>
                <input type="text" name="Address" value="${data.Address}" placeholder="آدرس" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="PostalCode" value="${data.PostalCode}" placeholder="کد پستی" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="HPhone" value="${data.HPhone}" placeholder="تلفن ثابت" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <select name="Department" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                    <option value="فنی مهندسی" ${data.Department === "فنی مهندسی" ? "selected" : ""}>فنی مهندسی</option>
                    <option value="علوم پایه" ${data.Department === "علوم پایه" ? "selected" : ""}>علوم پایه</option>
                    <option value="اقتصاد" ${data.Department === "اقتصاد" ? "selected" : ""}>اقتصاد</option>
                </select>
                <select name="Major" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                    <option value="مهندسی کامپیوتر" ${data.Major === "مهندسی کامپیوتر" ? "selected" : ""}>مهندسی کامپیوتر</option>
                    <option value="مهندسی برق" ${data.Major === "مهندسی برق" ? "selected" : ""}>مهندسی برق</option>
                    <option value="مهندسی مکانیک" ${data.Major === "مهندسی مکانیک" ? "selected" : ""}>مهندسی مکانیک</option>
                    <option value="مهندسی عمران" ${data.Major === "مهندسی عمران" ? "selected" : ""}>مهندسی عمران</option>
                    <option value="مهندسی شیمی" ${data.Major === "مهندسی شیمی" ? "selected" : ""}>مهندسی شیمی</option>
                    <option value="مهندسی صنایع" ${data.Major === "مهندسی صنایع" ? "selected" : ""}>مهندسی صنایع</option>
                    <option value="مهندسی هوافضا" ${data.Major === "مهندسی هوافضا" ? "selected" : ""}>مهندسی هوافضا</option>
                    <option value="مهندسی مواد" ${data.Major === "مهندسی مواد" ? "selected" : ""}>مهندسی مواد</option>
                    <option value="مهندسی نفت" ${data.Major === "مهندسی نفت" ? "selected" : ""}>مهندسی نفت</option>
                    <option value="مهندسی معماری" ${data.Major === "مهندسی معماری" ? "selected" : ""}>مهندسی معماری</option>
                    <option value="ریاضی" ${data.Major === "ریاضی" ? "selected" : ""}>ریاضی</option>
                    <option value="فیزیک" ${data.Major === "فیزیک" ? "selected" : ""}>فیزیک</option>
                    <option value="شیمی" ${data.Major === "شیمی" ? "selected" : ""}>شیمی</option>
                    <option value="زیست‌شناسی" ${data.Major === "زیست‌شناسی" ? "selected" : ""}>زیست‌شناسی</option>
                    <option value="علوم کامپیوتر" ${data.Major === "علوم کامپیوتر" ? "selected" : ""}>علوم کامپیوتر</option>
                    <option value="آمار" ${data.Major === "آمار" ? "selected" : ""}>آمار</option>
                    <option value="زمین‌شناسی" ${data.Major === "زمین‌شناسی" ? "selected" : ""}>زمین‌شناسی</option>
                    <option value="بیوشیمی" ${data.Major === "بیوشیمی" ? "selected" : ""}>بیوشیمی</option>
                    <option value="بیوفیزیک" ${data.Major === "بیوفیزیک" ? "selected" : ""}>بیوفیزیک</option>
                    <option value="ریاضی کاربردی" ${data.Major === "ریاضی کاربردی" ? "selected" : ""}>ریاضی کاربردی</option>
                    <option value="اقتصاد نظری" ${data.Major === "اقتصاد نظری" ? "selected" : ""}>اقتصاد نظری</option>
                    <option value="اقتصاد بازرگانی" ${data.Major === "اقتصاد بازرگانی" ? "selected" : ""}>اقتصاد بازرگانی</option>
                    <option value="مدیریت مالی" ${data.Major === "مدیریت مالی" ? "selected" : ""}>مدیریت مالی</option>
                    <option value="حسابداری" ${data.Major === "حسابداری" ? "selected" : ""}>حسابداری</option>
                    <option value="بانکداری" ${data.Major === "بانکداری" ? "selected" : ""}>بانکداری</option>
                    <option value="اقتصاد صنعتی" ${data.Major === "اقتصاد صنعتی" ? "selected" : ""}>اقتصاد صنعتی</option>
                    <option value="اقتصاد کشاورزی" ${data.Major === "اقتصاد کشاورزی" ? "selected" : ""}>اقتصاد کشاورزی</option>
                    <option value="مدیریت بازرگانی" ${data.Major === "مدیریت بازرگانی" ? "selected" : ""}>مدیریت بازرگانی</option>
                    <option value="اقتصاد بین‌الملل" ${data.Major === "اقتصاد بین‌الملل" ? "selected" : ""}>اقتصاد بین‌الملل</option>
                    <option value="مدیریت بیمه" ${data.Major === "مدیریت بیمه" ? "selected" : ""}>مدیریت بیمه</option>
                </select>
                <select name="Married" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                    <option value="مجرد" ${data.Married === "مجرد" ? "selected" : ""}>مجرد</option>
                    <option value="متاهل" ${data.Married === "متاهل" ? "selected" : ""}>متاهل</option>
                </select>
                <input type="text" name="national_id" value="${data.national_id}" placeholder="کدملی" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="birth_date" value="${data.birth_date}" placeholder="تاریخ تولد (yyyy/mm/dd)" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">ثبت تغییرات</button>
            `;
        } else if (type === "teachers") {
            formHtml = `
                <input type="text" name="teacher_fname" value="${data.teacher_fname}" placeholder="نام" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="teacher_lname" value="${data.teacher_lname}" placeholder="نام خانوادگی" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="father" value="${data.father}" placeholder="نام پدر" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="IDS" value="${data.IDS}" placeholder="سریال شناسنامه" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <select name="BornCity" class="city-select w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                    <option value="تهران" ${data.BornCity === "تهران" ? "selected" : ""}>تهران</option>
                    <option value="اصفهان" ${data.BornCity === "اصفهان" ? "selected" : ""}>اصفهان</option>
                    <option value="شیراز" ${data.BornCity === "شیراز" ? "selected" : ""}>شیراز</option>
                    <option value="مشهد" ${data.BornCity === "مشهد" ? "selected" : ""}>مشهد</option>
                    <option value="تبریز" ${data.BornCity === "تبریز" ? "selected" : ""}>تبریز</option>
                    <option value="کرج" ${data.BornCity === "کرج" ? "selected" : ""}>کرج</option>
                    <option value="اهواز" ${data.BornCity === "اهواز" ? "selected" : ""}>اهواز</option>
                    <option value="قم" ${data.BornCity === "قم" ? "selected" : ""}>قم</option>
                    <option value="کرمانشاه" ${data.BornCity === "کرمانشاه" ? "selected" : ""}>کرمانشاه</option>
                    <option value="ارومیه" ${data.BornCity === "ارومیه" ? "selected" : ""}>ارومیه</option>
                    <option value="رشت" ${data.BornCity === "رشت" ? "selected" : ""}>رشت</option>
                    <option value="زاهدان" ${data.BornCity === "زاهدان" ? "selected" : ""}>زاهدان</option>
                    <option value="همدان" ${data.BornCity === "همدان" ? "selected" : ""}>همدان</option>
                    <option value="کرمان" ${data.BornCity === "کرمان" ? "selected" : ""}>کرمان</option>
                    <option value="یزد" ${data.BornCity === "یزد" ? "selected" : ""}>یزد</option>
                    <option value="اردبیل" ${data.BornCity === "اردبیل" ? "selected" : ""}>اردبیل</option>
                    <option value="بندرعباس" ${data.BornCity === "بندرعباس" ? "selected" : ""}>بندرعباس</option>
                    <option value="اراک" ${data.BornCity === "اراک" ? "selected" : ""}>اراک</option>
                    <option value="ایلام" ${data.BornCity === "ایلام" ? "selected" : ""}>ایلام</option>
                    <option value="بوشهر" ${data.BornCity === "بوشهر" ? "selected" : ""}>بوشهر</option>
                    <option value="شهرکرد" ${data.BornCity === "شهرکرد" ? "selected" : ""}>شهرکرد</option>
                    <option value="بیرجند" ${data.BornCity === "بیرجند" ? "selected" : ""}>بیرجند</option>
                    <option value="ساری" ${data.BornCity === "ساری" ? "selected" : ""}>ساری</option>
                    <option value="گرگان" ${data.BornCity === "گرگان" ? "selected" : ""}>گرگان</option>
                    <option value="خرم‌آباد" ${data.BornCity === "خرم‌آباد" ? "selected" : ""}>خرم‌آباد</option>
                    <option value="سنندج" ${data.BornCity === "سنندج" ? "selected" : ""}>سنندج</option>
                    <option value="یاسوج" ${data.BornCity === "یاسوج" ? "selected" : ""}>یاسوج</option>
                    <option value="زنجان" ${data.BornCity === "زنجان" ? "selected" : ""}>زنجان</option>
                    <option value="قزوین" ${data.BornCity === "قزوین" ? "selected" : ""}>قزوین</option>
                    <option value="بجنورد" ${data.BornCity === "بجنورد" ? "selected" : ""}>بجنورد</option>
                    <option value="سمنان" ${data.BornCity === "سمنان" ? "selected" : ""}>سمنان</option>
                </select>
                <input type="text" name="Address" value="${data.Address}" placeholder="آدرس" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="PostalCode" value="${data.PostalCode}" placeholder="کد پستی" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="HPhone" value="${data.HPhone}" placeholder="تلفن ثابت" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <select name="Department" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                    <option value="فنی مهندسی" ${data.Department === "فنی مهندسی" ? "selected" : ""}>فنی مهندسی</option>
                    <option value="علوم پایه" ${data.Department === "علوم پایه" ? "selected" : ""}>علوم پایه</option>
                    <option value="اقتصاد" ${data.Department === "اقتصاد" ? "selected" : ""}>اقتصاد</option>
                </select>
                <input type="text" name="national_id" value="${data.national_id}" placeholder="کدملی" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="text" name="birth_date" value="${data.birth_date}" placeholder="تاریخ تولد (yyyy/mm/dd)" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">ثبت تغییرات</button>
            `;
        } else if (type === "courses") {
            formHtml = `
                <input type="text" name="course_name" value="${data.course_name}" placeholder="نام درس" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <input type="number" name="units" value="${data.units}" placeholder="تعداد واحد" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <select name="department" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                    <option value="فنی مهندسی" ${data.department === "فنی مهندسی" ? "selected" : ""}>فنی مهندسی</option>
                    <option value="علوم پایه" ${data.department === "علوم پایه" ? "selected" : ""}>علوم پایه</option>
                    <option value="اقتصاد" ${data.department === "اقتصاد" ? "selected" : ""}>اقتصاد</option>
                </select>
                <input type="text" name="teacher_id" value="${data.teacher_id}" placeholder="کد استادی" class="w-full p-3 bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required>
                <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">ثبت تغییرات</button>
            `;
        }
        document.getElementById("edit-form").innerHTML = formHtml;
        document.getElementById("edit-section").classList.remove("hidden");
    } catch (error) {
        console.error("Error in editItem:", error);
        showNotification(error.message, true);
    }
}

async function deleteItem(type, id) {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این مورد را حذف کنید؟")) return;
    try {
        const response = await fetch(`${API_URL}/${type}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("خطا در حذف داده");
        showNotification("حذف با موفقیت انجام شد");
        loadReport(type);
    } catch (error) {
        showNotification(error.message, true);
    }
}

document.getElementById("student-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Student form submitted");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Student form data:", data);
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "خطا در ثبت دانشجو");
        }
        showNotification("دانشجو با موفقیت ثبت شد");
        // تأخیر برای اطمینان از نمایش نوتیفیکیشن
        setTimeout(() => {
            e.target.reset();
            console.log("Student form reset after notification");
        }, 5000);
    } catch (error) {
        console.error("Error in student-form submit:", error);
        showNotification(error.message || "خطا در ثبت دانشجو", true);
    }
});

document.getElementById("teacher-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Teacher form submitted");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
        const response = await fetch(`${API_URL}/teachers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "خطا در ثبت استاد");
        }
        showNotification("استاد با موفقیت ثبت شد");
        // تأخیر برای اطمینان از نمایش نوتیفیکیشن
        setTimeout(() => {
            e.target.reset();
            console.log("Teacher form reset after notification");
        }, 5000);
    } catch (error) {
        showNotification(error.message || "خطا در ثبت استاد", true);
    }
});

document.getElementById("course-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Course form submitted");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.units = parseInt(data.units);
    try {
        const response = await fetch(`${API_URL}/courses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "خطا در ثبت درس");
        }
        showNotification("درس با موفقیت ثبت شد");
        // تأخیر برای اطمینان از نمایش نوتیفیکیشن
        setTimeout(() => {
            e.target.reset();
            console.log("Course form reset after notification");
        }, 5000);
    } catch (error) {
        showNotification(error.message || "خطا در ثبت درس", true);
    }
});

document.getElementById("edit-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Edit form submitted");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (editType === "courses") data.units = parseInt(data.units);
    console.log(`Submitting edit for ${editType} with ID: ${editId}`, data);
    try {
        const response = await fetch(`${API_URL}/${editType}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "خطا در ثبت تغییرات");
        }
        showNotification("تغییرات با موفقیت ثبت شد");
        document.getElementById("edit-section").classList.add("hidden");
        loadReport(editType);
    } catch (error) {
        console.error("Error in edit-form submit:", error);
        showNotification(error.message || "خطا در ثبت تغییرات", true);
    }
});