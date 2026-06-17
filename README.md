# LEXUS NX 車款介紹 Wireframe

Lexus 官網車款介紹頁線框（wireframe）原型，採用 **Lexus 官網 WF Design System** 灰階線框設計系統。

## 線上預覽 / 部署（GitHub Pages）

1. 將此資料夾的內容推送到一個 GitHub repository（檔案放在 repo 根目錄）。
2. 進入 repo → **Settings → Pages**。
3. **Source** 選 `Deploy from a branch`，Branch 選 `main`（或你的預設分支）、資料夾選 `/ (root)`，按 Save。
4. 等待約 1 分鐘，即可由 `https://<帳號>.github.io/<repo>/` 開啟。

> `index.html` 為主頁面（NX 車款介紹）。

## 重要：避免 Jekyll 忽略資料夾

GitHub Pages 預設會用 Jekyll 處理網站，**底線開頭的檔案／資料夾會被忽略**。
為避免樣式失效，設計系統資料夾已命名為 `ds/`（不含底線），可正常載入。
根目錄另附帶一個空白的 **`.nojekyll`** 檔案作為雙保險 — 推送時請盡量保留（含隱藏檔）。

## 檔案結構

```
.
├── index.html                          # 主頁面（NX 車款介紹）
├── NX Wireframe - 重點段落版面探索.html   # 版面探索版本
├── .nojekyll                           # 關閉 Jekyll（雙保險）
├── ds/                                 # Lexus 官網 WF 設計系統（樣式 token / 元件 / RWD）
└── nx-assets/                          # 本頁的 CSS 與互動腳本
```

## 相依

React / Babel 由 unpkg CDN 載入（需連網）。其餘樣式與腳本皆為本地檔案。
