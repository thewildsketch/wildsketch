---
name: wildsketch-animal-curator
description: Standard operating procedure (SOP) for managing animal datasets and generating transparent skeleton assets for WildSketch. Use this skill whenever you need to add a new animal, update existing animal profiles, upload photo references, generate skeleton assets, or publish animal data in the WildSketch project.
category: project-specific
project: wildsketch
---

# WildSketch Animal Curator Skill

本技能定義了 **Dataset-Manager** 與其他開發人員在 `WildSketch` 專案中，新增、編輯動物資料集及產製骨架圖資產的標準作業程序（SOP）。

## 📌 核心機制與時間戳記規範
動物資料與相片參考具有生命週期時間戳記，在更新資料時必須嚴格遵守以下填寫邏輯：
1. **動物主體時間戳記**：
   * **`createdAt` (建立時間)**：僅在新增動物資料時寫入一次，之後永不變更。
   * **`updatedAt` (更新時間)**：每次修改動物欄位資訊並儲存時更新。此外，每次為該動物新增相片參考，或更新相片狀態（如 `status` 改為 `"published"`) 時，**必須同步更新動物主體的 `updatedAt`**。
   * **`publishedAt` (發佈時間)**：第一次將動物的 `status` 從 `"draft"` 切換為 `"published"` 時寫入（未發佈時必須為 `null`，一旦寫入則不可修改）。
2. **照片參考物件時間戳記**：
   * **`createdAt` (建立/上傳時間)**：照片上架在草稿狀態時寫入。
   * **`updatedAt` (更新時間)**：每次編輯或照片狀態更新時寫入。
   * **`publishedAt` (發佈時間)**：首次將照片狀態從 `"draft"` 發佈切換為 `"published"` 時寫入（未發佈時為 null）。

---

## 📂 資產存放與圖片命名規則

為了保持專案資產結構的條理，所有媒體檔案均需存放在 `public/assets/animals/<animal_id>/` 下，並遵循以下命名與路徑規格：

* **封面圖 (coverImage)**：
  * 存放路徑：`public/assets/animals/<animal_id>/cover.jpg`
* **物種通用骨骼 (Species General Skeleton)**：
  * 存放路徑：`public/assets/animals/<animal_id>/<angle>_skeleton.png` (去背透明，其中 `<angle>` 值為 `front`、`side` 或 `threequarter`)
* **相片參考與專屬骨骼 (Photo Reference & Specific Skeleton)**：
  * 必須存放在對應角度的**子資料夾**中：
    * 相片參考：`public/assets/animals/<animal_id>/<angle>/<angle>_ref<hash值>.jpg`
    * 專屬骨骼：`public/assets/animals/<animal_id>/<angle>/<angle>_ref<hash值>_skeleton.png` (去背透明)
  * *註：`<hash值>` 可採用簡短隨機雜湊值或序號，以確保檔名唯一性。*

---

## 🛠️ 作業流程指引

