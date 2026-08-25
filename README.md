# WildSketch 動物速寫室 🐿️🐕🦌

一個為插畫師與繪畫學習者打造的動物藝用解剖網站。
依步態分類常見哺乳動物，提供骨架圖與多角度參考照片，
並支援骨架疊加顯示功能，讓速寫練習更直覺。

An artistic anatomy reference website for illustrators and drawing learners.
Browse common mammals by walking posture — plantigrade, digitigrade, and unguligrade —
with skeleton diagrams, multi-angle photos, and an interactive skeleton overlay tool.

> 🔗 [thewildsketch.com](https://thewildsketch.com)

---

## 收錄動物 Species

| 步態 Posture       | 動物 Animals                   |
| ------------------ | ------------------------------ |
| 蹠行類 Plantigrade | 棕熊 Brown Bear、松鼠 Squirrel |
| 趾行類 Digitigrade | 貓 Cat、狗 Dog                 |
| 蹄行類 Unguligrade | 馬 Horse、紅鹿 Red Deer        |

> 持續新增中，歡迎透過 [意見回饋](https://forms.gle/T8M8wAvCmDeG35j1A) 許願你想看到的動物 🐾

---

## 本機開發與建置 Getting Started

**前置需求 Prerequisites**： Node.js 18 or later

1. **安裝套件 / Install dependencies**
```bash
   npm install
```

2. **啟動開發伺服器 / Start dev server**（預設於 `http://localhost:5173` 開啟）
```bash
   npm run dev
```

3. **Production 建置 / Production build**
```bash
   npm run build
```

4. **預覽建置結果 / Preview production build**
```bash
   npm run preview
```

---

## 開發方式 Development Approach

本專案開發流程結合 AI 協作（Project-Manager / UX-Designer / Tech-Lead / Dataset-Manager / DevOps-Master 多角色分工），
規格與設計系統採單一事實來源管理，詳見 [`AGENTS.md`](./AGENTS.md)。

This project is developed with AI-assisted multi-role collaboration(Project-Manager / UX-Designer / Tech-Lead / Dataset-Manager / DevOps-Master workflow).
See [`AGENTS.md`](./AGENTS.md) for details.

Skill frameworks referenced:
- [superpowers](https://github.com/obra/superpowers)
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

Documentation structure inspired by
- [OpenSpec](https://github.com/Fission-AI/openspec)

---

## License

程式碼以 [MIT License](./LICENSE) 授權開放使用。

圖片素材以 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hant) 授權，個人學習與速寫參考用途歡迎使用，請註明來源
`WildSketch 動物速寫室（thewildsketch.com）`，禁止商業用途。

···

Code is released under the [MIT License](./LICENSE).

Image assets are licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
Free for personal learning and sketch reference use with attribution:
`WildSketch 動物速寫室（thewildsketch.com）`. Commercial use is not permitted.