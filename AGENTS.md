# 專案代理人團隊架構與協作宣言 (AGENTS.md)

## 📌 全域核心元規則 (Meta Rules) —— 團隊最高鐵律

1. **單一事實來源（SSOT）**：任何功能範疇、介面設計、API 及資料結構異動，必須以 `openspec/` 資料夾內的文件為唯一事實來源。**任何管道對原始碼的異動，只要涉及既有規範值（如色碼、字體、元件互動定義），都必須同步回寫至對應的規格章節（如 `ui-spec.md` 或 `spec.md`），不得使規格書與實際程式碼產生落差。**

2. **文件連結完整性（Document Link Integrity）**：主規格書 `spec.md` 僅做高層級與全域性功能概述，詳細細節必須超連結至 `openspec/` 內的子文件（如視覺規範連結至 `ui-spec.md`）。

3. **專案識別名稱鎖定（Project Identity Lock）**：所有子系統之正式名稱，以下述「專案識別名稱規範」章節之對照表為準，任何文件、UI 文案、commit message 均須統一使用表列正式名稱，不得使用代稱、縮寫或直譯英文名。

4. **技術棧嚴格鎖定（Strict Tech Stack Lock）**：本專案技術棧鎖定為 `Vite + React (JavaScript)` 與 `Vanilla CSS3`。除非規格書核准，否則禁止私自引入任何第三方狀態管理庫、外部 UI 框架或預處理器。

5. **No Auto-Commit 與 Commit 規範**：
   * **核心原則**：所有異動完成後保持 Uncommitted 狀態，靜候用戶 Review；用戶明確下達「請代為 commit」時，Agent 才可執行 `git commit`。
   * **建議 Commit Message**：完成修改並移交 Review 時，必須在對話結尾主動提供建議 Commit Message（包裹在 Markdown 程式碼區塊內）。
   * **格式**：`<type>(<scope>): <subject>`（小寫，英文主旨，主動語態，不加句點）
   * **完整 Type 範例表** → `.agents/shared/commit-guide.md`

6. **預設技能行為覆寫（Superpowers Skill Overrides）**：使用 `superpowers` 相關技能時，必須覆寫其預設行為：
   * **設計文件輸出路徑**：計畫寫入 `openspec/specs/<module>/spec.md`（新模組）或 `openspec/changes/<name>/change.md`（變更單），不寫入 `docs/superpowers/` 目錄。
   * **實作計畫唯一來源**：`openspec/changes/<name>/change.md` 與 `tasks.md` 為唯一實作計畫與 TODO 來源，不另建 `implementation_plan.md` 或 `task.md`。
   * **tasks.md 步驟**：步驟中不包含任何自動執行 `git commit` 的命令行。
   * **審查標準**：以用戶 Review 為唯一審查標準，不需指派 Agent Reviewer 或產出審查報告。
   * **編譯自檢時機**：`npm run build` 與 `npm run lint` 僅在全部任務完成後一次性執行。
   * **任務報告精簡**：異動檔案少於 3 個且不涉及核心邏輯時，在當前對話視窗內直接實作，不派發子代理人或產出報告檔案。

---

## 🏷️ 專案識別名稱規範 (Project Identity)

本專案採多子系統架構，`Module 名稱` 對應 `openspec/specs/<module>/` 資料夾名稱，為該子系統所有規格文件查找的依據；`正式名稱` 則用於文件、UI 文案、commit message 中的對外顯示。

| 子系統           | Module 名稱        | 正式名稱                       |
| ---------------- | ------------------ | ------------------------------ |
| 前台（使用者端） | `wildsketch`       | WildSketch 動物速寫室          |
| 後台（管理端）   | `wildsketch-admin` | WildSketch 動物速寫室—管理後台 |

> ⚠️ 新增子系統時，應於此表同時補上 Module 名稱與正式名稱，並初始化 `openspec/specs/<module>/` 目錄與 `spec.md`。

---

## 🧪 測試架構與分流規範 (Test Partitioning)

測試套件依子系統物理隔離，禁止在局部任務中盲目全跑 `npm test`：

### 1. 範疇與指令對照表

