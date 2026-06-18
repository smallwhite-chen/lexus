# LEXUS 官網原型 · 部署包

靜態網站，可直接部署到 GitHub Pages，無需建置（no build step）。

## 結構
```
index.html      首頁（占位）
nx.html         NX 車款介紹頁
nx-assets/      共用 JS / CSS
ds/             設計系統樣式（Lexus Wireframe DS）
.nojekyll       關閉 GitHub Pages 的 Jekyll（保留底線開頭檔案）
```

## 部署到 GitHub Pages
1. 把本資料夾「裡面的內容」放到 repo 根目錄（讓 `index.html` 位於 repo 最上層）。
2. push 到 GitHub。
3. repo → **Settings → Pages** → Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)`，儲存。
4. 等一兩分鐘，網址為 `https://<帳號>.github.io/<repo 名>/`。

> 若改放在 `/docs` 資料夾，Pages 的 Source 就選 `main` / `/docs`。

## 注意
- 所有資產路徑皆為**相對路徑**，可直接放在子目錄網址下（`.../<repo名>/`）運作。
- `.nojekyll` 必須保留，否則 GitHub Pages 會忽略以底線開頭的檔案。
- 頁面需連網：Tweaks 面板會從 unpkg 載入 React/Babel（審稿工具）。要做純離線版可另外告知。
- 新增內頁請用 ASCII 檔名（例：`nx-equipment.html`），並以相對連結互通。
