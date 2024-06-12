import mysql.connector
from venv import logger

# DB_Name = 'pbl3_database'
DB_Name = 'pbl3test'
DB_Password = 'Hoc12345'

def save_company_into_DB(data):
    try:
        connection = mysql.connector.connect(user='root', password=DB_Password, host='localhost',
                                             database=DB_Name)
        cursor = connection.cursor()
        query = "INSERT INTO COMPANY (COMPANY_NAME, LOCATION, STAFF_SIZE, COMPANY_DESCRIPTION) VALUES (%s, %s, %s, %s)"
        for i in data:
            getCompanyId = "SELECT ID FROM COMPANY WHERE COMPANY_NAME = '" + str(i[0]) + "'"
            cursor.execute(getCompanyId)
            id = cursor.fetchone()
            if id is None:
                cursor.execute(query, i)

        connection.commit()
        connection.close()
    except Exception as e:
        logger.error(f"Error occured while saving data to DB: {e}")

def save_industry_into_DB(data):
    try:
        connection = mysql.connector.connect(user='root', password=DB_Password, host='localhost',
                                             database=DB_Name)
        cursor = connection.cursor()
        query = "INSERT INTO INDUSTRY (INDUSTRY_NAME) VALUES (%s)"
        for i in data:
            cursor.execute(query, [i])

        connection.commit()
        connection.close()
    except Exception as e:
        logger.error(f"Error occured while saving data to DB: {e}")

def save_area_into_DB(data):
    try:
        connection = mysql.connector.connect(user='root', password=DB_Password, host='localhost',
                                             database=DB_Name)
        cursor = connection.cursor()
        query = "INSERT INTO AREA (AREA_NAME) VALUES (%s)"
        for i in data:
            cursor.execute(query, [i])

        connection.commit()
        connection.close()
    except Exception as e:
        logger.error(f"Error occured while saving data to DB: {e}")
             
def save_job_into_DB(data):
    try:
        connection = mysql.connector.connect(user='root', password=DB_Password, host='localhost',
                                             database=DB_Name)
        cursor = connection.cursor()
        query = "INSERT INTO JOB(COMPANY_ID, JOB_NAME, INDUSTRY, LOCATION, POSTED_DATE, ENROLLMENT_LOCATION, `ROLE`, SALARY, GENDER_REQUIREMENT, NUMBER_OF_RECRUITMENT,  AGE_REQUIREMENT, PROBATION_TIME,  WORKWAY, EXPERIENCE_REQUIREMENT, DEGREE_REQUIREMENT, BENEFITS, JOB_DESCRIPTION, JOB_REQUIREMENT, DEADLINE, SOURCE_PICTURE) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        for i in data:
            getCompanyId = "SELECT ID FROM COMPANY WHERE COMPANY_NAME = '" + str(i[0]) + "'"
            companyId = get_company_id_FromDB(getCompanyId)
            tmp = []
            tmp.append(companyId)
            tmp.extend(i[1:20])
            cursor.execute(query, tmp)

        connection.commit()
        connection.close()
    except Exception as e:
        logger.error(f"Error occurred while saving data to DB: {e}")


def get_company_id_FromDB(data):
    try:
        connection = mysql.connector.connect(user='root', password=DB_Password, host='localhost',
                                             database=DB_Name)
        cursor = connection.cursor()
        cursor.execute(data)
        res = cursor.fetchone()
        res = ''.join(str(x) for x in res)
        return res
    except Exception as e:
        logger.error(f"Error occured while saving data to DB: {e}")
        
def get_data_from_DB():
    try:
        connection = mysql.connector.connect(user='root', password=DB_Password, host='localhost',
                                             database=DB_Name)
        cursor = connection.cursor()
        cursor.execute("SELECT JOB_NAME, INDUSTRY, LOCATION, POSTED_DATE, ENROLLMENT_LOCATION FROM JOB ORDER BY JOB_ID")
        data = cursor.fetchall()
        connection.close()
        return data
    except Exception as e:
        print(f"Error occurred while retrieving data from database: {e}")
        return []
    