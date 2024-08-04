# Job Application Automation

This project automates the process of gathering job URLs from a job site, saving them, and opening them in a browser for application using Chrome extensions.

## Workflow

1. **Gather Job URLs**: Use the `gatherUrls.js` script in the browser console to generate a JSON file (`companyDataOutput.json`) containing job URLs.

2. **Extract Application URLs**: Run `get_specific_urls.py` using Python to generate `companyDataOutputWithUrls.json` with direct application URLs.

3. **Open Application URLs**: Use `openUrls.js` in the browser console to open each job application URL in new tabs, marking them as visited.

## Files

- `gatherUrls.js`: JavaScript code to run in the browser console to gather job URLs and save them to a JSON file.
- `get_specific_urls.py`: Python script that processes the JSON file to extract specific application URLs.
- `openUrls.js`: JavaScript code to run in the browser console to open job application URLs in new tabs.

## Instructions

### Step 1: Gather Job URLs

1. Navigate to the job listing page in your browser.
2. Open the developer tools (usually F12 or right-click > "Inspect").
3. Go to the "Console" tab.
4. Copy the contents of `gatherUrls.js` and paste it into the console.
5. Run the script by pressing Enter.
6. Follow the on-screen prompts to select a JSON file to update or start fresh.
7. The script will navigate through job listings, gather URLs, and download `companyDataOutput.json`.

### Step 2: Extract Application URLs

1. Ensure Python and Selenium WebDriver are installed on your system.
2. Run the Python script `get_specific_urls.py` in your terminal:
   ```bash
   python get_specific_urls.py

3. This will read from `companyDataOutput.json` and output `companyDataOutputWithUrls.json` with direct job application URLs.

### Step 3: Open Application URLs

1. Open your browser and access the developer tools (usually F12 or right-click > "Inspect").
2. Go to the "Console" tab within the developer tools.
3. Copy the contents of `openUrls.js` and paste it into the console.
4. Run the script by pressing Enter.
5. The script will prompt you to select `companyDataOutputWithUrls.json`.
6. After selecting the file, the script will open each job application URL in a new tab and mark them as visited for you to apply using browser extensions.

## Notes

- Ensure your browser settings allow pop-ups from the job application site.
- Use browser extensions if necessary to auto-fill application forms for efficiency.
- Modify the `PAGES_TO_OPEN` variable in `gatherUrls.js` if you need to change the number of pages the script processes.
- The scripts are designed for job sites that structure their HTML in a specific format. Adjust selectors if needed for different sites.

## Requirements

- Python 3.x
- Selenium WebDriver
- Google Chrome browser with the correct version of `chromedriver`