### 工作流 1：新增動物資料 (草稿狀態)
1. **初始化 Schema**：在 `src/data/animalsData.js` 中新增該動物，預設 `status` 設為 `"draft"`。
2. **設定排序**：`sortOrder` 設定為目前資料集最大值 + 1。
3. **初始化時間戳記**：`createdAt` 與 `updatedAt` 設為目前 ISO-8601 UTC 時間（如 `YYYY-MM-DDTHH:mm:ssZ`），`publishedAt` 設為 `null`。
4. **填入基礎資訊**：填入 `names` (zh/en)、`postureType`、`wikiUrl` 等資訊。
5. **檢核 `coverImage`**：若用戶未提供封面照片，應主動提示用戶補齊。
6. **產製骨架參考圖**：
   * **讀取產圖規格**：使用 `view_file` 讀取專案中的 [asset-spec.md](file:///d:/project/wildsketch_dev/openspec/specs/wildsketch/asset-spec.md)，依照其中的 Prompt 模板與 Aspect Ratio 對齊表產製骨架與參考相片。
   * **執行去背處理**：執行 `python scripts/remove_background.py <輸入JPG路徑> <輸出PNG路徑>` 進行去背，將去背透明 PNG 儲存為對應的 `<angle>_skeleton.png`。
7. **詢問發佈意願**：詢問用戶是否要直接發佈。

### 工作流 2：更新既有動物資訊
1. **定位動物**：在 `src/data/animalsData.js` 中找到該動物。
2. **修改內容**：依據用戶指示更新欄位值。
3. **更新時間戳記**：將該動物主體的 `updatedAt` 更新為目前的 ISO-8601 UTC 時間戳記。

### 工作流 3：上傳新照片參考
1. **下載與記錄出處**：
   * 在 Unsplash 等授權平台尋找合適圖片。
   * 下載最高解析度原圖，並將下載網址記錄於 `sourceImage` 欄位。
   * 將 Unsplash 原圖頁面網址記錄於 `sourceUrl` 欄位，以利署名追蹤。
2. **後製對齊與骨骼產製**：
   * **參考照片與疊加骨骼保留原始比例與尺寸（不強迫裁剪）**，以防動物主體被截斷。
   * **產圖規範**：疊加骨架圖**絕對禁止包含體表外輪廓與任何皮肉/頸部/腹部等外觀線條**（必須為 **pure bones only**，在提示詞中明確寫入 `strictly NO body contour outline, NO neck skin outline, NO belly skin outline, NO flesh outline, NO skin lines`），且**絕對禁止包含任何英文標籤文字與指引線**（避免與底圖照片疊加時干擾寫生）。
   * **對齊規範**：以原始照片中動物的姿態為基準直接生成對應姿勢之骨架。使用 `scripts/remove_background.py` 去背後，等比例縮放並置中對位（骨架覆蓋照片中動物位置即可，**禁止採用容易切割裁剪的非剛性仿射扭曲變換**），確保去背骨骼 PNG 的畫布大小與照片寬高像素 100% 完全一致。
   * **後製裁切規範**：**嚴禁使用 AI 進行 Outpainting 等背景補足或生成式填充**。必須尊重原照片構圖，僅進行等比例縮放與對齊裁切。
   * 將彩色照片與透明 PNG 骨架存放至對應視角子資料夾：`public/assets/animals/<animal_id>/<angle>/`。
3. **更新照片結構**：
   * 在對應的 `angles.<angle>.photos` 陣列中新增相片物件，將相對路徑填入 `url` 與 `skeleton` 欄位（對齊子資料夾格式，如 `"/assets/animals/cat/front/front_ref2.jpg"`）。
   * 預設照片的 `status` 設為 `"draft"`。
   * 初始化時間戳記：`createdAt` 與 `updatedAt` 設定為目前 ISO-8601 UTC 時間戳記，`publishedAt` 設定為 `null`。
4. **詢問發佈意願**：詢問用戶是否發佈該相片。

### 工作流 4：發佈資料變更
當用戶要求發佈動物或照片時：
* **發佈動物**：
  1. 將動物主體 `status` 改為 `"published"`。
  2. 若 `publishedAt` 為 `null`，則將其更新為目前時間戳記；若已有值則維持不變。
  3. 將動物主體的 `updatedAt` 更新為目前時間戳記。
* **發佈照片**：
  1. 將照片物件的 `status` 改為 `"published"`。
  2. 若照片物件的 `publishedAt` 為 `null`，則將其更新為目前時間戳記。
  3. **將該照片物件的 `updatedAt` 更新為目前時間戳記**。
  4. **將該動物主體的 `updatedAt` 更新為目前時間戳記**。

---

## 📝 附錄：公告與專題文章資產規則

為了在後台及資料管理中維持命名與生命週期的唯一性，公告與專題文章的 ID 命名與檔案位置應遵守以下原則：

* **公告資料集**：
  * 資料檔案：`src/data/announcementsData.js`
  * ID 命名規則：`ann-<hash值>` (例如 `ann-7a2e8f`)
  * 時間戳記：必須包含與對齊統一的 `createdAt`、`updatedAt` 與 `publishedAt`。
* **專題文章資料集**：
  * 資料檔案：`src/data/articlesData.jsx`
  * ID 命名規則：`article-<hash值>` (例如 `article-5d9c1b`)
  * 時間戳記：必須包含與對齊統一的 `createdAt`、`updatedAt` 與 `publishedAt`。

---

## 🔍 驗證與自檢
本技能的變更屬於靜態資料與資產維護，在執行完成後：
1. **略過測試與建置**：無須在本地執行 `npm run test` 與 `npm run build`，以節省 Token。
2. **Stage 檔案**：將異動的檔案加入 Stage，但**絕對禁止自行執行 commit**，留給用戶 Review。
