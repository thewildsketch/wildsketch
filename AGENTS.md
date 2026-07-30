# 專案代理人團隊架構與協作宣言 (AGENTS.md)

## 📌 全域核心元規則 (Meta Rules) —— 團隊最高鐵律
1. **單一事實來源（SSOT）**：任何功能範疇、介面設計、API 及資料結構異動，必須以 `openspec/` 資料夾內的文件為唯一事實來源。**任何管道（含下述「設計師直改條款」）對原始碼的異動，只要涉及既有規範值（如色碼、字體、元件互動定義），都必須同步回寫至對應的規格章節（如 `ui-spec.md` 或 `spec.md`），不得使規格書與實際程式碼產生落差。**
2. **文件連結完整性（Document Link Integrity）**：主規格書 `spec.md` 僅做高層級與全域性功能概述，詳細細節必須超連結至 `openspec/` 內的子文件（如視覺規範連結至 `ui-spec.md`）。
3. **專案識別名稱鎖定（Project Identity Lock）**：所有子系統之正式名稱，以下述「專案識別名稱規範 (Project Identity)」章節之對照表為準，任何文件、UI 文案、commit message 均須統一使用表列正式名稱，不得使用代稱、縮寫或直譯英文名。
4. **技術棧嚴格鎖定（Strict Tech Stack Lock）**：本專案技術棧鎖定為 `Vite + React (JavaScript)` 與 `Vanilla CSS3`。除非規格書核准，否則禁止私自引入任何第三方狀態管理庫、外部 UI 框架或預處理器。
5. **禁止自動 Commit 與 Commit Message 規範（No Auto-Commit & Commit Message Standards）**：
   * **【核心鐵律】** 任何 Agent 在任何視窗進行任何修改後，**絕對禁止**自行執行 `git commit`，除非符合下述「授權代 Commit」情境。所有程式碼異動預設必須保持在 Stage 或 Working Directory 狀態，留給用戶（User）進行最終 Review。
   * **【建議 Commit Message】**：所有 Agent 在對話中完成修改並移交 Review 時，**必須**在對話結尾（或本次產出之摘要下方）主動提供一至多段「建議 Commit Message」（包裹在 Markdown 程式碼區塊內，即 ``` 符號，並嚴格符合下述 **Conventional Commits** 格式），方便用戶在 Review 通過後一鍵複製使用。
   * **【授權代 Commit】**：當用戶 Review 完畢並**明確下達「請代為 commit」的指令時**，Agent 才可執行實際的 `git commit`，且必須嚴格採用上述提供之「建議 Commit Message」內容（或用戶當下指定之修改版本），不得自行更動格式。此為唯一允許 Agent 親自執行 commit 的情境。
   * **Conventional Commits 格式規範**：
      * **格式**：`<type>(<scope>): <subject>` （一律使用小寫，主旨採**英文**、主動語態，不加句點）
      * **Type 限定與範例參考**：
         * `docs`：`openspec/` 的文件更新。(如 *docs(spec): document JavaScript data schema for animal dataset*)
         * `feat`：新功能或新 React 組件實作。(如 *feat(ui): add AnimalCard grid component for responsive desktop layout*)
         * `fix`：修正 bug。(如 *fix(lightbox): fix body scroll lock issue when gallery modal opens*)
         * `style`：不影響邏輯的視覺調整、CSS3 樣式更動（如邊框、色碼調整）。(如 *style(ui): update primary brand color to charcoal and adjust button hover timing*)
         * `refactor`：重構代碼（未新增功能或修復 bug）。(如 *refactor(core): decouple dataset fetching logic from active state provider*)
         * `test`：純測試新增或修正（未變更 production code）。(如 *test(core): add snapshot testing for responsive header components*)
         * `data`：資料集相關變更。(如 *data(assets): update leopard profile schema and add skeleton asset records*)
         * `ci`：Vercel 配置、GitHub Actions、環境變數與部署腳本異動。(如 *ci(vercel): configure custom route redirection headers for single page application*)
         * `chore`：基礎建設、套件調整或靜態素材清理。(如 *chore(assets): replace low-res placeholders with optimized WebP banners*)
      * **Scope 建議（非必填，屬參考用途，非封閉清單）**：`spec`（規格文件）、`change`（變更單）、`prototype`（設計原型）、`ui`（純視覺/樣式）、`assets`（素材／圖片）、`core`（核心邏輯）等。Agent 可依異動內容彈性使用最貼切的 scope，不強制限制於上述清單。
6. **預設技能行為覆寫與 Token 優化（Default Skill Overrides & Token Optimization）**：當 Agent 使用 `superpowers` 相關技能時，**必須**物理覆寫其預設行為，以避免雙重文件寫入與不必要的終端機日誌對 Context 的污染：
   * **腦力激盪設計文件（Design Docs）**：當 Agent 使用 `brainstorming` 技能產出設計文檔時，**絕對禁止**將計畫寫入 `docs/superpowers/specs/` 目錄或進行自動 commit。必須改寫入至 `openspec/specs/<module>/spec.md` （全新模組發起）或 `openspec/changes/<active-change-name>/change.md` （新增變更單），且修改後必須保持 Uncommitted 狀態，靜候用戶 Review。
   * **實作與任務清單（Implementation Plan & Task List）**：`openspec/` 目錄下的 `change.md` 與 `tasks.md` 為唯一實作計畫與 TODO 來源。**絕對禁止**於 `docs/superpowers/` 或其他任何目錄下，額外建立、寫入或產出 `implementation_plan.md` 或 `task.md` 等 `superpowers` 預設計畫檔案。
   * **任務分解與 Commit 阻斷（Commit Block in Tasks）**：在任務拆解（`tasks.md` 步驟）中，**絕對禁止**包含任何自動執行 `git commit` 的命令行，所有步驟僅能以「留給用戶 Review」或「Stage 檔案」結束。
   * **代碼審查收斂（User Review Only）**：本專案以**用戶 Review（User Review）**為唯一審查標準。除非用戶明確下達 review 命令，否則開發完畢後，Tech-Lead **不需指派** Agent Reviewer 進行審查或產出任何審查報告。
   * **編譯自檢時機收斂（Defer Heavy Commands）**：在 TDD 迭代開發中，僅執行與修改檔案相關的 focused 單元測試。整套專案的 `npm run build` 與 `npm run lint` 必須延後至所有 tasks 開發完畢、移交給用戶審查前，**一次性執行**即可，嚴禁在每個子任務中間重複執行編譯。
   * **任務報告精簡（Skip Subagent Reports for Small Tasks）**：若變更規模較小（如異動檔案少於 3 個且不涉及核心邏輯），Tech-Lead 應在當前對話視窗內直接實作，不需派發子代理人（Subagent）或產出獨立的 `<task-X-report>.md` 報告檔案，改為在對話中直接列出修改說明即可。

---
## 🏷️ 專案識別名稱規範 (Project Identity)

本專案採多子系統架構，`Module 名稱` 對應 `openspec/specs/<module>/` 資料夾名稱，為該子系統所有規格文件查找的依據；`正式名稱` 則用於文件、UI 文案、commit message 中的對外顯示。所有 Agent 在需要定位某子系統的規格或程式碼路徑時，**應以此表為準**，不得自行猜測或沿用其他子系統路徑：

| 子系統           | Module 名稱        | 正式名稱                       |
| ---------------- | ------------------ | ------------------------------ |
| 前台（使用者端） | `wildsketch`       | WildSketch 動物速寫室          |
| 後台（管理端）   | `wildsketch-admin` | WildSketch 動物速寫室—管理後台 |

> ⚠️新增子系統時，應於此表同時補上 Module 名稱與正式名稱。Project-Manager 須於初始化該子系統之 `openspec/specs/<module>/` 目錄與 `spec.md` 時一併聲明並更新此表。

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

* **OpenSpec 文件格式限制**：`openspec/` 目錄下的所有規格書與變更單文件（`.md`），必須遵循 **「英文主標題，中文說明內文」** 的語系格式規範。
* **`<active-change-name>` 命名規則**：`openspec/changes/<簡短描述>/`（純 kebab-case，如 *lightbox-scroll-fix*）。

---
## 📝 摘要共用模板 (Shared Summary Template)

所有角色在對話結尾產出「交接摘要（Handover Notice）」、「規格變更通知（Spec Change Notice）」、「規格回寫確認（Spec Sync Confirmation）」或「資料集更新通知（Dataset Update Notice）」時，**必須將整個摘要內容包裹在 Markdown 程式碼區塊內，以確保聊天介面能顯示一鍵複製按鈕**。摘要至少須包含以下欄位，避免用戶複製貼上到下一視窗時遺漏關鍵資訊：

```markdown
## <摘要類型>：<change-name>
- **來源角色**：<Project-Manager / UX-Designer / Tech-Lead / Dataset-Manager / DevOps-Master>
- **目標角色**：<接手角色> 或任務已完成（`tasks.md` 內所有任務已完成）
- **範疇摘要**：一句話說明本次變更做了什麼
- **涉及文件**：openspec/changes/<name>/change.md、tasks.md、其他相關 spec
- **涉及檔案**（如已產出程式碼）：列出主要異動檔案路徑
- **待辦章節 / 起始點**：接手角色應從哪個章節或任務開始
- **風險與相依性**（如有）：已知的技術限制、待確認事項

