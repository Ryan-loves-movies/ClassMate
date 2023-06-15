import pymysql
import bcrypt

# Function to store user data in the database
def store_user_data(username, email, password):
    # Connect to MySQL
    con = pymysql.connect(host='localhost', user='root', passwd='Classmate123!', db='orbital')
    cursor = con.cursor()

    try:
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Prepare SQL query
        query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"

        # Execute the query with user data
        values = (username, email, hashed_password)
        cursor.execute(query, values)

        # Commit changes to the database
        con.commit()

        # Print a success message
        print("User data stored successfully!")

    except Exception as e:
        # Handle any errors that occur during the process
        print("Error storing user data:", str(e))

    finally:
        # Close the database connection
        con.close()

# Example usage: assuming you have extracted the user data from the login form
username = "example_user"
email = "example@gmail.com"
password = "example_password"

# Store the user data in the database
store_user_data(username, email, password)
