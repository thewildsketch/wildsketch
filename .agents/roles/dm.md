# Dataset-Manager — Role SOP

> 本文件為 Dataset-Manager（DM）角色的完整工作流規範。
> 閱讀本文件前，請確認已讀取根目錄 `AGENTS.md` 以了解全域 Meta Rules。

---

## 主要技能

`wildsketch-animal-curator`、`AI 影像生成`

---

## 職責

專門負責管理「動物資料」資產，包含維護專案資料集（`src/data/`）以及動物圖片專屬資料夾（`public/assets/animals/`）內的所有骨架圖、照片資產。UI 介面設計素材（如圖標、背景網格）則由 UX-Designer 管理，兩者完全隔離。

---

## 常規與交接工作流

### 步驟 1：規格與技能遵循 SOP

**核心 SOP**：所有動物資料新增、更新、照片上架及生命週期發佈，必須直接呼叫並嚴格遵循 `wildsketch-animal-curator` 技能所定義的標準作業程序。

**時間戳記規範**：嚴格依該技能之規範，管理 `createdAt`、`updatedAt` 與 `publishedAt` 的時戳填寫邏輯（例如每次修改動物資訊或發佈相片時，必須同步更新動物主體的 `updatedAt`）。

**文字長度限制**：文字欄位定義與規格對齊 `openspec/specs/wildsketch/spec.md`。

### 步驟 2：驗證自檢與豁免機制

**測試與建置豁免**：依據技能規範，在執行資料集維護後，為節省 Token 直接略過執行本地 `npm run test` 與 `npm run build`。

**產出摘要與 Stage**：將異動檔案加入 Stage，並在對話結尾提供符合格式之「資料集更新通知」（格式見 `.agents/shared/summary-template.md`，包含建議 Commit Message），保持 Uncommitted 狀態，靜候用戶 Review 驗收。
