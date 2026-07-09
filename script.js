// ============ STATE ============
let currentUser = null;
let users = JSON.parse(localStorage.getItem('x_users') || '[]');
let tweets = JSON.parse(localStorage.getItem('x_tweets') || '[]');
let messages = JSON.parse(localStorage.getItem('x_messages') || '{}');
let notifications = JSON.parse(localStorage.getItem('x_notifs') || '[]');
let following = JSON.parse(localStorage.getItem('x_following') || '{}');
let bookmarks = JSON.parse(localStorage.getItem('x_bookmarks') || '[]');
let composeMedia = [];
let modalMedia = [];
let currentDM = null;

// ===== SEED DATA =====
function seedData() {
  if (tweets.length === 0) {
    const seedTweets = [
      { id: uid(), userId: 'elon', text: 'The thing I love most about 𝕏 is the raw, unfiltered conversation. Free speech is the foundation of democracy. 🔥', time: Date.now() - 3600000, likes: 142300, retweets: 28400, replies: 9832, views: 2100000, media: [] },
      { id: uid(), userId: 'nasa', text: 'We just detected gravitational waves from the largest black hole merger ever observed. 🌌 The universe never stops surprising us. #Space #Science', time: Date.now() - 7200000, likes: 89200, retweets: 42100, replies: 5621, views: 1800000, media: [] },
      { id: uid(), userId: 'techcrunch', text: 'BREAKING: OpenAI announces GPT-5 with multimodal capabilities far beyond anything previously seen. Early testers describe it as "uncanny." Full story on our site. #AI #Tech', time: Date.now() - 10800000, likes: 34500, retweets: 18200, replies: 4200, views: 980000, media: [] },
      { id: uid(), userId: 'verge', text: 'Apple quietly updated its Mac lineup today with new M4 chips. Benchmark scores are absolutely wild. 🚀 #Apple #Mac', time: Date.now() - 14400000, likes: 22100, retweets: 8900, replies: 3100, views: 450000, media: [] },
      { id: uid(), userId: 'elon', text: 'Starship will be ready for its next orbital test in 3 weeks. This time we bring it home. 🚀', time: Date.now() - 86400000, likes: 198000, retweets: 54000, replies: 21000, views: 5000000, media: [] },
    ];
    tweets = seedTweets;
    saveTweets();
  }
  if (notifications.length === 0) {
    notifications = [
      { id: uid(), type: 'like', from: 'Elon Musk', fromHandle: '@elonmusk', fromEmoji: '🚀', text: 'liked your post', preview: 'What a beautiful day to be alive!', time: Date.now() - 1800000 },
      { id: uid(), type: 'follow', from: 'NASA', fromHandle: '@nasa', fromEmoji: '🌌', text: 'followed you', preview: '', time: Date.now() - 3600000 },
      { id: uid(), type: 'retweet', from: 'TechCrunch', fromHandle: '@techcrunch', fromEmoji: '💻', text: 'reposted your post', preview: 'Breaking news in the tech world today!', time: Date.now() - 7200000 },
      { id: uid(), type: 'mention', from: 'The Verge', fromHandle: '@verge', fromEmoji: '📱', text: 'mentioned you', preview: 'Have you seen what @user said about this?', time: Date.now() - 86400000 },
    ];
    saveNotifs();
  }
  if (!messages['elon']) {
    messages['elon'] = [
      { from: 'elon', text: 'Hey, great tweet earlier!', time: Date.now() - 3600000 },
      { from: 'me', text: 'Thanks Elon! Appreciate it.', time: Date.now() - 3500000 },
    ];
    messages['nasa'] = [
      { from: 'nasa', text: 'Check out our latest launch! 🚀', time: Date.now() - 86400000 },
    ];
    saveMessages();
  }
}

const seedUsers = {
  elon: { id: 'elon', name: 'Elon Musk', handle: '@elonmusk', bio: 'CEO of X, Tesla & SpaceX. Technoking.', emoji: '🚀', verified: true, followers: 180000000, following_count: 600 },
  nasa: { id: 'nasa', name: 'NASA', handle: '@nasa', bio: 'Exploring the universe and our home planet.', emoji: '🌌', verified: true, followers: 75000000, following_count: 78 },
  techcrunch: { id: 'techcrunch', name: 'TechCrunch', handle: '@techcrunch', bio: 'Startup and technology news.', emoji: '💻', verified: true, followers: 12000000, following_count: 2100 },
  verge: { id: 'verge', name: 'The Verge', handle: '@verge', bio: 'Exploring how tech is changing life.', emoji: '📱', verified: true, followers: 3200000, following_count: 1200 },
};

function getUserById(id) {
  if (seedUsers[id]) return seedUsers[id];
  return users.find(u => u.id === id) || { name: id, handle: '@'+id, emoji: '👤' };
}

// ===== UTILS =====
function uid() { return Math.random().toString(36).slice(2,10) + Date.now().toString(36); }
function saveTweets() { localStorage.setItem('x_tweets', JSON.stringify(tweets)); }
function saveUsers() { localStorage.setItem('x_users', JSON.stringify(users)); }
function saveMessages() { localStorage.setItem('x_messages', JSON.stringify(messages)); }
function saveNotifs() { localStorage.setItem('x_notifs', JSON.stringify(notifications)); }
function saveFollowing() { localStorage.setItem('x_following', JSON.stringify(following)); }
function saveBookmarks() { localStorage.setItem('x_bookmarks', JSON.stringify(bookmarks)); }

