from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def crawl_area():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)

    driver.get('https://vieclam24h.vn/')
    wait = WebDriverWait(driver, 3)

    combobox = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'select-search-custom__value')))
    combobox.click()

    province_list = wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'select-search-custom__select')))

    province_options = province_list.find_elements(By.TAG_NAME, 'li')
    province_names = [option.text for option in province_options if option.text.strip()]

    driver.quit()
    return province_names


