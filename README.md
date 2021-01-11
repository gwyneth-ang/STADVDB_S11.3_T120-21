# STADVDB-S11-3

 This repository contains source code for the site [Pelicula](http://pelicula-search.herokuapp.com/).  The SQL queries in the sourcecode is the optimized queries listed in the txt file "optimized" found in the Queries folder. This is site is made in partial fulfillment of the course STADVDB.


## To Run locally
Prerequisite: Node js and MySQL Server is installed 

1. Clone the repository
2. Add database locally (download from this [link](https://drive.google.com/file/d/1--CNRewTDe2aJKPzB2GmyevbPNaLwVbK/view?usp=sharing)) in MySQL Server
3. Add indexes to the local db
   ```
   CREATE INDEX idx_year ON Movies (year);

   CREATE INDEX idx_mix_category
   ON Title_principals (category, imdb_title_id);

   CREATE INDEX idx_name ON Names(name);

   CREATE INDEX idx_movie ON Movies(title);

   CREATE INDEX idx_language ON Movies (language);

   CREATE INDEX idx_metascore ON Movies (metascore);```
4. Add .env file to cloned folder containing:
      ```
      NODE_ENV=development
      HOST=localhost
      PORT=8000
      DB_HOST = localhost
      DB_USER = your_user
      DB_PASSWORD = your_password
      DB_DATABASE = imdb movies extensive db
      DB_PORT = 3306
 5. Run site locally by entering: ```npm install``` then ```node index.js``` to the command line
