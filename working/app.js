// ===== Language List =====
const LANGUAGES = {
  af: "Afrikaans", sq: "Albanian", am: "Amharic", ar: "Arabic", hy: "Armenian",
  az: "Azerbaijani", eu: "Basque", be: "Belarusian", bn: "Bengali", bs: "Bosnian",
  bg: "Bulgarian", ca: "Catalan", ceb: "Cebuano", zh: "Chinese", co: "Corsican",
  hr: "Croatian", cs: "Czech", da: "Danish", nl: "Dutch", en: "English",
  eo: "Esperanto", et: "Estonian", fi: "Finnish", fr: "French", fy: "Frisian",
  gl: "Galician", ka: "Georgian", de: "German", el: "Greek", gu: "Gujarati",
  ht: "Haitian Creole", ha: "Hausa", haw: "Hawaiian", he: "Hebrew", hi: "Hindi",
  hmn: "Hmong", hu: "Hungarian", is: "Icelandic", ig: "Igbo", id: "Indonesian",
  ga: "Irish", it: "Italian", ja: "Japanese", jv: "Javanese", kn: "Kannada",
  kk: "Kazakh", km: "Khmer", rw: "Kinyarwanda", ko: "Korean", ku: "Kurdish",
  ky: "Kyrgyz", lo: "Lao", la: "Latin", lv: "Latvian", lt: "Lithuanian",
  lb: "Luxembourgish", mk: "Macedonian", mg: "Malagasy", ms: "Malay", ml: "Malayalam",
  mt: "Maltese", mi: "Maori", mr: "Marathi", mn: "Mongolian", my: "Myanmar",
  ne: "Nepali", no: "Norwegian", ny: "Nyanja", or: "Odia", ps: "Pashto",
  fa: "Persian", pl: "Polish", pt: "Portuguese", pa: "Punjabi", ro: "Romanian",
  ru: "Russian", sm: "Samoan", gd: "Scots Gaelic", sr: "Serbian", st: "Sesotho",
  sn: "Shona", sd: "Sindhi", si: "Sinhala", sk: "Slovak", sl: "Slovenian",
  so: "Somali", es: "Spanish", su: "Sundanese", sw: "Swahili", sv: "Swedish",
  tl: "Tagalog", tg: "Tajik", ta: "Tamil", tt: "Tatar", te: "Telugu",
  th: "Thai", tr: "Turkish", tk: "Turkmen", uk: "Ukrainian", ur: "Urdu",
  ug: "Uyghur", uz: "Uzbek", vi: "Vietnamese", cy: "Welsh", xh: "Xhosa",
  yi: "Yiddish", yo: "Yoruba", zu: "Zulu"
};

// ===== DOM Elements =====
const sourceSelect  = document.getElementById("source-lang");
const targetSelect  = document.getElementById("target-lang");
const swapBtn       = document.getElementById("swap-btn");
const inputText     = document.getElementById("input-text");
const outputText    = document.getElementById("output-text");
const translateBtn  = document.getElementById("translate-btn");
const copyBtn       = document.getElementById("copy-btn");
const clearBtn      = document.getElementById("clear-btn");
const charCount     = document.getElementById("char-count");
const statusMsg     = document.getElementById("status-msg");

// ===== Populate Language Dropdowns =====
function populateSelects() {
  const sorted = Object.entries(LANGUAGES).sort((a, b) => a[1].localeCompare(b[1]));

  sorted.forEach(([code, name]) => {
    // Source (skip adding — already has "Detect Language")
    const srcOpt = document.createElement("option");
    srcOpt.value = code;
    srcOpt.textContent = name;
    sourceSelect.appendChild(srcOpt);

    // Target
    const tgtOpt = document.createElement("option");
    tgtOpt.value = code;
    tgtOpt.textContent = name;
    targetSelect.appendChild(tgtOpt);
  });

  // Default target to Hindi
  targetSelect.value = "hi";
}

populateSelects();

// ===== Character Count =====
inputText.addEventListener("input", () => {
  const len = inputText.value.length;
  charCount.textContent = `${len} character${len !== 1 ? "s" : ""}`;
});

// ===== Clear Button =====
clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  charCount.textContent = "0 characters";
  statusMsg.textContent = "";
  statusMsg.className = "status-msg";
});

// ===== Swap Languages =====
swapBtn.addEventListener("click", () => {
  const srcVal = sourceSelect.value;
  const tgtVal = targetSelect.value;

  if (srcVal === "auto") return; // can't swap if source is auto

  sourceSelect.value = tgtVal;
  targetSelect.value = srcVal;

  // Also swap text
  const tmp = inputText.value;
  inputText.value = outputText.value;
  outputText.value = tmp;

  // Update char count
  const len = inputText.value.length;
  charCount.textContent = `${len} character${len !== 1 ? "s" : ""}`;
});

// ===== Translate =====
async function translate() {
  const text = inputText.value.trim();
  if (!text) {
    statusMsg.textContent = "Please enter some text.";
    statusMsg.className = "status-msg error";
    return;
  }

  const sourceLang = sourceSelect.value;
  const targetLang = targetSelect.value;

  translateBtn.disabled = true;
  translateBtn.textContent = "Translating…";
  statusMsg.textContent = "";
  statusMsg.className = "status-msg";
  outputText.value = "";

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Extract translated sentences
    let translated = "";
    if (data[0]) {
      data[0].forEach((segment) => {
        if (segment[0]) translated += segment[0];
      });
    }

    outputText.value = translated;

    // Show detected language if auto
    if (sourceLang === "auto" && data[2]) {
      const detected = data[2];
      const detectedName = LANGUAGES[detected] || detected;
      statusMsg.textContent = `Detected: ${detectedName}`;
    } else {
      statusMsg.textContent = "Done ✓";
    }
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "Translation failed. Check your connection.";
    statusMsg.className = "status-msg error";
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = "Translate";
  }
}

translateBtn.addEventListener("click", translate);

// Ctrl/Cmd + Enter to translate
inputText.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    translate();
  }
});

// ===== Copy Button =====
copyBtn.addEventListener("click", async () => {
  const text = outputText.value;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.classList.add("copied");
    copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Copied!
    `;

    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy
      `;
    }, 2000);
  } catch {
    // Fallback
    outputText.select();
    document.execCommand("copy");
  }
});
