import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const db = getDatabase();
const postsContainer = document.getElementById('postsContainer');
const newPostBtn = document.getElementById('newPostBtn');
const writePostContainer = document.getElementById('writePostContainer');
const publishBtn = document.getElementById('publishBtn');
const postInput = document.getElementById('postInput');
const logoutBtn = document.getElementById('logoutBtn');

const commentModal = document.getElementById('commentModal');
const modalComments = document.getElementById('modal-comments');
const modalCommentInput = document.getElementById('modal-comment-input');
const modalCommentBtn = document.getElementById('modal-comment-btn');
const closeModal = document.getElementById('closeModal');

let currentCommentPost = null;
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser) window.location.href = "index.html";

// تسجيل الخروج
logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
});

// toggle حقل الكتابة
newPostBtn.addEventListener('click', () => {
    if(writePostContainer.style.display === 'flex') writePostContainer.style.display = 'none';
    else { writePostContainer.style.display = 'flex'; postInput.focus(); }
});

// نشر منشور
publishBtn.addEventListener('click', () => {
    const content = postInput.value.trim();
    if(!content) return alert("المنشور فارغ");

    const postRef = push(ref(db, 'posts'));
    const postData = { 
        id: postRef.key,
        user: currentUser.name,
        content, likes: 0, comments: {}, shares: 0, views: 0
    };
    set(postRef, postData);
    postInput.value = '';
    writePostContainer.style.display = 'none';
});

// متابعة جميع المنشورات
onValue(ref(db, 'posts'), snapshot => {
    postsContainer.innerHTML = '';
    snapshot.forEach(childSnap => {
        const post = childSnap.val();
        createPostElement(post);
    });
});

// نفس كود إنشاء المنشور كما كان، لكن مع ربط البيانات بالحقيقي
function createPostElement(post){
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.dataset.id = post.id;
    postDiv.innerHTML = `
        <div class="post-header">${post.user || 'مستخدم'}</div>
        <div class="post-content">${post.content}</div>
        <div class="post-footer">
            <button class="like-btn"><span class="like-count">${post.likes||0}</span></button>
            <button class="comment-btn"><span class="comment-count">${Object.keys(post.comments||{}).length}</span></button>
            <button class="view-btn" disabled><span class="view-count">${post.views||0}</span></button>
            <button class="share-btn"><span class="share-count">${post.shares||0}</span></button>
        </div>
    `;
    postsContainer.prepend(postDiv);

    const likeBtn = postDiv.querySelector('.like-btn');
    const likeCount = postDiv.querySelector('.like-count');
    const commentBtn = postDiv.querySelector('.comment-btn');
    const commentCountSpan = postDiv.querySelector('.comment-count');
    const shareBtn = postDiv.querySelector('.share-btn');
    const shareCount = postDiv.querySelector('.share-count');
    const viewCountSpan = postDiv.querySelector('.view-count');

    // الإعجاب
    likeBtn.addEventListener('click', () => {
        post.likes = post.likes + 1;
        likeCount.textContent = post.likes;
        set(ref(db,'posts/'+post.id+'/likes'), post.likes);
    });

    // التعليقات
    commentBtn.addEventListener('click', () => {
        currentCommentPost = post;
        updateModalComments(post);
        commentModal.style.display = 'flex';
    });
    modalCommentBtn.addEventListener('click', () => {
        const text = modalCommentInput.value.trim();
        if(!text || !currentCommentPost) return;
        const commentRef = push(ref(db, 'posts/' + currentCommentPost.id + '/comments'));
        set(commentRef, {user: currentUser.name, text});
        modalCommentInput.value = '';
    });

    // المشاركة
    shareBtn.addEventListener('click', () => {
        post.shares = (post.shares||0)+1;
        shareCount.textContent = post.shares;
        set(ref(db,'posts/'+post.id+'/shares'), post.shares);
        alert("تم نسخ رابط المشاركة! (محاكاة)");
    });

    // المشاهدات
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                post.views = (post.views||0)+1;
                viewCountSpan.textContent = post.views;
                set(ref(db,'posts/'+post.id+'/views'), post.views);
                obs.unobserve(postDiv);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(postDiv);
}

function updateModalComments(post){
    modalComments.innerHTML = '';
    const comments = post.comments || {};
    for(const key in comments){
        const c = comments[key];
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `<strong>${c.user}:</strong> ${c.text}`;
        modalComments.appendChild(div);
    }
}

closeModal.addEventListener('click', () => commentModal.style.display = 'none');
window.addEventListener('click', e => { if(e.target===commentModal) commentModal.style.display='none'; });
