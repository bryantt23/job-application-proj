from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

URLS_TO_GET = 1000
url_ct = 1


def open_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError:
        print("Failed to decode JSON from the file.")
        return {}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {}


def get_job_url(driver, job, company):
    global url_ct
    # Wait for the "Apply" button to be present
    try:
        driver.get(job['url'])
        # Adjust the zoom level
        driver.execute_script("document.body.style.zoom='10%'")

        apply_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//a[contains(text(), 'Apply')]"))
        )
        application_url = apply_button.get_attribute('href')
        print(f"{url_ct}. Application URL: {
              application_url} for company: {company}, job title: {job['jobTitle']}")
        url_ct += 1
        job["job_url"] = application_url
    except Exception as e:
        job["job_url"] = "Not found"
        print("Apply button not found.")
        print(f"Error: {e}")


def write_incremental_to_file(data, file_path):
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
            print(f"Incremental update written to {file_path}")
    except Exception as e:
        print(f"An error occurred while writing to the file: {e}")


def get_url(driver, data, key, file_path_output, get_only_first_job):
    try:
        # Open a new tab and switch to it
        driver.execute_script("window.open('');")
        driver.switch_to.window(driver.window_handles[-1])

        # Open the URLs
        value = data[key]
        jobs = value["jobs"]

        for job in jobs:
            # Check if 'job_url' key exists and is not empty
            if "job_url" not in job or not job["job_url"]:
                get_job_url(driver, job, key)
                # Write to file after processing each job
                write_incremental_to_file(data, file_path_output)
                if get_only_first_job:
                    break

        # Close the current tab
        driver.close()
        # Switch back to the original tab
        driver.switch_to.window(driver.window_handles[0])

    except Exception as e:
        print(f"An error occurred: {e}")


def gather_urls(driver, data, file_path_output):
    # TODO make it go through the entire dict
    keys = list(data.keys())[:URLS_TO_GET]

    print('Gathering urls of first job')
    # Loop through each URL
    for key in keys:
        get_url(driver, data, key, file_path_output, get_only_first_job=True)

    print('Gathering urls of rest of jobs')
    # Loop through each URL
    for key in keys:
        get_url(driver, data, key, file_path_output, get_only_first_job=False)

    # Quit the driver
    driver.quit()


def main():
    file_path_input = 'C:/Users/bryan/Desktop/companyDataOutput.json'
    file_path_output = 'C:/Users/bryan/Desktop/companyDataOutputWithUrls.json'
    data = open_file(file_path_input)

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

    try:
        gather_urls(driver, data, file_path_output)
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
