// ─────────────────────────────────────────────────────────────────
// 1.  VOICE INTRO  (Web Speech API — built into every browser)
// ─────────────────────────────────────────────────────────────────
const INTRO_TEXT = "Hi! I am Asad Khan. A Full Stack Digital Marketer from Faisalabad, Pakistan. I help brands grow through Meta Ads, Google Ads, SEO, and Social Media. Let's work together!";

let introSpoken = false;

function speakIntro() {
  if (introSpoken) return;
  introSpoken = true;

  const words = INTRO_TEXT.split(' ');
  let idx = 0;
  const el = document.getElementById('speech-text');
  el.textContent = '';

  const wordTimer = setInterval(() => {
    if (idx < words.length) {
      el.textContent += (idx === 0 ? '' : ' ') + words[idx++];
    } else {
      clearInterval(wordTimer);
    }
  }, 220);

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(INTRO_TEXT);
    utt.rate = 0.95;
    utt.pitch = 1.05;
    utt.volume = 1;

    function pickVoice() {
      const voices = window.speechSynthesis.getVoices();
      const preferred = [
        'Google UK English Male', 'Microsoft David Desktop',
        'Microsoft Guy Online', 'en-GB', 'en-US'
      ];
      for (const p of preferred) {
        const v = voices.find(v => v.name.includes(p) || v.lang === p);
        if (v) return v;
      }
      return voices.find(v => v.lang.startsWith('en')) || voices[0];
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length) utt.voice = pickVoice();
    else window.speechSynthesis.onvoiceschanged = () => { utt.voice = pickVoice(); };

    utt.onend = () => {
      document.getElementById('speechWave').classList.add('stopped');
      setTimeout(closeIntro, 900);
    };
    utt.onerror = () => setTimeout(closeIntro, 800);
    window.speechSynthesis.speak(utt);
  } else {
    setTimeout(closeIntro, 5000);
  }
}

function closeIntro() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  const overlay = document.getElementById('speech-overlay');
  overlay.classList.add('hide');
  setTimeout(() => overlay.remove(), 700);
}

if (!sessionStorage.getItem('introShown')) {
  sessionStorage.setItem('introShown', '1');
  setTimeout(speakIntro, 800);
} else {
  document.getElementById('speech-overlay').remove();
}

// ─────────────────────────────────────────────────────────────────
// 2.  TYPED TEXT
// ─────────────────────────────────────────────────────────────────
const phrases = [
  "Full Stack Digital Marketer",
  "Meta & Google Ads Expert",
  "SEO & Content Strategist",
  "Brand Growth Specialist",
  "E-commerce Marketing Pro"
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById("typed-text");
function type() {
  const cur = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++charIdx);
    if (charIdx === cur.length) { deleting = true; return setTimeout(type, 1800); }
  } else {
    typedEl.textContent = cur.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 50 : 90);
}
type();

// ─────────────────────────────────────────────────────────────────
// 3.  SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add("visible"), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

// ─────────────────────────────────────────────────────────────────
// 4.  NAVBAR SCROLL
// ─────────────────────────────────────────────────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("navbar").style.background =
    window.scrollY > 50 ? "rgba(10,10,10,0.98)" : "rgba(10,10,10,0.85)";
});

// ─────────────────────────────────────────────────────────────────
// 5.  CONTACT FORM
//     Pure HTML/JS cannot save files to your PC by itself (browser
//     security restriction). This opens the visitor's email app with
//     the message pre-filled, addressed to your inbox, so you still
//     receive everything automatically.
// ─────────────────────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = document.getElementById('sendBtn');
  const first = document.getElementById('cf-first').value.trim();
  const last = document.getElementById('cf-last').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const msg = document.getElementById('cf-msg').value.trim();

  if (!first || !email || !msg) {
    alert('Please fill in your name, email, and message.');
    return;
  }

  const subject = encodeURIComponent(`Portfolio Contact from ${first} ${last}`);
  const body = encodeURIComponent(
    `Name: ${first} ${last}\nEmail: ${email}\n\nMessage:\n${msg}`
  );

  window.location.href = `mailto:asadkhandigital6@gmail.com?subject=${subject}&body=${body}`;

  document.getElementById('successMsg').style.display = 'block';
  btn.innerHTML = '✅ Opening Email App...';
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
  }, 3000);
});
