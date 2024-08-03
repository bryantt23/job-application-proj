from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

file_path_input = 'C:/Users/bryan/Desktop/companyDataOutputWithUrls.json'
try:
    with open(file_path_input, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"File not found: {file_path_input}")
    data = {}
except json.JSONDecodeError:
    print("Failed to decode JSON from the file.")
    data = {}
except Exception as e:
    print(f"An error occurred: {e}")
    data = {}

# print(data)

urls = []
for [key, value] in data.items():
    job_url = value["jobs"][0].get("job_url")
    if job_url and job_url != 'Not Found' and job_url.startswith('http'):
        urls.append(value["jobs"][0]["job_url"])

print(urls)