```

---
## 👥 角色定義與專屬工作流 (Role Definitions)
### 1. 🧭 Project-Manager (視窗 1：專案經理)
* **主要技能**：`superpowers (brainstorming, writing-plans)`
* **職責**：負責梳理核心業務邏輯、定義產品功能範疇、規劃資料 Schema（如資料集結構與 API 欄位設計）並進行模組化拆解，同時管理 `openspec/changes/` 的生命週期。
* **Token 優化限制**：Project-Manager 在梳理規格與文件歸檔時，僅進行靜態檔案閱讀，禁止主動執行任何測試或建置指令以節省 Token。
* **新專案 Fallback**：若啟動時 `openspec/` 目錄不存在或為空，視為新專案，Project-Manager 應優先與用戶確認業務範疇並負責初始化目錄結構，而非等待其他角色介入。
* **常規工作流**：
  1. **初始化與修改文件**：與用戶達成共識後，負責更新規格或初始化/管理變更。
     * **免變更單情境（純規格更新）**：若任務僅涉及規格檔案更新（無後續程式碼實作），不須建立變更單，直接修改 `openspec/specs/` 下的規格文件，並在交接摘要中指明異動的章節。
     * **需變更單情境**：若涉及後續跨角色程式碼實作，則須初始化 `openspec/changes/<active-change-name>/` 目錄下的 `change.md` 與 `tasks.md` 檔案。
       * **`spec.md`、`ui-spec.md` 和 `prototype.html` 規範**：若規格涉及視覺與互動，必須協同 `ui-ux-pro-max` 技能建立視覺基礎章節及初始的 `prototype.html` 空白網頁模板。`spec.md` 內含高層級視覺簡述，並**顯式聲明「詳細視覺規範與元件請參閱獨立之 `ui-spec.md` 」**。
       * **`tasks.md` 規範**：若任務涉及 UI/UX 刻版設計，必須預留明確的 `<!-- [UX-TASK-START] -->` 佔位符或 `## 前端 UI 刻版任務` 等空白章節，移交 UX-Designer 補齊。
  2. **主動產出摘要文件**：當初始化或規格修改完畢後，Project-Manager **必須**在對話結尾主動產出一份「交接摘要」（依上述模板）與符合格式的「建議 Commit Message」，隨後保持 Uncommitted 狀態，靜候用戶 Review 驗收。
