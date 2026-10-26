# Outlook Management Panel (starter)

A static dashboard starter for GitHub + Render. It includes:
- Start/Stop **demo** controls
- A local account-entry list (email address + optional label)
- Activity log
- TXT export of non-sensitive account metadata
- Link to Microsoft's official signup page

**Important:** This starter does not create Outlook.com accounts, connect to Microsoft Graph, or run a background bot. The Start button is a UI demo only. Do not store passwords, recovery codes, client secrets, or access tokens in this project. Entries are saved in the current browser's local storage and are not shared across devices.

## Run locally
Open `index.html` in a browser.

## Publish with GitHub + Render
1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, `render.yaml`, and `README.md` to the repository root.
3. In Render, choose **New + → Static Site** and connect your GitHub repository.
4. Set **Build Command** to blank (or `echo static site`) and **Publish Directory** to `.`.
5. Click **Deploy**. Render will provide a live URL.

If you use `render.yaml`, you can also use Render's Blueprint flow to create the static site from the repository.

## Microsoft API integration
For real email features, register an app in Microsoft Entra and implement OAuth authorization code flow with PKCE. Request only the delegated Graph permissions needed for the feature. Keep confidential secrets on a backend service; never put secrets or access tokens in frontend code or export them to TXT. Microsoft Graph is not an open API for bulk creation of personal `@outlook.com` accounts.

