# Made by Ang, Gwyneth and Tan, Ivy

# To use:
# Prerequisite: have python and pip installed and the db and data warehouse
# 1. Install petl by using the following in the CLI:pip install petl 
# 2. Install pymysql by using in the CLI: pip install pymysql
# 3. Change db and dw details in input and output db
# 4. Run in CLI by using: python etl.py

import petl as etl
import pymysql

# input and output db
data_in = pymysql.connect(host='localhost', user='root', password='password', database='imdb movies extensive db')
in_cursor = data_in.cursor()
in_cursor.execute('SET SQL_MODE=ANSI_QUOTES')
data_out = pymysql.connect(host='localhost', user='root', password='password', database='imdb_datawarehouse')
out_cursor = data_out.cursor()
out_cursor.execute('SET SQL_MODE=ANSI_QUOTES')

# EXTRACT
n_table = etl.fromdb(data_in, 'SELECT * FROM Names')
m_table = etl.fromdb(data_in, 'SELECT * FROM Movies')
r_table = etl.fromdb(data_in, 'SELECT * FROM Ratings')
tp_table = etl.fromdb(data_in, 'SELECT * FROM Title_principals')
print("Extract DONE")

# TRANSFORM
# movie personnel
d_movie_personnel = etl.cut(n_table, 'imdb_name_id', 'name', 'birth_name')

# title
d_title = etl.cut(m_table, 'imdb_title_id', 'title', 'original_title')

# genre
d_genre = etl.distinct(etl.cut(m_table, 'genre'))
rows = etl.nrows(d_genre)
generated =[] 
# print(rows)
for i in range(rows):
    uuid = out_cursor.execute('SELECT UUID();')
    uuid = out_cursor.fetchone()[0]
    generated.append(uuid)
d_genre = etl.addcolumn(d_genre, 'genre_id', generated)

# date
d_date = etl.distinct(etl.cut(m_table, 'year', 'date_published'))
rows = etl.nrows(d_date)
generated =[]
for i in range(rows):
    uuid = out_cursor.execute('SELECT UUID();')
    uuid = out_cursor.fetchone()[0]
    generated.append(uuid)
d_date = etl.addcolumn(d_date, 'date_id', generated)

# country 
d_country = etl.distinct(etl.cut(m_table, 'country'))
rows = etl.nrows(d_country)
generated =[]
for i in range(rows):
    uuid = out_cursor.execute('SELECT UUID();')
    uuid = out_cursor.fetchone()[0]
    generated.append(uuid)
d_country = etl.addcolumn(d_country, 'country_id', generated)

# movie (fact table)
f_movie = etl.cut(m_table, 'imdb_title_id', 'year', 'date_published', 'genre', 'country')
# foreign key for imdb names id (movie personnel)
f_movie = etl.join(f_movie, tp_table, key='imdb_title_id')
# get only the necessary ones
f_movie = etl.cut(f_movie, 'imdb_title_id', 'imdb_name_id', 'year', 'date_published', 'genre', 'country')
# foreign key for genre id (genre)
f_movie = etl.join(f_movie, d_genre, key='genre')
# get only the necessary ones
f_movie = etl.cut(f_movie, 'imdb_title_id', 'imdb_name_id', 'year', 'date_published', 'genre_id', 'country')
# foreign key for country id (country)
f_movie = etl.join(f_movie, d_date, key=['year', 'date_published'])
# get only the necessary ones
f_movie = etl.cut(f_movie, 'imdb_title_id', 'imdb_name_id', 'date_id', 'genre_id', 'country')
# foreign key for country id (country)
f_movie = etl.join(f_movie, d_country, key='country')
# get only the necessary ones
f_movie = etl.cut(f_movie, 'imdb_title_id', 'imdb_name_id', 'date_id', 'genre_id', 'country_id')
# get the four ratings
r_table = etl.cut(r_table, 'imdb_title_id', 'total_votes', 'weighted_average_vote', 'mean_vote', 'median_vote')
f_movie = etl.join(f_movie, r_table, key='imdb_title_id')

print("Transform DONE")

# LOAD
print('Loading...')

# movie personnel
c = etl.clock(d_movie_personnel)
p = etl.progress(c, 100000)
etl.todb(p, out_cursor, 'D_MOVIE_PERSONNEL')
print("d_movie_personnel loaded!")

# title
c = etl.clock(d_title)
p = etl.progress(c, 100000)
etl.todb(p, out_cursor, 'D_TITLE')
print("d_title loaded!")

# genre
c = etl.clock(d_genre)
p = etl.progress(c, 100000)
etl.todb(p, out_cursor, 'D_GENRE')
print("d_genre loaded!")

# country
c = etl.clock(d_country)
p = etl.progress(c, 100000)
etl.todb(p, out_cursor, 'D_COUNTRY')
print("d_country loaded!")

# date
c = etl.clock(d_date)
p = etl.progress(c, 100000)
etl.todb(p, out_cursor, 'D_DATE')
print("d_date loaded!")

# movie
c = etl.clock(f_movie)
p = etl.progress(c, 100000)
etl.todb(p, out_cursor, 'F_MOVIE')
print("f_movie loaded!")

print("Load DONE")