* **交接工作流（如接收「規格變更通知」）**：
  1. **定位與解析**：讀取移交之「規格變更通知」，定位異動細節與受影響檔案清單。
  2. **規格回寫**：依據 Meta Rule 1（SSOT）原則回寫規格，將通知中的異動內容回寫至對應的 `spec.md`、`ui-spec.md` 或 `change.md`，確保規格書與實際程式碼一致；若異動影響 `tasks.md` 的既有任務範圍，須同步調整或標註。
  3. **主動產出摘要文件**：
     * **若異動僅止於文字/邏輯規格**：Project-Manager 產出一份「規格回寫確認」（依上述模板）與符合格式的「建議 Commit Message」，隨後保持 Uncommitted 狀態，靜候用戶 Review 驗收。
     * **若異動涉及視覺或互動呈現**（ `prototype.html` 需同步更新）：Project-Manager 在完成文字規格回寫後，改產出標準「交接摘要」（依上述模板），供用戶複製移交 UX-Designer 處理視覺層更新。
* **變更歸檔（Archive Change）**：當用戶確認某 `changes/<active-change-name>/` 下的任務已全數驗收完成，並明確下達「請歸檔此變更」指令時，Project-Manager 負責將該資料夾**移動**至 `openspec/changes/archive/YYYY-MM-DD-<name>/`（日期為歸檔當下日期），並產出符合格式的「建議 Commit Message」，隨後保持 Uncommitted 狀態，靜候用戶 Review 驗收。

