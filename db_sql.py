import pymysql

# Azure database server details
server = 'googlemeet.database.windows.net'
username = '<username>@googlemeet'
password = '<password>'
database = '<database>'

# Establish a connection to the database
conn = pymysql.connect(
    host=server,
    user=username,
    password=password,
    database=database,
    cursorclass=pymysql.cursors.DictCursor
)
