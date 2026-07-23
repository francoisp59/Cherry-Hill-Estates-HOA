# Starting the HOA Public Website

This guide explains how to launch the public-facing HOA website on your local computer using a local web server. This is the recommended way to view the website to ensure all links and features work exactly as they would on the live internet.

## Prerequisites

You must have **Node.js** installed on your computer. If you have already followed the "Porting the HOA CMS" guide, this is already done.

## Step-by-Step Instructions

### Step 1: Open a New Terminal
The CMS server and the Public Website server are two different programs. To run both at the same time, you need two separate terminal windows.

1. Press the **Windows Key** on your keyboard.
2. Type `cmd` and press **Enter**. This opens a new Command Prompt window.

### Step 2: Navigate to the Website Folder
You must tell the terminal to enter the folder containing the website files. 

*Replace the path below with the actual path where your HOA folder is located.*

```cmd
cd "C:\Users\YourName\Documents\aiprojects\HOA\hoa-website"
```
*(Tip: You can type `cd ` and then drag the `hoa-website` folder from your file explorer directly into the terminal window to automatically paste the path.)*

### Step 3: Launch the Local Server
Run the following command to start a temporary web server:

```cmd
npx serve
```

**Note**: If this is the first time you are running this command, the terminal may ask: 
`Need to install the following packages: serve. Ok to proceed? (y)`
Type `y` and press **Enter**.

### Step 4: Access the Website
Once the server starts, the terminal will display a list of local addresses. It will look something like this:

```text
┌──────────────────────────────────────────────────┐
│                                                  │
│   Local:            http://localhost:3000        │
│   On Your Network:  http://192.168.1.5:3000      │
│                                                  │
└──────────────────────────────────────────────────┘
```

1. Look for the **Local** URL (e.g., `http://localhost:3000`).
2. Copy that URL and paste it into your web browser's address bar.
3. Press **Enter** to view the website.

## Important Notes

### 1. Port Conflicts (CMS vs. Website)
The CMS (`website-management`) and the Public Website (`hoa-website`) both try to use port **3000** by default.
- If the CMS is already running, the website server will automatically detect that port 3000 is busy and pick a different one (usually **3001**, **5000**, or **8080**).
- **Always check the terminal output** to see which URL the website server assigned.

### 2. Keeping the Site Online
The website is only accessible as long as the Command Prompt window remains open. To stop the server, go to the terminal and press `Ctrl + C` or simply close the window.

### 3. Updating Content
If you make changes to the website using the CMS, you may need to refresh your browser page to see the updated content on the public website.
