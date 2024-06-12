from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from DB import save_industry_into_DB

def get_industry(source):
    soup = BeautifulSoup(source, 'html.parser')
    div = soup.find('div', class_='css-12jo7m5')
    industry = div.find('span', class_='cursor-pointer').get_text(' ', strip=True)
    return industry

def crawl_industry():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)

    links = []
    industries = []  # Move the industries list outside the loop

    for occupation_id in range(1, 54):
        links.append(f'https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?occupation_ids%5B%5D={occupation_id}&page=1&sort_q=')
    
    for link in links:
        driver.get(link)
        source = driver.page_source
        industry = get_industry(source)
        if industry:
            industries.append(industry)
    return industries
            
            
    