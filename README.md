# 💬 Chatrix - Real-Time Chat App
![Chatrix Preview](https://sdmntpreastus.oaiusercontent.com/files/00000000-cf74-61f9-845c-46fb336bca8a/raw?se=2025-07-12T03%3A54%3A16Z&sp=r&sv=2024-08-04&sr=b&scid=576268d5-88e4-57c1-94e2-8fe839720b3f&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-12T00%3A50%3A37Z&ske=2025-07-13T00%3A50%3A37Z&sks=b&skv=2024-08-04&sig=mhwXH32gHjSmy06OWIvGCl9ti2fSH8OE0Q28IWYnyhk%3D)

**Chatrix** is a real-time, themed chat application built with ⚡Vite + React and powered by Zustand for dynamic theming. It supports real-time communication using **Socket.IO**, **JWT Authentication**, **PWA installation**, and image handling via **Cloudinary**. The backend is powered by **Node.js + Express** and connected to **MongoDB Atlas**.

> 🔗 **Live App**: [https://chatrix-gray.vercel.app/login](https://chatrix-gray.vercel.app/login)  
> 📦 **Codebase**: [GitHub Repository](https://github.com/Suriya2023/Chatrix)

---

## 🚀 Features

✅ Real-time messaging with **Socket.IO**  
✅ 40+ custom themes via **Zustand + Tailwind CSS**  
✅ User login, signup with **JWT auth + cookies**  
✅ **PWA support** – install on desktop/mobile  
✅ Cloudinary for **image upload, preview & sending**  
✅ Fully responsive UI (mobile + desktop)  
✅ Firebase-ready structure for scaling (optional)  
✅ Secure cookie-based sessions  
✅ Profile preview, live typing status (planned)

---

## 🌈 Theming System

Users can choose from 40+ vibrant and minimal themes with live preview capability.

```js
// src/utils/themeUtils.js
export const applyCustomTheme = (themeName) => {
  const themeVars = THEME_COLORS[themeName];
  if (!themeVars) return;
  Object.entries(themeVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};
