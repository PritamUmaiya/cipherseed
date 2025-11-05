# 🔐 CipherSeed

**CipherSeed** is a deterministic, privacy-focused password generator built with Next.js.  
It creates strong, consistent passwords locally — using secure cryptographic hashing — without ever storing or transmitting your data.

---

## 🌟 Features

- **Deterministic Generation** — Generate the same password every time using the same inputs.  
- **Privacy First** — Everything happens locally in your browser. No data is sent or stored anywhere.  
- **Customizable Rules** — Configure password length and character sets (uppercase, lowercase, numbers, symbols).  
- **PBKDF2-SHA256 Security** — Uses 100,000 iterations of PBKDF2 with SHA-256 for strong cryptographic strength.  
- **Persistent Settings** — Your preferences are saved locally using `localStorage`.  
- **Simple UI** — Clean, responsive interface built with Tailwind and TypeScript.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PriamUmaiya/cipherseed.git
cd cipherseed
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## 🧰 How It Works

CipherSeed takes four inputs:
- **App Name** — e.g. “Google” or “GitHub”  
- **Username** *(optional)*  
- **Master Password** — your main secret key  
- **Secret Phrase** *(optional)*  

It then uses these as a deterministic seed to derive a cryptographic key via **PBKDF2-SHA256**.  
The resulting bits are mapped to a customizable character set to produce a strong, unique password for each app — consistently.

---

## ⚙️ Tech Stack

- **Framework:** Next.js + TypeScript  
- **UI:** Tailwind  
- **Crypto:** Web Crypto API (PBKDF2-SHA256)  
- **Storage:** localStorage  

---

## 🧑‍💻 Developer

**Pritam Umaiya**  
[GitHub](https://github.com/PritamUmaiya)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

> _“Stop remembering hundreds of passwords. Let CipherSeed generate strong, unique passwords for you—instantly and securely.”_