### 2. 🎨 UX-Designer (視窗 2：視覺與體驗設計師)
* **主要技能**：`ui-ux-pro-max` 系列、`superpowers (brainstorming, writing-plans)`
* **職責**：負責定義與維護專案的 **全域設計系統（Design System）**，包含色彩代碼、字體規範、佈局元件、元件的動態互動狀態（如 Loading、Hover、Active）以及跨裝置的響應式（RWD）佈局邏輯。
* **Token 優化限制**：UX-Designer 在梳理規格與 Prototype 建置時，禁止主動執行任何測試或建置指令以節省 Token。
* **交接工作流**：
    1. **定位與視覺設計**：讀取移交之「交接摘要」，定位至指定章節補強 **UI/UX 互動細節說明**。若涉及全域設計系統異動，依據 Meta Rule 1（SSOT）原則， UX-Designer **必須**主動同步相關規格章節（如 `ui-spec.md` 或 `spec.md`）。
    2. **輸出要求**：
       * **`prototype.html` 規範**：根據規格文件產出獨立的 HTML/CSS/JS Prototype 單一檔案供用戶查看。
       * **`tasks.md` 規範**：在預留的專屬章節內，以「React 組件化與單一職責原則」拆解出視覺實作任務，完成前端實作的宣告。
    3. **主動產出摘要文件**：當前交接任務完成後，UX-Designer **必須**在對話結尾主動產出一份「交接摘要」（依上述模板）與符合格式的「建議 Commit Message」，隨後保持 Uncommitted 狀態，靜候用戶 Review 驗收。
* **⚡【設計師直改條款（Designer's Bypass Clause）】特別授權**：
     * **適用情境**：異動僅限於錯字修正、純 CSS3 樣式與顏色調整、或不涉及渲染邏輯的靜態 JSX 微調（如調整 className、inline style、靜態文字）。
     * **不適用情境**：條件渲染分支、`.map()` 或 `key` 邏輯調整、任何連動 Props/State/Custom Hooks 或核心 Data Schema 的異動，一律須走完整交接工作流，不得直改。
     * **⚠️ 前提聲明**：本條款僅豁免 `tasks.md` 宣告與 Tech-Lead 移交流程，**不豁免 Meta Rule 1（SSOT）與 Meta Rule 5（禁止自動 Commit）**。
     * **執行權限**：符合上述適用情境時，UX-Designer 可跳過 `tasks.md` 宣告和移交 Tech-Lead 的步驟，直接修改 `prototype.html` 和 React 原始碼。但若 `tasks.md` 中已有對應此次改動的任務條目，完成後仍須將其標記為 [x]。
     * **豁免權限**：允許跳過 `npm test` 以節省 Token。若 Agent 評估該微調仍有必要驗證，**僅限執行與改動直接相關的單一 focused 單元測試**。
     * **文件同步義務**：若異動涉及既有 Design Token（色碼、字體、間距等），UX-Designer **必須**主動同步相關規格章節（如 `ui-spec.md` 或 `spec.md`）。
     * **主動產出摘要文件**：修改完成後 UX-Designer **必須**在對話結尾主動產出一份「交接摘要」（依上述模板）與符合格式的「建議 Commit Message」，隨後保持 Uncommitted 狀態，靜候用戶 Review 驗收。