function formatNum(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1).replace('.0','')+'M';
  if (n >= 1000) return (n/1000).toFixed(1).replace('.0','')+'K';
  return n;
}
function timeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 60000) return Math.floor(d/1000)+'s';
  if (d < 3600000) return Math.floor(d/60000)+'m';
  if (d < 86400000) return Math.floor(d/3600000)+'h';
  return Math.floor(d/86400000)+'d';
}
function linkify(text) {
  return text
    .replace(/#(\w+)/g, '<span class="hashtag">#$1</span>')
    .replace(/@(\w+)/g, '<span class="mention">@$1</span>');
}
function toast(msg, color) {
  const t = document.createElement('div');
  t.className = 'toast';
  if (color) t.style.background = color;
  t.textContent = msg;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
function avatarEl(user, size=48) {
  if (user.avatar) return `<img src="${user.avatar}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`;
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:${size*0.45}px;flex-shrink:0;">${user.emoji||'👤'}</div>`;
}

// ===== AUTH =====
function switchTab(tab) {
  document.getElementById('login-form').style.display = tab==='login' ? '' : 'none';
  document.getElementById('signup-form').style.display = tab==='signup' ? '' : 'none';
  document.getElementById('tab-login').className = 'auth-tab' + (tab==='login' ? ' active' : '');
  document.getElementById('tab-signup').className = 'auth-tab' + (tab==='signup' ? ' active' : '');
  document.getElementById('auth-title').textContent = tab==='login' ? 'Sign in to 𝕏' : 'Create your account';
}
function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  if (!u || !p) { toast('Please fill all fields', '#f4212e'); return; }
  const found = users.find(x => (x.email===u || x.handle==='@'+u || x.handle===u) && x.password===p);
  if (!found) { toast('Invalid credentials', '#f4212e'); return; }
  loginUser(found);
}
function doGuest() {
  const guest = { id: 'guest_'+Date.now(), name: 'Guest User', handle: '@guest', bio: 'Just browsing 𝕏', emoji: '👻', followers: 0, following_count: 0 };
  loginUser(guest);
}
function doSignup() {
  const name = document.getElementById('reg-name').value.trim();
  const handle = document.getElementById('reg-handle').value.trim().replace('@','');
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const bio = document.getElementById('reg-bio').value.trim();
  if (!name||!handle||!email||!pass) { toast('Please fill required fields','#f4212e'); return; }
  if (users.find(u=>u.email===email)) { toast('Email already registered','#f4212e'); return; }
  if (users.find(u=>u.handle==='@'+handle)) { toast('Handle taken','#f4212e'); return; }
  const preview = document.getElementById('reg-avatar-preview');
  const avatar = preview.querySelector('img') ? preview.querySelector('img').src : null;
  const newUser = { id: uid(), name, handle:'@'+handle, email, password:pass, bio, avatar, emoji:'👤', followers:0, following_count:0, created: Date.now() };
  users.push(newUser);
  saveUsers();
  loginUser(newUser);
}
function previewRegAvatar(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('reg-avatar-preview');
    preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  };
  reader.readAsDataURL(file);
}
function loginUser(user) {
  currentUser = user;
  sessionStorage.setItem('x_current', JSON.stringify(user));
  document.getElementById('auth-overlay').style.display = 'none';
  document.getElementById('app').classList.add('visible');
  initApp();
}