| 異動範疇         | 測試目錄 (`tests/`) | 職責邊界                                                                     | 執行指令              |
| :--------------- | :------------------ | :--------------------------------------------------------------------------- | :-------------------- |
| **前台**         | `client/`           | 使用者端頁面（`views/`）、引擎（`hooks/`）與互動組件（`components/`）        | `npm run test:client` |
| **共享資料層**   | `shared/`           | 資料集 Schema 驗證與跨端發佈過濾防線                                         | `npm run test:shared` |
| **後台**         | `admin/`            | 管理端頁面、獨立路由（`routing/`）、狀態引擎（`hooks/`）與演算法（`utils/`） | `npm run test:admin`  |
| **後端管線服務** | `server/`           | 後端 API 服務與資料倉儲持久化                                                | `npm run test:server` |
| **全域整合驗收** | 全目錄              | 全專案所有測試套件（移交 Review / 發佈前）                                   | `npm run test`        |

### 2. 單一 Focused 測試語法 (Single File Focused Run)

```bash
npx vitest run <target-test>
```

---

## 📂 OpenSpec 目錄架構

```text
[專案根目錄]/
└── openspec/
    ├── specs/
    │   └── <module>/
    │       ├── spec.md
    │       ├── ui-spec.md
    │       ├── asset-spec.md
    │       ├── prototype.html
    │       └── ...
    └── changes/
        ├── <active-change-name>/
        │   ├── change.md
        │   └── tasks.md
        └── archive/
```

* **文件格式**：`openspec/` 目錄下所有 `.md` 文件，遵循「英文主標題，中文說明內文」的語系規範。
* **`<active-change-name>` 命名規則**：純 kebab-case，如 `lightbox-scroll-fix`。

---

## 🗂️ 文件指針（Context Pointers）

| 文件                | 路徑                                 | 載入時機               |
| ------------------- | ------------------------------------ | ---------------------- |
| Commit 完整範例表   | `.agents/shared/commit-guide.md`     | 撰寫 Commit Message 時 |
| 交接摘要模板        | `.agents/shared/summary-template.md` | 產出任何交接摘要時     |
| Project-Manager SOP | `.agents/roles/pm.md`                | 被指派為 PM 角色時     |
| UX-Designer SOP     | `.agents/roles/ux.md`                | 被指派為 UX 角色時     |
| Tech-Lead SOP       | `.agents/roles/tech.md`              | 被指派為 Tech 角色時   |
| Dataset-Manager SOP | `.agents/roles/dm.md`                | 被指派為 DM 角色時     |
| DevOps-Master SOP   | `.agents/roles/devops.md`            | 被指派為 DevOps 角色時 |

---

## 👥 角色快覽（Role Overview）

| 角色                    | 主責                          | `<ROLE>`   | `<role-file>` |
| ----------------------- | ----------------------------- | ---------- | ------------- |
| 🧭 Project-Manager      | 規格管理、變更單生命週期      | `PM`       | `pm`          |
| 🎨 UX-Designer          | 設計系統、Prototype、視覺實作 | `UX`       | `ux`          |
| 🛠️ Tech-Lead            | 核心邏輯實作、TDD             | `Tech`     | `tech`        |
| 🛢️ Dataset-Manager      | 動物資料集與圖片資產管理      | `DM`       | `dm`          |
| ♾️ DevOps-Master        | 部署、Vercel 配置、CI/CD      | `DevOps`   | `devops`      |

完整工作流見各角色 SOP（路徑如上方指針表）。

---

## 🏁 新視窗啟動交接協議（Handover Protocol）

當你（用戶）新開任何視窗，或想多派一員猛將時，只需在該視窗輸入以下啟動指令（將 `<ROLE>` 替換為實際角色名稱，`<role-file>` 替換為對應 SOP 檔案名稱）：

---

你現在被指派為 `<ROLE>` 角色，請依序讀取：
1. 根目錄 `AGENTS.md`（全域 Meta Rules 與指針）
2. `.agents/roles/<role-file>.md`（你的完整 SOP）

請接著靜態審查 `openspec/` 內最新規格書與進行中的變更單，並告訴我你準備從哪裡開始。（請勿執行任何測試或建置指令以節省 Token。若 `openspec/` 目錄不存在或為空，請視為新專案並優先與我確認業務範疇。）

---

> ⚠️ **舊視窗同步備忘**：若在開發過程中修改了 `AGENTS.md` 或任何角色 SOP 檔案，對於已在進行中的舊視窗，用戶需主動輸入：*我更新了 `AGENTS.md` / `.agents/roles/<role-file>.md`，請重新讀取以同步最新的協作規則。*
