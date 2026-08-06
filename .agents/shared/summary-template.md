# Shared Summary Template

所有角色在對話結尾產出「交接摘要（Handover Notice）」、「規格變更通知（Spec Change Notice）」、「規格回寫確認（Spec Sync Confirmation）」或「資料集更新通知（Dataset Update Notice）」時，**必須將整個摘要內容包裹在 Markdown 程式碼區塊內**，以確保聊天介面能顯示一鍵複製按鈕。

摘要至少須包含以下欄位，避免用戶複製貼上到下一視窗時遺漏關鍵資訊：

```markdown
## <摘要類型>：<change-name>
- **來源角色**：<PM / UX / Tech / DM / DevOps>
- **目標角色**：<接手角色> 或任務已完成（`tasks.md` 內所有任務已完成）
- **範疇摘要**：一句話說明本次變更做了什麼
- **涉及文件**：openspec/changes/<name>/change.md、tasks.md、其他相關 spec
- **涉及檔案**（如已產出程式碼）：列出主要異動檔案路徑
- **待辦章節 / 起始點**：接手角色應從哪個章節或任務開始
- **風險與相依性**（如有）：已知的技術限制、待確認事項
```