// ===== INIT =====
function initApp() {
  seedData();
  updateSidebarProfile();
  renderTweets();
  renderTrends();
  renderFollowSuggestions();
  renderNotifications();
  renderDMList();
  renderBookmarks();
  renderProfile();
  updateComposeAvatar();
}
function updateSidebarProfile() {
  const u = currentUser;
  document.getElementById('sidebar-name').textContent = u.name;
  document.getElementById('sidebar-handle').textContent = u.handle;
  const av = document.getElementById('sidebar-avatar');
  if (u.avatar) { av.src = u.avatar; av.style.display=''; }
  else { av.style.display='none'; }
}
function updateComposeAvatar() {
  const els = ['compose-avatar','modal-compose-avatar'];
  els.forEach(id => {
    const el = document.getElementById(id);
    if (currentUser.avatar) { el.src=currentUser.avatar; el.style.display=''; }
    else { el.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'; el.style.background='var(--bg3)'; el.style.display='flex'; }
  });
}

// ===== NAVIGATION =====
let currentPage = 'home';
function showPage(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const navEl = document.getElementById('nav-'+page);
  if (navEl) navEl.classList.add('active');
  currentPage = page;
  if (page === 'profile') renderProfile();
  if (page === 'notifications') { document.getElementById('notif-badge').style.display='none'; }
  if (page === 'messages') { document.getElementById('msg-badge').style.display='none'; }
  if (page === 'bookmarks') renderBookmarks();
  if (page === 'explore') renderExplore('trending');
}

// ===== FEED =====
function switchFeed(type, el) {
  document.querySelectorAll('#page-home .feed-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  renderTweets(type);
}
function renderTweets(feed='for-you') {
  const container = document.getElementById('tweets-container');
  let toRender = [...tweets];
  if (feed === 'following') {
    const myFollowing = following[currentUser?.id] || [];
    toRender = tweets.filter(t => myFollowing.includes(t.userId) || t.userId===currentUser?.id);
    if (toRender.length === 0) {
      container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text2)"><div style="font-size:30px">🐦</div><div style="font-size:17px;font-weight:700;margin:8px 0">Follow some people</div><div>Their posts will show up here</div></div>`;
      return;
    }
  }
  toRender.sort((a,b) => b.time - a.time);
  container.innerHTML = toRender.map(t => renderTweetHTML(t)).join('');
}
function renderTweetHTML(tweet) {
  const user = getUserById(tweet.userId);
  const liked = (tweet.likedBy||[]).includes(currentUser?.id);
  const retweeted = (tweet.retweetedBy||[]).includes(currentUser?.id);
  const bookmarked = bookmarks.includes(tweet.id);
  let mediaHTML = '';
  if (tweet.media && tweet.media.length > 0) {
    if (tweet.media.length === 1) {
      const m = tweet.media[0];
      mediaHTML = `<div class="tweet-media">${m.type==='video' ? `<video src="${m.url}" controls style="width:100%;border-radius:14px;border:1px solid var(--border);max-height:400px"></video>` : `<img src="${m.url}" onclick="openImgModal('${m.url}')" style="cursor:zoom-in">`}</div>`;
    } else {
      const gridClass = tweet.media.length===2?'g2':tweet.media.length===3?'g3':'g4';
      mediaHTML = `<div class="tweet-media"><div class="tweet-media-grid ${gridClass}">${tweet.media.map((m,i)=>`<img src="${m.url}" onclick="openImgModal('${m.url}')" style="cursor:zoom-in" class="${gridClass==='g3'&&i===0?'g3-first':''}">`).join('')}</div></div>`;
    }
  }
  const verifiedBadge = user.verified ? '<span class="tweet-badge">✓</span>' : '';
  return `
  <div class="tweet" id="tweet-${tweet.id}">
    <div class="tweet-left">
      <div class="tweet-avatar" onclick="event.stopPropagation();showUserProfile('${tweet.userId}')">${user.avatar?`<img src="${user.avatar}" style="width:48px;height:48px;border-radius:50%;object-fit:cover">`:avatarEl(user,48)}</div>
    </div>
    <div class="tweet-body">
      <div class="tweet-header">
        <span class="tweet-name" onclick="event.stopPropagation();showUserProfile('${tweet.userId}')">${user.name}</span>
        ${verifiedBadge}
        <span class="tweet-handle">${user.handle}</span>
        <span class="tweet-dot">·</span>
        <span class="tweet-time">${timeAgo(tweet.time)}</span>
        <span class="tweet-more" onclick="event.stopPropagation();showTweetMenu('${tweet.id}')">···</span>
      </div>
      <div class="tweet-text">${linkify(tweet.text)}</div>
      ${mediaHTML}
      <div class="tweet-actions">
        <div class="tweet-action reply" onclick="event.stopPropagation();replyTweet('${tweet.id}')">
          <span class="tweet-action-icon">💬</span><span>${formatNum(tweet.replies||0)}</span>
        </div>
        <div class="tweet-action retweet ${retweeted?'retweeted':''}" onclick="event.stopPropagation();retweetTweet('${tweet.id}')">
          <span class="tweet-action-icon">🔁</span><span>${formatNum(tweet.retweets||0)}</span>
        </div>
        <div class="tweet-action like ${liked?'liked':''}" onclick="event.stopPropagation();likeTweet('${tweet.id}')">
          <span class="tweet-action-icon">${liked?'❤️':'🤍'}</span><span>${formatNum(tweet.likes||0)}</span>
        </div>
        <div class="tweet-action views" onclick="event.stopPropagation()">
          <span class="tweet-action-icon">📊</span><span>${formatNum(tweet.views||0)}</span>
        </div>
        <div class="tweet-action share" onclick="event.stopPropagation();bookmarkTweet('${tweet.id}')">
          <span class="tweet-action-icon">${bookmarked?'🔖':'🔗'}</span>
        </div>
      </div>
    </div>
  </div>`;
}

// ===== TWEET ACTIONS =====
function likeTweet(id) {
  const t = tweets.find(x=>x.id===id);
  if (!t) return;
  t.likedBy = t.likedBy || [];
  if (t.likedBy.includes(currentUser.id)) {
    t.likedBy = t.likedBy.filter(x=>x!==currentUser.id);
    t.likes = Math.max(0, (t.likes||0)-1);
  } else {
    t.likedBy.push(currentUser.id);
    t.likes = (t.likes||0)+1;
  }
  saveTweets();
  renderCurrentFeed();
}
function retweetTweet(id) {
  const t = tweets.find(x=>x.id===id);
  if (!t) return;
  t.retweetedBy = t.retweetedBy || [];
  if (t.retweetedBy.includes(currentUser.id)) {
    t.retweetedBy = t.retweetedBy.filter(x=>x!==currentUser.id);
    t.retweets = Math.max(0, (t.retweets||0)-1);
    toast('Repost removed');
  } else {
    t.retweetedBy.push(currentUser.id);
    t.retweets = (t.retweets||0)+1;
    toast('Reposted!', 'var(--green)');
  }
  saveTweets();
  renderCurrentFeed();
}
function bookmarkTweet(id) {
  if (bookmarks.includes(id)) {
    bookmarks = bookmarks.filter(x=>x!==id);
    toast('Removed from Bookmarks');
  } else {
    bookmarks.push(id);
    toast('Added to Bookmarks ✓', 'var(--accent)');
  }
  saveBookmarks();
  renderCurrentFeed();
}
function replyTweet(id) {
  openComposeModal();
  const t = tweets.find(x=>x.id===id);
  if (t) {
    const user = getUserById(t.userId);
    document.getElementById('modal-compose-text').value = user.handle + ' ';
    updateModalCharCount();
  }
}
function showTweetMenu(id) {
  const t = tweets.find(x=>x.id===id);
  if (!t) return;
  const isOwn = t.userId === currentUser.id;
  const actions = isOwn ? ['Delete post','Pin to profile'] : ['Follow '+getUserById(t.userId).name,'Mute','Block','Report'];
  const menu = document.createElement('div');
  menu.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--bg2);border:1px solid var(--border);border-radius:16px;z-index:999;min-width:280px;overflow:hidden';
  menu.innerHTML = actions.map(a=>`<div style="padding:16px;font-size:16px;cursor:pointer;border-bottom:1px solid var(--border);font-weight:${a.startsWith('Delete')?'700':'400'};color:${a.startsWith('Delete')?'var(--danger)':'var(--text)'}" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''" onclick="handleMenuAction('${id}','${a}',this.closest('[data-overlay]'))">${a}</div>`).join('') + `<div style="padding:16px;font-size:16px;cursor:pointer;color:var(--text2)" onclick="this.parentElement.previousElementSibling.remove();this.parentElement.remove()">Cancel</div>`;
  const overlay = document.createElement('div');
  overlay.dataset.overlay = true;
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:998';
  overlay.onclick = () => { overlay.remove(); };
  menu.querySelectorAll('div').forEach(d => {
    const origClick = d.onclick;
    d.onclick = function(e) {
      const action = d.textContent;
      if (action === 'Delete post') { deleteTweet(id); }
      else if (action.startsWith('Follow')) { followUser(t.userId); }
      overlay.remove();
      menu.remove();
    };
  });
  document.body.appendChild(overlay);
  document.body.appendChild(menu);
}
function deleteTweet(id) {
  tweets = tweets.filter(t=>t.id!==id);
  saveTweets();
  renderCurrentFeed();
  toast('Post deleted');
}
function followUser(userId) {
  const myId = currentUser.id;
  following[myId] = following[myId] || [];
  if (following[myId].includes(userId)) {
    following[myId] = following[myId].filter(x=>x!==userId);
    toast('Unfollowed');
  } else {
    following[myId].push(userId);
    toast('Following! ✓', 'var(--green)');
  }
  saveFollowing();
  renderFollowSuggestions();
}
function renderCurrentFeed() {
  const activeFeedTab = document.querySelector('#page-home .feed-tab.active');
  const feed = activeFeedTab && activeFeedTab.textContent.toLowerCase().includes('following') ? 'following' : 'for-you';
  if (currentPage==='home') renderTweets(feed);
  if (currentPage==='profile') renderProfileTweets();
  if (currentPage==='bookmarks') renderBookmarks();
  if (currentPage==='explore') renderExplore();
}

