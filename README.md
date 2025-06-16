# DeveloperThai-api

[![wakatime](https://wakatime.com/badge/user/68e3e2dc-451c-45ef-bca8-9fc3ad60e2f9/project/a5f98e5c-f564-42ed-b5c1-3b9f2cc11d2a.svg)](https://wakatime.com/badge/user/68e3e2dc-451c-45ef-bca8-9fc3ad60e2f9/project/a5f98e5c-f564-42ed-b5c1-3b9f2cc11d2a)

### Tech Stack

<img src="https://icon.icepanel.io/Technology/svg/TypeScript.svg" width="40px" height="40px" />&nbsp;
<img src="https://icon.icepanel.io/Technology/png-shadow-512/Express.png" width="40px" height="40px" />&nbsp;
<img src="https://icon.icepanel.io/Technology/svg/Node.js.svg" width="40px" height="40px" />&nbsp;
<img src="https://jwt.io/img/icon.svg" width="40px" height="40px" />&nbsp;
<img src="https://zod.dev/logo/logo-glow.png" width="40px" height="40px" />&nbsp;

---

### คำอธิบายโปรเจค

เป็นโปรเจค backend ที่สร้างขึ้นมาเพื่อบริการข้อมูลหนังสือเกี่ยวกับการเขียนโปรแกรมจากเว็บไซต์ [developerthai.com](https://developerthai.com/#) โดยสามารถเข้าถึงข้อมูลและจัดการข้อมูลผ่านเส้น api ที่ได้กำหนดไว้ให้

---

### ฟีเจอร์ที่สำคัญๆ

1. ระบบลงทะเบียนและระบบสมัครสมาชิก
2. การบริการข้อมูลข้อมูลหนังสือเช่น การดึงข้อมูล, การเพิ่มข้อมูล, แก้ไขข้อมูล และ ลบข้อมูล
3. การเข้าถึงข้อมูลหนังสือผ่าน API Key
4. มีระบบหมดอายุของ API Key หมดอายุภายใน 1 สัปดาห์
5. การค้นหาชื่อหนังสือ
6. การแก้ไขข้อมูลผู้ใช้งานและลบบัญชีผู้ใช้งาน

---

### การติดตั้งและใช้งานโปรเจค

เปิด Terminal ขึ้นมา

1. clone โปรเจค

```powershell
git clone https://github.com/WarinCode/DeveloperThai-api.git
```

2. เข้าไปยัง directory

```powershell
cd DeveloperThai-api
```

3. ติดตั้ง libraries

```powershell
npm install
```

4. สร้างไฟล์ `.env` แล้วกำหนดค่าตัวแปรสถาพแวดล้อมขึ้นมา

```powershell
new-item .env
```

5. สำหรับตัวอย่างการกำหนดค่าตัวแปร

```powershell
# PORT=1234
# SECRET_KEY=abcd
```

6. รัน Server

```powershell
npm run dev
```

---

### วิธีการใช้งาน

ก่อนที่จะเข้าใช้งานข้อมูลได้ต้องมีการสมัครบัญชีผู้ใช้งานก่อนแล้วทำการเปิดใช้ DeveloperThai API Key ก่อน เพื่อได้เข้าถึงและจัดการข้อมูลหนังสือได้

1. เข้าเว็บ [developerthai-api](https://developerthai-api.onrender.com/pages/sign-up.html) ทำการสร้างบัญชีผู้ใช้งานโดยกรอกชื่อผู้ใช้งาน, อีเมล และ รหัสผ่าน
2. เมื่อสมัครได้บัญชีผู้ใช้งานแล้วให้ไปที่หน้า [login](https://developerthai-api.onrender.com/pages/sign-in.html) ทำการเข้าสู่ระบบ
3. เมื่อเข้าไปแล้วจะเจอหน้าข้อมูลผู้ใช้งานเราสามารถจัดการข้อมูลผู้ใช้งานได้ทางหน้านี้ให้เราทำการคลิกไปที่ปุ่ม `สร้าง api key` เมื่อกดไปแล้วจะพบ api key ขึ้นมาให้เราทำการคัดลอกเก็บ key ตัวนี้เอาไว้ api key ตัวนี้มีอายุใช้งานได้ถึงภายใน 7 วันหากเลยไปกว่านั้นจะถือว่า key ตัวนี้หมดอายุใช้งานหาก key หมดอายุให้เรามากดคลิกปุ่มสร้าง api key ตัวใหม่ขึ้นมา
4. จากนั้นเราต้องการข้อมูล `token` ของผู้ใช้ให้เราทำการ คลิกขวา แล้ว กดตรวจสอบ หรือ กดปุ่ม F12 จากนั้นเข้าไปที่แผง Console พิมพ์คำสั่งนี้ลงไปเพื่อนำ token ไปใช้

```javascript
console.log(localStorage.getItem("token"));
```

5. ให้เราคัดลอก token ที่ได้มาเท่ากับตอนนี้เราจะได้ `api key` และ `token` มาแล้วพร้อมสำหรับการเข้าใช้งานบริการข้อมูลหนังสือของเว็บไซตืแล้ว

---

### HTTP methods

API Endpoint ของเว็บไซต์คือ [https://developerthai-api.onrender.com](developerthai-api.onrender.com) เป็น base url ให้ใช้ลิ้งค์นี้เป็นลิ้งค์ขึ้นต้นแล้วจากนั้นจะระบุ path ต่อท้ายเพื่อเข้าถึงและจัดการข้อมูลหนังสือโดยให้ระบุ path แล้วยิง request ตามเส้น api ที่กำหนดไว้ดังต่อไปนี้

### ตัวอย่างโค้ดสำหรับการยิง request

#### ยิง request ด้วย fetch function

```typescript
import { Books } from "../types/models/book.js";

const token: string = "โทเคนที่ทำการคัดลอกมา";
const key: string = "api key ที่ทำการคัดลอกมา";

fetch("https://developerthai-api.onrender.com/api/books", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "DeveloperThai-Api-Key": key,
  },
})
  .then((response: Response): Promise<Books> => response.json())
  .then((data: Books): void => console.log(data));
```

#### ยิง request ด้วย axios

```typescript
import axios from "axios";
import { Books } from "../types/models/book.js";

const token: string = "โทเคนที่ทำการคัดลอกมา";
const key: string = "api key ที่ทำการคัดลอกมา";
const instance: Axios.AxiosInstance = axios.create({
  baseURL: "https://developerthai-api.onrender.com",
  headers: {
    Authorization: `Bearer ${token}`,
    "DeveloperThai-Api-Key": key,
  },
});

try {
  const { data } = await instance.get<Books>("/api/books");
  const [book, ...otherBooks]: Books = data;
  console.log(book);
} catch (e: unknown) {
  console.error(e);
}
```

#### ตัวอย่างข้อมูลที่ response กลับมา

```json
{
  "bookName": "การเขียนเพิ่มเติมด้วยภาษา Python ฉบับ Cookbook",
  "imageUrl": "https://developerthai.com/covers/py_cookbook.png",
  "author": "บัญชา ปะสีละเตสัง",
  "isbn": 9786160854219,
  "price": 345,
  "pageCount": 384,
  "tableofContents": [
    "บทที่ 1  พื้นฐานทั่วไปที่ควรรู้เพิ่มเติม",
    "บทที่ 2   รับและแสดงผลข้อมูลวิธีต่างๆ",
    "บทที่ 3   สตริงและ Regular Expression",
    "บทที่ 4   วันเวลา เขตเวลา และปฏิทิน",
    "บทที่ 5   เทคนิคเกี่ยวกับลิสต์และทูเพิล",
    "บทที่ 6   เทคนิคเกี่ยวกับเซตและดิกชันนารี",
    "บทที่ 7   ฟังก์ชัน แลมบ์ดาและ Decorator",
    "บทที่ 8   เขียนโปรแกรมแบบ OOP",
    "บทที่ 9   สร้าง GUI ด้วย PySide และ Qt Designer",
    "บทที่ 10   ฐานข้อมูลและรายงานแบบ PDF",
    "บทที่ 11   ดึงข้อมูลจากเว็บ (Web Scraping)",
    "บทที่ 12   เขียนโปรแกรมบนเว็บ (Flask Framework)",
    "บทที่ 13   Data Science และ Data Visualization",
    "บทที่ 14   Machine Learning"
  ]
}
```

### สำหรับเมธอด GET

- `/` response ตอบกลับมาเป็นข้อความ "Hello World!"
- `/api/books` response ตอบกลับมาเป็นข้อมูล json เป็น array ของข้อมูลหนังสือทั้งหมด
- `/api/books/:isbn` parameter isbn คือเลข isbn ของหนังสือใส่เป็นตัวเลข response ตอบกลับเป็นข้อมูลหนังสือด้วยหมายเลข isbn ของหนังสือนั้น
- `/api/books/search/?keyword=:keyword` response ตอบกลับมาเป็น array ของชุดข้อมูลหนังสือหลายๆเล่ม, เล่มเดียว หรือ ไม่มี ขึ้นอยู่กับ query string (keyword) ที่ยิงเข้ามาเพื่อนำไปใช้ค้นหาชื่อหนังสือที่ตรงกันหรือคล้ายคลึงกัน

### สำหรับเมธอด POST

- `/api/books/create` เพิ่มข้อมูลหนังสือ 1 เล่มโดยให้ส่งมาเป็นข้อมูล json มี properties ตามที่กำหนด ตัวอย่าง

```json
{
  "bookName": "book1234",
  "imageUrl": "https://i.pinimg.com/736x/be/31/d7/be31d7e4e3c7b60d1fd058f4fde5abad.jpg",
  "author": null,
  "isbn": 2351256980382,
  "price": 650,
  "pageCount": 132,
  "tableofContents": null
}
```

ถ้าเพิ่มข้อมูลสำเร็จจะ response กลับมาเป็นข้อความว่าเพิ่มข้อมูลสำเร็จแล้ว

### สำหรับเมธอด PUT

- `/api/books/update/:isbn` อัปเดตข้อมูลหนังสือตามหมายเลข id นั้นที่ระบุ ส่วนข้อมูลที่จะอัปเดตนั้นเป็น json เหมือนกับเมธอด POST ข้อมูลที่ response กลับมาเป็นข้อความที่อัปเดตเรียบร้อยแล้ว

```json
{
  "bookName": "book48902",
  "imageUrl": "https://i.pinimg.com/736x/be/31/d7/be31d7e4e3c7b60d1fd058f4fde5abad.jpg",
  "author": "John Doe",
  "isbn": 4930423330295,
  "price": 120,
  "pageCount": 36,
  "tableofContents": null
}
```

### สำหรับเมธอด DELETE

- `/api/books/delete/:isbn` ลบข้อมูลหนังสือนั้นตามหมายเลข parameter id ที่ระบุ response กลับมาเป็น ข้อความที่ลบหนังสือเรียบร้อยแล้ว

### สำหรับเมธอด PATCH

- `/api/books/update/:isbn/bookname` แก้ไขชื่อหนังสือโดยระบุ parameter เป็นเลข isbn แล้วข้อมูลหนังสือใส่แค่ชื่อ property ที่จะแก้ไขเท่านั้น ข้อมูลที่ response ตอบกลับมาเป็นข้อความที่แก้ไขเรียบร้อยแล้ว

```json
{
  "bookName": "book555"
}
```

- `/api/books/update/:isbn/isbn` แก้ไขหมายเลข isbn ของหนังสือโดยหมายเลข isbn ที่เป็น parameter ต้องเป็นหมายเลข isbn อันเก่าส่วนค่าที่จะอัปเดตเป็นหมายเลข isbn อันใหม่

```json
{
  "isbn": 4503215670342
}
```

- `/api/books/update/:isbn/image` แก้ไขลิ้งค์รูปภาพหนังสือ

```json
{
  "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp_SN-AeblwZVqA_q8THnP_uvHxtmwnHbcBQ&s"
}
```

- `/api/books/update/:isbn/author` แก้ไขชื่อผู้แต่ง

```json
{
  "author": "Jane Doe"
}
```

- `/api/books/update/:isbn/price` แก้ไขราคาหนังสือ

```json
{
  "price": 430
}
```

- `/api/books/update/:isbn/page-count` แก้ไขจำนวนหน้าหนังสือ

```json
{
  "pageCount": 331
}
```

- `/api/books/update/:isbn/table-of-contents` แก้ไขหัวข้อรายชื่อในสารบัญ

```json
{
  "tableofContents": [
    "1. A",
    "2. B",
    "3. C"
  ]
}
```

---

### คำเตือน

สำหรับบางกรณีที่ยิง request ไม่ตรงตามเงื่อนไขที่ระบุจะมี response ตอบกลับมาเป็น error แทนเพราะชะนั้นก่อนยิง request ให้เช็ค path, parameter หรืออื่นๆ ให้แน่ชัดว่าถูกต้องไหมก่อนทำการยิงมาที่เส้น api นั้น
