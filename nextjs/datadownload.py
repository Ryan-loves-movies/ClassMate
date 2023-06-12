import requests
import json
import pymysql

def validate_string(val):
    if val is not None:
        if isinstance(val, int):
            return str(val).encode('utf-8')
        else:
            return val

# Download data from API
r_main = requests.get('https://api.nusmods.com/v2/2021-2022/moduleList.json')
main_package_json = r_main.json()

# Connect to MySQL
con = pymysql.connect(host='localhost', user='root', passwd='Classmate123!', db='orbital')
cursor = con.cursor()

# Insert data into table
for item_main in main_package_json:
    # Extract values from item
    module_code = validate_string(item_main.get('moduleCode', None))
    module_title = validate_string(item_main.get('title', None))
    sem = validate_string(item_main.get('semesters', None))

    # Construct specific module API URL
    specific_api_url = f"https://api.nusmods.com/v2/2021-2022/modules/{module_code}.json"

    # Make request to specific module API
    r_specific = requests.get(specific_api_url)
    specific_module_json = r_specific.json()

    # Prepare SQL query
    query = '''
    INSERT INTO modules (
      module_code, module_title, sem, lect_num, lect_day, lect_startTime,
      lect_endTime, tut_num, tut_day, tut_startTime, tut_endTime,
      lab_num, lab_day, lab_startTime, lab_endTime
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    '''

    # Check the lessonType and assign values accordingly
    for timetables in specific_module_json['semesterData']:
        # Extract specific module information
        lect_num = None
        lect_day = None
        lect_startTime = None
        lect_endTime = None
        tutorials = []
        labs = []
        sem = timetables['semester']
        for item in timetables['timetable']:
            lesson_type = item['lessonType']
            class_no = validate_string(item.get('classNo', None))
            day = validate_string(item.get('day', None))
            start_time = validate_string(item.get('startTime', None))
            end_time = validate_string(item.get('endTime', None))

            if lesson_type == 'Lecture':
                lect_num = class_no
                lect_day = day
                lect_startTime = start_time
                lect_endTime = end_time
            elif lesson_type != 'Lecture' and lesson_type != 'Laboratory':
                tutorials.append({
                    'tut_num': class_no,
                    'tut_day': day,
                    'tut_startTime': start_time,
                    'tut_endTime': end_time
                })
            elif lesson_type == 'Laboratory':
                labs.append({
                    'lab_num': class_no,
                    'lab_day': day,
                    'lab_startTime': start_time,
                    'lab_endTime': end_time
                })
            # Execute the query with lecture values
            lecture_values = (
                module_code, module_title, sem, lect_num, lect_day, lect_startTime,
                lect_endTime, None, None, None, None, None, None, None, None
            )
            cursor.execute(query, lecture_values)

            # Insert tutorial values
            for tutorial in tutorials:
                tut_num = tutorial['tut_num']
                tut_day = tutorial['tut_day']
                tut_startTime = tutorial['tut_startTime']
                tut_endTime = tutorial['tut_endTime']
                
                tutorial_values = (
                    module_code, module_title, sem, None, None, None,
                    None, tut_num, tut_day, tut_startTime, tut_endTime,
                    None, None, None, None
                )
                cursor.execute(query, tutorial_values)

            # Insert laboratory values
            for lab in labs:
                lab_num = lab['lab_num']
                lab_day = lab['lab_day']
                lab_startTime = lab['lab_startTime']
                lab_endTime = lab['lab_endTime']

                lab_values = (
                    module_code, module_title, sem, None, None, None,
                    None, None, None, None, None,
                    lab_num, lab_day, lab_startTime, lab_endTime
                )
                cursor.execute(query, lab_values)

# Commit changes and close connection
con.commit()
con.close()