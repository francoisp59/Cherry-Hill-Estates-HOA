# 🛠️ Website Maintenance Guide
**Project:** Cherry Hill Estates HOA Website
**Purpose:** This document outlines how to update the website's content without needing to change the actual code.

---

### 1. Managing Website Information
The website is designed to be "data-driven," meaning the content is stored in separate files from the layout.

#### A. General Settings (`config.js`)
The `config.js` file contains global information used across all pages.
*   **Community Name**: Change `communityName` to update the title of the site.
*   **Board Members**: The `boardMembers` list contains the names, roles, and emails of the leadership. To change a member, simply edit their entry in the list.
*   **City Links**: The `cityOrdinanceUrl` stores the link to the official city code library.

#### B. Latest News (`latest_news/` folder)
News items are stored as Markdown (`.md`) files.
*   **Adding News**: Create a new file named `news-XX.md` (e.g., `news-04.md`).
*   **Formatting**: 
    *   The **first line** must be the title, starting with a `#` (e.g., `# Annual Meeting`).
    *   The remaining lines are the body of the news.
*   **Ordering**: The website loads files numerically. `news-01.md` appears first.

#### C. Official Documents (`docs/` and `docs_meta/` folders)
Documents require two files to work correctly.
1.  **The PDF**: Upload your document to the `docs/` folder.
2.  **The Metadata**: Create a matching `.json` file in `docs_meta/` (e.g., `doc-03.json`).
    *   **Example JSON**:
        ```json
        {
            "name": "Annual Report 2026",
            "fileName": "annual-report-2026.pdf",
            "date": "2026-03-15"
        }
        ```

#### D. Community Tips (`tips/categories/` and `tips/providers/` folders)
The tips section is split into categories and the providers within them.
*   **Adding a Category**: Create a file in `tips/categories/` (e.g., `cat-04.json`) with the format: `{ "name": "Electricians" }`.
*   **Adding a Provider**: Create a file in `tips/providers/` following the pattern `catXX-XX.json` (e.g., `cat04-01.json` for the first provider in Category 4).
    *   **Provider Fields**: Name, Description, Phone, Email, and Website. If a field is not needed, set it to `null`.

---

### 2. Updating on GitHub
Since the site is hosted on GitHub, you can update it directly in your browser without any special software.

#### The "Web Interface" Workflow:
1.  **Login**: Go to your GitHub repository.
2.  **Navigate**: Go into the folder you want to change (e.g., `latest_news`).
3.  **Create/Edit**: 
    *   To add a new item: Click **Add file** $\rightarrow$ **Create new file**.
    *   To change an existing item: Click the file, then click the **Pencil icon (Edit)**.
4.  **Save (Commit)**: Scroll down to the "Commit changes" box.
    *   Enter a brief description (e.g., *"Updated news-01 with meeting date"*).
    *   Click **Commit changes**.

#### The "Local" Workflow (Using VS Code):
If you have the project open in VS Code:
1.  **Edit**: Make your changes to the files.
2.  **Stage**: Run `git add .` in the terminal.
3.  **Commit**: Run `git commit -m "Update description of changes"`.
4.  **Push**: Run `git push origin main`.

---

**Note:** Once you commit a change to GitHub, it may take a few minutes for GitHub Pages to refresh the live site for all visitors.