// ===== COMPOSE =====
function updateCharCount() {
  const text = document.getElementById('compose-text').value;
  const left = 280 - text.length;
  const el = document.getElementById('char-count');
  el.textContent = left;
  el.className = 'char-count' + (left<20?' warn':'') + (left<0?' danger':'');
  document.getElementById('tweet-btn').disabled = text.trim().length === 0 && composeMedia.length === 0;
}
function updateModalCharCount() {
  const text = document.getElementById('modal-compose-text').value;
  const left = 280 - text.length;
  const el = document.getElementById('modal-char-count');
  el.textContent = left;
  el.className = 'char-count' + (left<20?' warn':'') + (left<0?' danger':'');
  document.getElementById('modal-tweet-btn').disabled = text.trim().length === 0 && modalMedia.length === 0;
}
function toggleAudience() { toast('Audience selection — everyone can reply'); }
function insertEmoji() {
  const emojis = ['😊','🔥','💯','🚀','❤️','😂','🙌','✨','💪','🎉','👀','🤔','😍','🥳','💡'];
  const e = emojis[Math.floor(Math.random()*emojis.length)];
  const ta = document.getElementById('compose-text');
  ta.value += e; updateCharCount();
}
function handleMediaUpload(input) {
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      composeMedia.push({ url: e.target.result, type: file.type.startsWith('video') ? 'video' : 'image' });
      renderComposePreviews();
      document.getElementById('tweet-btn').disabled = false;
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}
function handleModalMediaUpload(input) {
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      modalMedia.push({ url: e.target.result, type: file.type.startsWith('video') ? 'video' : 'image' });
      renderModalPreviews();
      document.getElementById('modal-tweet-btn').disabled = false;
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}
function renderComposePreviews() {
  const c = document.getElementById('compose-media-preview');
  c.innerHTML = composeMedia.map((m,i) => `<div style="position:relative;display:inline-block">${m.type==='video'?`<video src="${m.url}" style="height:120px;border-radius:10px;border:1px solid var(--border)"></video>`:`<img src="${m.url}" style="height:120px;border-radius:10px;border:1px solid var(--border);object-fit:cover">`}<span onclick="composeMedia.splice(${i},1);renderComposePreviews()" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.7);color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer">✕</span></div>`).join('');
}
function renderModalPreviews() {
  const c = document.getElementById('modal-media-preview');
  c.innerHTML = modalMedia.map((m,i) => `<div style="position:relative;display:inline-block">${m.type==='video'?`<video src="${m.url}" style="height:120px;border-radius:10px;border:1px solid var(--border)"></video>`:`<img src="${m.url}" style="height:120px;border-radius:10px;border:1px solid var(--border);object-fit:cover">`}<span onclick="modalMedia.splice(${i},1);renderModalPreviews()" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.7);color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer">✕</span></div>`).join('');
}
function postTweet() {
  const text = document.getElementById('compose-text').value.trim();
  if (!text && composeMedia.length===0) return;
  const newTweet = { id: uid(), userId: currentUser.id, text, time: Date.now(), likes: 0, retweets: 0, replies: 0, views: Math.floor(Math.random()*500)+1, media: [...composeMedia] };
  tweets.unshift(newTweet);
  saveTweets();
  document.getElementById('compose-text').value = '';
  composeMedia = [];
  renderComposePreviews();
  updateCharCount();
  renderTweets();
  toast('Your post was sent! ✓', 'var(--accent)');
}
function postFromModal() {
  const text = document.getElementById('modal-compose-text').value.trim();
  if (!text && modalMedia.length===0) return;
  const newTweet = { id: uid(), userId: currentUser.id, text, time: Date.now(), likes: 0, retweets: 0, replies: 0, views: Math.floor(Math.random()*500)+1, media: [...modalMedia] };
  tweets.unshift(newTweet);
  saveTweets();
  document.getElementById('modal-compose-text').value = '';
  modalMedia = [];
  renderModalPreviews();
  updateModalCharCount();
  closeComposeModal();
  if (currentPage==='home') renderTweets();
  if (currentPage==='profile') renderProfileTweets();
  toast('Your post was sent! ✓', 'var(--accent)');
}
function openComposeModal() {
  document.getElementById('compose-modal').style.display='flex';
  document.getElementById('modal-compose-text').focus();
}
function closeComposeModal() { document.getElementById('compose-modal').style.display='none'; }

