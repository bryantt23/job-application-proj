from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

# List of URLs from Himalayas
urls = [
    "https://himalayas.app/companies/rollstack/jobs/middle-senior-software-engineer-typescript-latin-america",
    "https://himalayas.app/companies/woodland-power-products/jobs/customer-service-representative",
    "https://himalayas.app/companies/moxie/jobs/physician-medical-director-for-medspas-residing-ca-9633891971",
    "https://himalayas.app/companies/oowlish-technology/jobs/backend-quality-assurance-engineer-2020719466"
    # Add more URLs as needed
]

# Set up Chrome options
options = Options()
options.headless = False  # Run in non-headless mode to see the browser window
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920x1080')

# Set up ChromeDriver service
chrome_driver_path = './chromedriver/chromedriver.exe'
service = Service(chrome_driver_path)

# Initialize the Chrome driver
driver = webdriver.Chrome(service=service, options=options)

# Loop through each URL
for url in urls:
    try:
        # Open a new tab and switch to it
        driver.execute_script("window.open('');")
        driver.switch_to.window(driver.window_handles[-1])

        # Open the URL
        driver.get(url)
        time.sleep(3)  # Wait for the page to load

        # Execute a script to get the href of the "Apply" button without clicking it
        application_urls = driver.execute_script(
            "return Array.from(document.querySelectorAll('a')).map(a => a.href).filter(href => href && href.includes('apply'))"
        )

        # Print the URL if found
        if application_urls:
            print(f"Application URL: {application_urls[0]}")
        else:
            print("Apply button not found.")

        # Close the current tab
        driver.close()

        # Switch back to the original tab
        driver.switch_to.window(driver.window_handles[0])

    except Exception as e:
        print(f"An error occurred: {e}")

# Quit the driver
driver.quit()
