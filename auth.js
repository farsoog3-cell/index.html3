import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDVYoWats4bhKLbO8cu9hQ73WBjty-e5mA",
  authDomain: "aljj-28d36.firebaseapp.com",
  databaseURL: "https://aljj-28d36-default-rtdb.firebaseio.com",
  projectId: "aljj-28d36",
  storageBucket: "aljj-28d36.firebasestorage.app",
  messagingSenderId: "256012982420",
  appId: "1:256012982420:web:3a1541af04b99d658e7c81",
  measurementId: "G-43WH1GKJFC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// عناصر الصفحة
const formTitle = document.getElementById("formTitle");
const nameInput = document.getElementById("nameInput");
const phoneInput = document.getElementById("phoneInput");
const passwordInput = document.getElementById("passwordInput");
const submitBtn = document.getElementById("submitBtn");
const switchForm = document.getElementById("switchForm");

let isLogin = true;

// تبديل بين تسجيل الدخول وإنشاء حساب
switchForm.addEventListener("click", () => {
    isLogin = !isLogin;
    if(isLogin){
        formTitle.textContent = "تسجيل الدخول";
        nameInput.style.display = "none";
        submitBtn.textContent = "دخول";
        switchForm.parentElement.innerHTML = 'ليس لديك حساب؟ <span id="switchForm">إنشاء حساب</span>';
    } else {
        formTitle.textContent = "إنشاء حساب";
        nameInput.style.display = "block";
        submitBtn.textContent = "إنشاء حساب";
        switchForm.parentElement.innerHTML = 'لديك حساب؟ <span id="switchForm">تسجيل الدخول</span>';
    }
});

// إعادة تحديد الحدث بعد تغيير النص
document.body.addEventListener("click", e=>{
    if(e.target && e.target.id==="switchForm") switchForm.click();
});

submitBtn.addEventListener("click", async () => {
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    const name = nameInput.value.trim();
    if(!phone || !password || (!isLogin && !name)) return alert("املأ جميع الحقول");

    const userRef = ref(db, 'users/' + phone);
    const snapshot = await get(child(ref(db), 'users/' + phone));

    if(isLogin){
        if(snapshot.exists() && snapshot.val().password === password){
            localStorage.setItem("currentUser", JSON.stringify(snapshot.val()));
            window.location.href = "posts.html";
        } else alert("رقم الهاتف أو كلمة المرور خاطئة");
    } else {
        if(snapshot.exists()) return alert("رقم الهاتف مسجل مسبقًا");
        set(userRef, { name, phone, password }).then(()=>{
            localStorage.setItem("currentUser", JSON.stringify({name, phone}));
            window.location.href = "posts.html";
        });
    }
});