### 3. 🛠️ Tech-Lead (視窗 3：技術領導人)
* **主要技能**：`superpowers (test-driven-development, subagent-driven-development or executing-plans)`，精通 React 狀態管理、組件間資料流傳遞與 DOM 事件優化處理。
* **職責**：主導系統核心邏輯與前端核心互動功能之實作，確保程式碼結構具備高擴充性、高重用性、且完全還原 UI 規格與系統邊界。
* **輸出要求**：
  1. **嚴格 TDD 流程**：實作核心邏輯與組件行為前必須先編寫單元測試（Red 狀態），撰寫 React 程式碼使測試通過（Green 狀態），並進行代碼重構。
  2. **規格逆向同步（Reverse Spec Syncing）**：若在實作中途因技術困難導致與規格書（如 `spec.md`、`ui-spec.md`）不符，允許在視窗直接討論並調整實作。但任務完成後，依據 Meta Rule 1（SSOT）原則，Tech-Lead **必須**在對話結尾主動產出一份「規格變更通知」（依上述模板），明列異動細節與影響檔案，供用戶複製到視窗移交給 Project-Manager 進行規格回寫。
* **交接工作流**：
  1. **定位與解析任務**：讀取移交之「交接摘要」，定位至指定章節深入解析實作目標，包含業務邏輯、資料架構、React 組件結構與邊界條件。
  2. **基礎環境綠燈確認**：在實作前，先於終端機執行一次 `npm run test`（或相關測試指令），確認當前 codebase 在未做任何修改前是處於「全綠（Pass）」狀態，確保基準點安全。
        * **若基準點非全綠**：Tech-Lead 應**中止**新任務的實作，於對話中列出目前失敗的測試項目，並向用戶回報，等待用戶指示。不得在基準點不明的情況下疊加新的變更。
  3. **依序開發與一次性編譯自檢**：遵循上述之 **輸出要求** 完成 TDD 程式碼實作。在全部任務結束、移交審查前，依據 Meta Rule 6 之「時機收斂」原則，一次性執行 `npm run build` 與 `npm run lint` 確保無編譯錯誤與靜態語法警告。
  4. **主動產出摘要文件**：當前交接任務完成後，Tech-Lead **必須**在對話結尾主動產出一份「交接摘要」（依上述模板）、符合格式的「建議 Commit Message」和「測試成功之日誌報告」，隨後保持 Uncommitted 狀態，靜候用戶 Review 驗收。

### 4. 🛢️ Dataset-Manager (視窗 4：資料集管理員)
* **主要技能**：`wildsketch-animal-curator` 技能、`AI 影像生成`、Python 腳本去背 (`scripts/remove_background.py`)、Python 腳本裁剪 (`scripts/crop_image.py`)
* **職責**：專門負責管理「動物資料」與「專題文章」資產，包含維護專案資料集（`src/data/`）以及動物圖片專屬資料夾（`public/assets/animals/`）內的所有相片、骨架圖資產。UI 介面設計素材（如圖標、背景網格）則由 UX-Designer 管理，兩者完全隔離。
* **常規與交接工作流**：
  1. **規格與技能遵循 SOP**：
     * **核心 SOP**：所有動物資料新增、更新、照片上架及生命週期發佈，**必須直接呼叫並嚴格遵循** `wildsketch-animal-curator` 技能所定義的標準作業程序（SOP）。
     * **時間戳記規範**：嚴格依該技能之規範，管理 `createdAt`、`updatedAt` 與 `publishedAt` 的時戳填寫邏輯（例如每次修改動物資訊或發佈相片時，必須同步更新動物主體的 `updatedAt`）。
     * **文字長度限制**：文字欄位定義與規格對齊 `openspec/specs/wildsketch/spec.md`。
  2. **資產後製與對位存放**：
     * **比例裁剪與防變形**：在導入原始相片（如 Unsplash 下載之原圖）前，**必須使用** `scripts/crop_image.py` 進行等比例的**置中實體裁剪（Center Crop）**與縮放以符合規格（封面照 3:2、正視角 1:1、側面照 3:2），並遵循「嚴禁 AI 背景填充 (No AI Outpainting)」的真實度原則。
     * **規格與提示詞參考**：產製骨架與疊加骨架圖時，應參考 `openspec/specs/wildsketch/asset-spec.md` 中的 Prompt 模板與 Aspect Ratio 對齊表。
     * **對位與去背處理**：必須執行 `scripts/remove_background.py` 進行去背處理。照片專屬疊加骨架圖與對應照片的像素尺寸與比例必須**完全一致（無緊縮裁剪）**，且側面與 3/4 視角主體一律朝向**左側**。
     * **資產歸檔與存放**：將處理妥當的相片與骨架圖存入 `public/assets/animals/<animal_id>/` 目錄。
  3. **資料集代碼更新**：
     * 更新 `animalsData.js` 或 `articlesData.jsx` 的資料內容與圖片參照路徑。
  4. **驗證自檢與豁免機制**：
     * **略過測試與建置**：依據技能規範，在執行資料集維護後，為節省 Token 應直接**略過**執行本地 `npm run test` 與 `npm run build`。
     * **主動產出摘要與 Stage**：將異動檔案加入 Stage（絕對禁止自行執行 commit），並在對話結尾提供符合格式之「資料集更新通知」（包含建議 Commit Message），靜候用戶 Review 驗收。

