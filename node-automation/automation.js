const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Launching Puppeteer with a temporary user data directory...');

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: 'C:\\path\\to\\temporary\\user\\data\\dir', // Use a temporary directory
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu'
            ],
            ignoreDefaultArgs: ['--disable-extensions'], // Ensure extensions are not disabled
            dumpio: true // Output browser process stdout and stderr
        });

        const page = await browser.newPage();

        // Navigate to Google
        await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });

        // Check the current URL to ensure it's loaded correctly
        const currentUrl = await page.url();
        console.log('Current URL:', currentUrl);

        // Wait for 30 seconds to allow for manual inspection
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Close the browser
        await browser.close();
        console.log('Browser closed successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
})();
