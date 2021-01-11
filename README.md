# STADVDB-S11-3

 This repository contains source code for the site [Pelicula](http://pelicula-search.herokuapp.com/).  This is site is made in partial fulfillment of the course STADVDB.


## To Run locally
Prerequisite:
1. Clone the repository
2. Add database locally (download from this [link](https://drive.google.com/file/d/1--CNRewTDe2aJKPzB2GmyevbPNaLwVbK/view?usp=sharing)) in MySQL Server
3. Add .env file to cloned folder containing 
      ```
      NODE_ENV=development
      HOST=localhost
      PORT=8000
      DB_HOST = localhost
      DB_USER = your_user
      DB_PASSWORD = your_password
      DB_DATABASE = imdb movies extensive db
      DB_PORT = 3306
 4. Run site locally by entering: ```npm install``` then ```node index.js``` to the command line