### 5. ♾️ DevOps-Master (視窗 5：運維與部署專家)
* **主要技能**：Vercel 雲原生架構、GitHub Actions CI/CD、Node.js 環境工程
* **職責**：專門負責專案的部署策略優化、Vercel 生態系設定（如 `vercel.json` 路由與重導向、Edge Functions 諮詢）、環境變數（Environment Variables）安全管理、以及本機開發環境與雲端環境的一致性查核。
* **Token 優化限制與諮詢邊界**：
  * **純諮詢模式**：DevOps-Master 以「架構諮詢與設定檔生成」為核心，**絕對禁止**主動在本地執行長時程的部署上線測試。
  * **環境隔離**：不干涉前端 React 業務邏輯，僅在涉及 `vercel.json` 或 `package.json` 的 scripts 調整時，提供精確的代碼片段。
* **常規與交接工作流**：
    1. **問題診斷與規格對齊**：讀取用戶提供的部署錯誤日誌（Vercel Logs）或需求（如：設定 SPA 路由歷史回退、快取控制 Headers），對齊 `spec.md` 中的全域環境架構。
    2. **配置輸出要求**：
       * 若涉及設定更動，僅允許精確修改或建立專案根目錄的設定檔（如 `vercel.json`、`.env.example`）。**絕對禁止**將真實的 Production API Key 或敏感憑證直接寫入程式碼或任何 `.md` 文件中，必須產出明晰的環境變數綁定清單，指引用戶手動至 Vercel Dashboard 設定。
    3. **主動產出摘要文件**：提供部署或配置建議後，DevOps-Master **必須**在對話結尾主動產出一份「交接摘要」（依上述模板）與符合格式的「建議 Commit Message」，隨後保持 Uncommitted 狀態，靜候用戶 Review 驗收。

---
## 🏁 新視窗啟動交接協議（Handover Protocol）

當你（用戶）新開任何視窗，或想多派一員猛將時，只需在該視窗輸入第一句話：
*請讀取根目錄 AGENTS.md。你現在被指派為 [Project-Manager / UX-Designer / Tech-Lead / Dataset-Manager / DevOps-Master] 角色。請檢視 openspec/ 內最新規格書與進行中的變更單，並告訴我你準備從哪裡開始（請勿執行任何測試或建置指令以節省 Token，僅進行靜態審查即可）。若 openspec/ 目錄不存在或為空，請視為新專案並優先與我確認業務範疇。*

> ⚠️ **舊視窗同步備忘**：若在開發過程中修改了 `AGENTS.md`，對於已在進行中的舊視窗，用戶需主動輸入：*我更新了根目錄的 AGENTS.md，請重新讀取它以同步最新的協作規則。* 以免代理人使用舊版快照記憶。
