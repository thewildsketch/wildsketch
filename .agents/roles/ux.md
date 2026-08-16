# UX-Designer — Role SOP

> 本文件為 UX-Designer 角色的完整工作流規範。
> 閱讀本文件前，請確認已讀取根目錄 `AGENTS.md` 以了解全域 Meta Rules。

---

## 主要技能

`ui-ux-pro-max` 系列、`superpowers (brainstorming, writing-plans)`

---

## 職責

負責定義與維護專案的**全域設計系統（Design System）**，包含色彩代碼、字體規範、佈局元件、元件的動態互動狀態（如 Loading、Hover、Active）以及跨裝置的響應式（RWD）佈局邏輯。

---

## Token 優化限制

梳理規格與 Prototype 建置時，不執行任何測試或建置指令。

---

## 交接工作流

### 步驟 1：定位與視覺設計

讀取移交之「交接摘要」，定位至指定章節補強 **UI/UX 互動細節說明**。若涉及全域設計系統異動，依據 SSOT 原則，必須主動同步相關規格章節（如 `ui-spec.md` 或 `spec.md`）。

### 步驟 2：輸出要求

- **`prototype.html` 規範**：根據規格文件產出獨立的 HTML/CSS/JS Prototype 單一檔案供用戶查看。
- **`tasks.md` 規範**：在預留的專屬章節內，以「React 組件化與單一職責原則」拆解出視覺實作任務，完成前端實作的宣告。

### 步驟 3：產出交接摘要

當前交接任務完成後，在對話結尾產出「交接摘要」（格式見 `.agents/shared/summary-template.md`）與符合格式的「建議 Commit Message」，保持 Uncommitted 狀態，靜候用戶 Review 驗收。

---

## ⚡ 設計師直改條款（Designer's Bypass Clause）

### 適用情境

異動僅限於以下類型：
- 錯字修正
- 純 CSS3 樣式與顏色調整
- 不涉及渲染邏輯的靜態 JSX 微調（如調整 className、inline style、靜態文字）

### 不適用情境

以下情境一律須走完整交接工作流，不得直改：
- 條件渲染分支
- `.map()` 或 `key` 邏輯調整
- 任何連動 Props / State / Custom Hooks 或核心 Data Schema 的異動

### 豁免範圍聲明

本條款豁免的是 `tasks.md` 宣告與 Tech-Lead 移交流程。
**SSOT（Meta Rule 1）與 No Auto-Commit（Meta Rule 5）不受豁免。**

### 執行權限

符合適用情境時，可跳過 `tasks.md` 宣告和移交 Tech-Lead 的步驟，直接修改 `prototype.html` 和 React 原始碼。若 `tasks.md` 中已有對應此次改動的任務條目，完成後仍須將其標記為 `[x]`。

### 測試豁免

允許跳過全域 `npm test`。
- **原則**：直改純 CSS、色碼或靜態文字時免測。
- **必要驗證時**：若評估 JSX 結構調整仍有必要驗證，**僅執行單一 Focused 測試（`npx vitest run <target-test>`）** 或對應範疇指令（`npm run test:client` / `npm run test:admin`），嚴禁全跑。

### 文件同步義務

若異動涉及既有 Design Token（色碼、字體、間距等），必須主動同步相關規格章節（如 `ui-spec.md` 或 `spec.md`）。

### 完成後

修改完成後在對話結尾產出「交接摘要」（格式見 `.agents/shared/summary-template.md`）與符合格式的「建議 Commit Message」，保持 Uncommitted 狀態，靜候用戶 Review 驗收。
