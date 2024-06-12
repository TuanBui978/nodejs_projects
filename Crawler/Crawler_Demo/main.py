import concurrent.futures
from venv import logger
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from get_information import get_job_data
from DB import *
import get_information
from get_industry import crawl_industry
from get_area import crawl_area


def removeIfDuplicate(data):
    tmp = []
    for i in data:
        if i not in tmp:
            tmp.append(i)
        else:
            continue
    return tmp


def crawl_data():
    crawl_by_industry_links = []
    occupation_id = 1
    for occupation_id in range(1, 54):
        crawl_by_industry_links.append(
            f'https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?occupation_ids%5B%5D={occupation_id}&page=1&sort_q=')

    # industry = crawl_industry()
    # save_industry_into_DB(industry)
    area = crawl_area()
    area.pop(0)
    area.sort()
    save_area_into_DB(area)
    
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    try:
        for link in crawl_by_industry_links:
            with webdriver.Chrome(options=chrome_options) as driver:
                data = get_job_data(driver, 2, link)
                data = list(filter(None, data))  # filter none element
                company_data = []
                for d in data:
                    temp = []
                    temp.append(d[0])  # COMPANY_NAME
                    temp.append(d[3])  # COMPANY_LOCATIONS
                    temp.append(d[20])  # CONPANY_STAFF_SIZE
                    temp.append(d[21])  # COMPANY_DESCRIPTION
                    company_data.append(temp)

                company_data = removeIfDuplicate(company_data)
                save_company_into_DB(company_data)
                save_job_into_DB(data)

    except Exception as e:
        logger.error(f"Error occurred while scraping data: {e}")
    print('Finish scraping !')


if __name__ == '__main__':
    crawl_data()