// ===== EXPLORE =====
let exploreTab = 'trending';
function switchExploreFeed(tab, el) {
  document.querySelectorAll('#page-explore .feed-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  exploreTab = tab;
  renderExplore(tab);
}
function renderExplore(tab) {
  if (!tab) tab = exploreTab;
  const container = document.getElementById('explore-content');
  const byTab = tweets.filter(t => {
    if (tab==='news') return t.text.toLowerCase().includes('breaking') || t.text.toLowerCase().includes('news');
    if (tab==='sports') return t.text.toLowerCase().includes('sport') || t.text.toLowerCase().includes('game') || t.text.toLowerCase().includes('match');
    if (tab==='entertainment') return t.text.toLowerCase().includes('music') || t.text.toLowerCase().includes('film') || t.text.toLowerCase().includes('movie');
    return true;
  }).sort((a,b)=>(b.likes||0)-(a.likes||0));
  container.innerHTML = byTab.length > 0 ? byTab.map(t=>renderTweetHTML(t)).join('') : `<div style="padding:40px;text-align:center;color:var(--text2)"><div style="font-size:30px">🔍</div><div style="font-size:17px;font-weight:700;margin:8px 0">Nothing here yet</div></div>`;
}
function searchTweets(query) {
  if (!query) { renderTweets(); return; }
  const q = query.toLowerCase();
  const results = tweets.filter(t => t.text.toLowerCase().includes(q) || getUserById(t.userId).name.toLowerCase().includes(q));
  const container = currentPage==='explore' ? document.getElementById('explore-content') : document.getElementById('tweets-container');
  container.innerHTML = results.length > 0 ? results.map(t=>renderTweetHTML(t)).join('') : `<div style="padding:40px;text-align:center;color:var(--text2)">No results for "${query}"</div>`;
}

// ===== NOTIFICATIONS =====
function renderNotifications() {
  const container = document.getElementById('notifs-container');
  const icons = { like:'❤️', follow:'👤', retweet:'🔁', mention:'💬' };
  container.innerHTML = notifications.map(n => `
    <div class="notif-item">
      <div class="notif-icon">${icons[n.type]||'🔔'}</div>
      <div>
        <div style="font-size:20px;margin-bottom:4px">${n.fromEmoji||'👤'}</div>
        <div class="notif-text"><strong>${n.from}</strong> ${n.text}</div>
        ${n.preview ? `<div class="notif-tweet-preview">${n.preview}</div>` : ''}
        <div style="font-size:13px;color:var(--text2);margin-top:4px">${timeAgo(n.time)}</div>
      </div>
    </div>`).join('');
}
function switchNotifFeed(tab, el) {
  document.querySelectorAll('#page-notifications .feed-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const container = document.getElementById('notifs-container');
  const filtered = tab==='mentions' ? notifications.filter(n=>n.type==='mention') : notifications;
  const icons = { like:'❤️', follow:'👤', retweet:'🔁', mention:'💬' };
  container.innerHTML = filtered.map(n => `
    <div class="notif-item">
      <div class="notif-icon">${icons[n.type]||'🔔'}</div>
      <div>
        <div style="font-size:20px;margin-bottom:4px">${n.fromEmoji||'👤'}</div>
        <div class="notif-text"><strong>${n.from}</strong> ${n.text}</div>
        ${n.preview ? `<div class="notif-tweet-preview">${n.preview}</div>` : ''}
        <div style="font-size:13px;color:var(--text2);margin-top:4px">${timeAgo(n.time)}</div>
      </div>
    </div>`).join('');
}

// ===== MESSAGES =====
function renderDMList() {
  const container = document.getElementById('dm-list');
  const dmUsers = Object.keys(messages).map(id => ({
    id, user: getUserById(id), msgs: messages[id]
  }));
  container.innerHTML = dmUsers.map(d => {
    const last = d.msgs[d.msgs.length-1];
    const hasUnread = last && last.from !== 'me';
    return `<div class="dm-item" onclick="openChat('${d.id}')">
      <div class="dm-avatar">${d.user.avatar?`<img src="${d.user.avatar}" style="width:100%;height:100%;object-fit:cover;">`:(d.user.emoji||'👤')}</div>
      <div class="dm-info">
        <div class="dm-name">${d.user.name}<span class="dm-time">${last?timeAgo(last.time):''}</span></div>
        <div class="dm-preview">${last?last.text:''}</div>
      </div>
      ${hasUnread?'<div class="dm-unread"></div>':''}
    </div>`;
  }).join('') || `<div style="padding:40px;text-align:center;color:var(--text2)"><div style="font-size:30px">✉️</div><div style="font-size:17px;font-weight:700;margin:8px 0">No messages yet</div></div>`;
}
function openChat(userId) {
  currentDM = userId;
  const user = getUserById(userId);
  const msgList = messages[userId] || [];
  const messagesPage = document.getElementById('page-messages');
  messagesPage.querySelector('.messages-layout').innerHTML = `
    <div style="width:320px;border-right:1px solid var(--border);display:flex;flex-direction:column;">
      <div class="messages-header">Messages <button style="font-size:22px;color:var(--accent)" onclick="openNewDM()">✏️</button></div>
      <div style="padding:8px 16px;border-bottom:1px solid var(--border);"><div class="search-input-wrap"><span>🔍</span><input placeholder="Search" style="font-size:14px"></div></div>
      <div id="dm-list">${Object.keys(messages).map(id=>{const d=getUserById(id),last=messages[id][messages[id].length-1];return`<div class="dm-item${id===userId?' active':''}" onclick="openChat('${id}')"><div class="dm-avatar">${d.avatar?`<img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover;">`:(d.emoji||'👤')}</div><div class="dm-info"><div class="dm-name">${d.name}<span class="dm-time">${last?timeAgo(last.time):''}</span></div><div class="dm-preview">${last?last.text:''}</div></div></div>`;}).join('')}</div>
    </div>
    <div class="chat-view" style="flex:1">
      <div class="chat-header">
        <div style="font-size:32px">${user.avatar?`<img src="${user.avatar}" style="width:40px;height:40px;border-radius:50%;object-fit:cover">`:(user.emoji||'👤')}</div>
        <div>
          <div style="font-size:16px;font-weight:700">${user.name}</div>
          <div style="font-size:14px;color:var(--text2)">${user.handle}</div>
        </div>
        <div style="margin-left:auto;display:flex;gap:12px">
          <button style="font-size:20px;color:var(--accent)">📞</button>
          <button style="font-size:20px;color:var(--accent)">ℹ️</button>
        </div>
      </div>
      <div class="chat-messages" id="chat-messages">${msgList.map(m=>`
        <div class="chat-msg ${m.from==='me'?'mine':''}">
          ${m.from!=='me'?`<div style="width:32px;height:32px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${user.emoji||'👤'}</div>`:''}
          <div>
            <div class="chat-msg-bubble">${m.text}</div>
            <div class="chat-msg-time" style="text-align:${m.from==='me'?'right':'left'}">${timeAgo(m.time)}</div>
          </div>
        </div>`).join('')}
      </div>
      <div class="chat-input-area">
        <button style="font-size:20px;color:var(--accent)">🖼️</button>
        <input class="chat-input" id="chat-input" placeholder="Start a new message" onkeydown="if(event.key==='Enter')sendMsg()">
        <button class="chat-send" onclick="sendMsg()">➤</button>
      </div>
    </div>`;
  scrollChatToBottom();
}
function sendMsg() {
  const input = document.getElementById('chat-input');
  const text = input?.value.trim();
  if (!text || !currentDM) return;
  messages[currentDM] = messages[currentDM] || [];
  messages[currentDM].push({ from: 'me', text, time: Date.now() });
  saveMessages();
  input.value = '';
  openChat(currentDM);
  setTimeout(() => {
    const replies = ["That's interesting! 🤔", "Tell me more!", "Absolutely!", "I agree 100%!", "Thanks for reaching out! 🙏", "Let's connect soon!", "Great point! ✨"];
    const reply = replies[Math.floor(Math.random()*replies.length)];
    messages[currentDM].push({ from: currentDM, text: reply, time: Date.now() });
    saveMessages();
    openChat(currentDM);
  }, 1500);
}
function scrollChatToBottom() {
  setTimeout(() => {
    const el = document.getElementById('chat-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);
}
function openNewDM() {
  const ids = Object.keys(seedUsers);
  const randomUser = seedUsers[ids[Math.floor(Math.random()*ids.length)]];
  if (!messages[randomUser.id]) {
    messages[randomUser.id] = [];
    saveMessages();
    toast('Started conversation with '+randomUser.name, 'var(--accent)');
    openChat(randomUser.id);
  } else {
    openChat(randomUser.id);
  }
}

// ===== TRENDS =====
const trendsData = [
  { cat: 'Technology', name: '#AIRevolution', count: '2.4M posts' },
  { cat: 'Trending in India', name: '#MumbaiRains', count: '845K posts' },
  { cat: 'Sports', name: '#IPL2026', count: '3.1M posts' },
  { cat: 'Technology', name: '#iPhone18', count: '1.2M posts' },
  { cat: 'Politics', name: '#ElectionDay', count: '4.5M posts' },
];
function renderTrends() {
  document.getElementById('trends-list').innerHTML = trendsData.map(t=>`
    <div class="trend-item">
      <div class="trend-category">${t.cat}</div>
      <div class="trend-name">${t.name}</div>
      <div class="trend-count">${t.count}</div>
    </div>`).join('');
}

// ===== FOLLOW SUGGESTIONS =====
function renderFollowSuggestions() {
  const myFollowing = following[currentUser?.id] || [];
  const suggestions = Object.values(seedUsers).filter(u => !myFollowing.includes(u.id)).slice(0,3);
  document.getElementById('follow-suggestions').innerHTML = suggestions.map(u=>`
    <div class="follow-item">
      <div class="follow-avatar">${u.emoji}</div>
      <div class="follow-info">
        <div class="follow-name">${u.name}</div>
        <div class="follow-handle">${u.handle}</div>
      </div>
      <button class="btn-follow ${myFollowing.includes(u.id)?'following':''}" onclick="event.stopPropagation();followUser('${u.id}')">${myFollowing.includes(u.id)?'Following':'Follow'}</button>
    </div>`).join('');
}

// ===== BOOKMARKS =====
function renderBookmarks() {
  const container = document.getElementById('bookmarks-container');
  const bookmarked = tweets.filter(t => bookmarks.includes(t.id));
  container.innerHTML = bookmarked.length > 0 ? bookmarked.map(t=>renderTweetHTML(t)).join('') : `<div style="padding:40px;text-align:center;color:var(--text2)"><div style="font-size:30px">🔖</div><div style="font-size:17px;font-weight:700;margin:8px 0">Save posts for later</div><div>Bookmark posts to easily find them again</div></div>`;
}

// ===== PROFILE =====
function renderProfile() {
  const u = currentUser;
  document.getElementById('profile-header-name').textContent = u.name;
  const myTweets = tweets.filter(t=>t.userId===u.id);
  document.getElementById('profile-header-count').textContent = myTweets.length + ' posts';
  document.getElementById('profile-display-name').textContent = u.name;
  document.getElementById('profile-handle-el').textContent = u.handle;
  document.getElementById('profile-bio-el').textContent = u.bio || '';
  if (u.banner) { document.getElementById('profile-banner').style.backgroundImage = `url(${u.banner})`; document.getElementById('profile-banner').style.backgroundSize = 'cover'; }
  const av = document.getElementById('profile-avatar-el');
  av.innerHTML = u.avatar ? `<img src="${u.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : '👤';
  const meta = [
    u.location ? `<span>📍 ${u.location}</span>` : '',
    u.website ? `<span>🔗 <span style="color:var(--accent)">${u.website}</span></span>` : '',
    `<span>📅 Joined ${new Date(u.created||Date.now()).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span>`
  ].filter(Boolean).join('');
  document.getElementById('profile-meta').innerHTML = meta;
  const myFollowing = (following[u.id]||[]).length;
  document.getElementById('profile-stats').innerHTML = `
    <div class="profile-stat"><span>${myFollowing}</span> Following</div>
    <div class="profile-stat"><span>${formatNum(u.followers||0)}</span> Followers</div>`;
  renderProfileTweets();
}
function renderProfileTweets(tab='tweets') {
  const container = document.getElementById('profile-tweets');
  let toRender = [];
  if (tab==='tweets') toRender = tweets.filter(t=>t.userId===currentUser.id);
  else if (tab==='likes') toRender = tweets.filter(t=>(t.likedBy||[]).includes(currentUser.id));
  else if (tab==='media') toRender = tweets.filter(t=>t.userId===currentUser.id && t.media && t.media.length>0);
  else if (tab==='replies') toRender = tweets.filter(t=>t.userId===currentUser.id && t.text.includes('@'));
  toRender.sort((a,b)=>b.time-a.time);
  container.innerHTML = toRender.length > 0 ? toRender.map(t=>renderTweetHTML(t)).join('') : `<div style="padding:40px;text-align:center;color:var(--text2)"><div style="font-size:30px">📝</div><div style="font-size:17px;font-weight:700;margin:8px 0">No posts yet</div></div>`;
}
function switchProfileTab(tab, el) {
  document.querySelectorAll('.profile-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  renderProfileTweets(tab);
}
function changeAvatar(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentUser.avatar = e.target.result;
    updateUserInStorage();
    renderProfile();
    updateSidebarProfile();
    updateComposeAvatar();
    toast('Profile photo updated ✓', 'var(--green)');
  };
  reader.readAsDataURL(file);
}
function changeBanner(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentUser.banner = e.target.result;
    updateUserInStorage();
    renderProfile();
    toast('Banner updated ✓', 'var(--green)');
  };
  reader.readAsDataURL(file);
}
function updateUserInStorage() {
  sessionStorage.setItem('x_current', JSON.stringify(currentUser));
  const idx = users.findIndex(u=>u.id===currentUser.id);
  if (idx>=0) { users[idx] = currentUser; saveUsers(); }
}
function openEditProfile() {
  const u = currentUser;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</span>
        <span class="modal-title">Edit profile</span>
        <button class="btn-tweet" style="margin-left:auto" onclick="saveEditProfile(this)">Save</button>
      </div>
      <div class="edit-profile-form">
        <div class="edit-field"><label>Name</label><input id="ep-name" value="${u.name||''}"></div>
        <div class="edit-field"><label>Bio</label><textarea id="ep-bio" rows="3">${u.bio||''}</textarea></div>
        <div class="edit-field"><label>Location</label><input id="ep-location" value="${u.location||''}"></div>
        <div class="edit-field"><label>Website</label><input id="ep-website" value="${u.website||''}"></div>
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
}
function saveEditProfile(btn) {
  currentUser.name = document.getElementById('ep-name').value.trim() || currentUser.name;
  currentUser.bio = document.getElementById('ep-bio').value.trim();
  currentUser.location = document.getElementById('ep-location').value.trim();
  currentUser.website = document.getElementById('ep-website').value.trim();
  updateUserInStorage();
  btn.closest('.modal-overlay').remove();
  renderProfile();
  updateSidebarProfile();
  toast('Profile saved ✓', 'var(--green)');
}

// ===== IMAGE MODAL =====
function openImgModal(src) {
  document.getElementById('img-modal-src').src = src;
  document.getElementById('img-modal').style.display = 'flex';
}
function closeImgModal() { document.getElementById('img-modal').style.display = 'none'; }

// ===== USER PROFILE (others) =====
function showUserProfile(userId) {
  if (userId === currentUser.id) { showPage('profile'); return; }
  const user = getUserById(userId);
  const userTweets = tweets.filter(t=>t.userId===userId).sort((a,b)=>b.time-a.time);
  const myFollowing = following[currentUser.id]||[];
  const isFollowing = myFollowing.includes(userId);
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.alignItems = 'flex-start';
  modal.style.overflowY = 'auto';
  modal.innerHTML = `
    <div class="modal" style="margin-top:20px;margin-bottom:20px">
      <div class="modal-header">
        <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</span>
        <div><div style="font-size:18px;font-weight:800">${user.name}</div><div style="font-size:13px;color:var(--text2)">${userTweets.length} posts</div></div>
      </div>
      <div style="height:160px;background:linear-gradient(135deg,#1d9bf0,#7856ff)"></div>
      <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:flex-start">
        <div style="margin-top:-50px;width:80px;height:80px;border-radius:50%;background:var(--bg3);border:4px solid var(--bg2);display:flex;align-items:center;justify-content:center;font-size:36px;overflow:hidden">${user.avatar?`<img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover">`:user.emoji||'👤'}</div>
        <button class="btn-follow ${isFollowing?'following':''}" onclick="followUser('${userId}');this.textContent=following[currentUser.id]&&following[currentUser.id].includes('${userId}')?'Following':'Follow';this.className='btn-follow '+(following[currentUser.id]&&following[currentUser.id].includes('${userId}')?'following':'')">${isFollowing?'Following':'Follow'}</button>
      </div>
      <div style="padding:4px 16px 12px">
        <div style="font-size:18px;font-weight:800">${user.name}${user.verified?'<span style="font-size:13px;background:var(--accent);color:#fff;padding:2px 6px;border-radius:4px;margin-left:6px;font-weight:700">✓</span>':''}</div>
        <div style="font-size:15px;color:var(--text2)">${user.handle}</div>
        <div style="font-size:15px;margin:8px 0">${user.bio||''}</div>
        <div style="display:flex;gap:16px;font-size:15px">
          <div><strong>${formatNum(user.following_count||0)}</strong> <span style="color:var(--text2)">Following</span></div>
          <div><strong>${formatNum(user.followers||0)}</strong> <span style="color:var(--text2)">Followers</span></div>
        </div>
      </div>
      <div style="border-top:1px solid var(--border)">
        ${userTweets.map(t=>renderTweetHTML(t)).join('') || '<div style="padding:40px;text-align:center;color:var(--text2)">No posts yet</div>'}
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
}

// ===== STARTUP =====
(function init() {
  const saved = sessionStorage.getItem('x_current');
  if (saved) {
    currentUser = JSON.parse(saved);
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('app').classList.add('visible');
    initApp();
  }
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey||e.metaKey) && e.key==='Enter' && document.getElementById('compose-modal').style.display!=='none') postFromModal();
  });
})();
