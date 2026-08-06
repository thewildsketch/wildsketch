# Commit Guide

Conventional Commits 完整規範與範例表。

---

## 格式

```
<type>(<scope>): <subject>
```

- 一律使用**小寫**
- 主旨採**英文**、主動語態
- 結尾不加句點

---

## Type 對照表

| Type | 適用情境 | 範例 |
|---|---|---|
| `docs` | `openspec/` 的文件更新 | `docs(spec): document JavaScript data schema for animal dataset` |
| `feat` | 新功能或新 React 組件實作 | `feat(ui): add AnimalCard grid component for responsive desktop layout` |
| `fix` | 修正 bug | `fix(lightbox): fix body scroll lock issue when gallery modal opens` |
| `style` | 不影響邏輯的視覺調整、CSS3 樣式更動 | `style(ui): update primary brand color to charcoal and adjust button hover timing` |
| `refactor` | 重構代碼（未新增功能或修復 bug） | `refactor(core): decouple dataset fetching logic from active state provider` |
| `test` | 純測試新增或修正（未變更 production code） | `test(core): add snapshot testing for responsive header components` |
| `data` | 資料集相關變更 | `data(assets): update leopard profile schema and add skeleton asset records` |
| `ci` | Vercel 配置、GitHub Actions、環境變數與部署腳本異動 | `ci(vercel): configure custom route redirection headers for single page application` |
| `chore` | 基礎建設、套件調整或靜態素材清理 | `chore(assets): replace low-res placeholders with optimized WebP banners` |

---

## Scope 建議（非封閉清單）

`spec`（規格文件）、`change`（變更單）、`prototype`（設計原型）、`ui`（純視覺/樣式）、`assets`（素材／圖片）、`core`（核心邏輯）等。依異動內容彈性選用最貼切的 scope。
