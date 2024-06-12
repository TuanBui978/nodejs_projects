from venv import logger
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
from time import sleep
from get_data import *
from DB import *

def get_profile_urls_24(driver, url):
    page_source = BeautifulSoup(driver.page_source, 'html.parser')
    try:
        class_name = 'relative lg:h-[115px] w-full flex rounded-sm border lg:mb-3 mb-2 lg:hover:shadow-md !hover:bg-white !bg-[#FFF5E7] border-se-blue-10'
        a = page_source.find_all('a', class_=class_name)
        all_profile_urls = []
        for profile in a:
            profile_url = 'https://vieclam24h.vn' + profile.get('href')
            if profile_url not in all_profile_urls:
                all_profile_urls.append(profile_url)
        return all_profile_urls
    except Exception as e:
        logger.error(f"Error occurred while extracting profile URLs from {url}: {e}")
        return []


def get_profile_info_24(driver, url):
    try:
        driver.get(url)
        sleep(2)
        page_source = BeautifulSoup(driver.page_source, 'html.parser')
        company_names = get_company_name(page_source)
        job_titles = get_job_title(page_source)
        deadline = get_deadline_enrollment(page_source)
        salary = get_salary(page_source)
        exp_year = get_experience_requirement(page_source)
        role = get_role(page_source)
        num_of_employee = get_NumEmployee(page_source)
        edu = get_edu(page_source)
        src_pic = get_SrcPic(page_source)
        company_locations = get_company_location(page_source)
        company_description = get_company_description(page_source)
        description = get_description(page_source)
        requirement = get_requirement(page_source)
        job_industry = get_job_industry(page_source)
        staff_size = get_company_staff_size(page_source)
        posted_date = get_posted_date(page_source)
        enrollment_location = get_enrollment_location(page_source)
        age = get_age_requirement(page_source)
        gender = get_gender(page_source)
        probation = get_probation(page_source)
        work_way = get_work_way(page_source)
        benefit = get_benefit(page_source)
        return [company_names, job_titles, job_industry, company_locations, posted_date, enrollment_location, role, salary, gender, num_of_employee, age, probation, work_way, exp_year, edu, benefit, description, requirement, deadline, src_pic, staff_size, company_description]
    except Exception as e:
        logger.error(f"Error occurred while scraping data from {url}: {e}")
        return []

def is_duplicated(info, data):
    for i in data:
        if i[0] == info[1] and i[1] == info[2] and i[2] == info[3] and i[3] == info[4] and i[4] == info[5]:
            return True
    return False

# cursor.execute("SELECT JOB_NAME, INDUSTRY, COMPANY_LOCATIONS, POSTED_DATE, ENROLLMENT_LOCATION FROM JOB ORDER BY JOB_ID")
def get_job_data(driver, num_pages, link):
    try:
        page_start = 1
        data = []
        last_ampersand_index = link.rindex('&')
        sec_equal_index = link.rindex('page=')
        while page_start <= num_pages:
            url = f'{link[:sec_equal_index + 5]}{page_start}{link[last_ampersand_index:]}'
            driver.get(url)
            sleep(1)
            profile_urls = get_profile_urls_24(driver, url)
            data_DB = get_data_from_DB()
            for i in profile_urls:
                info = get_profile_info_24(driver, i)
                if info == []:
                    pass
                else:
                    if not is_duplicated(info, data_DB):
                        data.append(info)
                    
            page_start += 1
        return data
    except Exception as e:
        print(f"Error occurred while get data 24h: {e}")
        return []

