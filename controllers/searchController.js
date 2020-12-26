const searchController = {

    viewHomePage: (req, res) => res.render('home'),

    postSearchSecondQuery: (req, res) => {
        let secondquery = 
            `SELECT title, year, genre, director, metascore
             FROM movies
             WHERE metascore >= 81
             ORDER BY metascore DESC;`;

        db.query(secondquery, (err, result) => {
            return res.render('_partials/universally_acclaimed', { res: result }, function(err, partial){
                res.send(partial);
            });
        });
    },

    postSearchThirdQuery: (req, res) => {
        let thirdQuery1 =
            `SELECT T1.production_company, COUNT(T1.production_company) AS number_of_movies, FORMAT(AVG(T1.weighted_average_vote), 2) AS average_vote_of_movies
             FROM 
                ( SELECT m.imdb_title_id, m.production_company, r.weighted_average_vote
                  FROM   Movies m
                  JOIN   Ratings r
                  ON     m.imdb_title_id = r.imdb_title_id
                ) AS T1
             GROUP BY T1.production_company
             HAVING number_of_movies >= 200
             ORDER BY average_vote_of_movies DESC
             LIMIT 10;`;
        let thirdQuery2 =
            `SELECT production_company, title, year, genre, director, duration, MAX(weighted_average_vote) AS rating
             FROM Movies m
             JOIN Ratings r ON m.imdb_title_id = r.imdb_title_id
             WHERE production_company IN
                (SELECT production_company
                    FROM 
                       ( SELECT T1.production_company, COUNT(T1.production_company) AS number_of_movies, AVG(T1.weighted_average_vote) AS average_vote_of_movies
                         FROM 
                            ( SELECT m.imdb_title_id, m.production_company, r.weighted_average_vote
                              FROM Movies m
                              JOIN Ratings r
                              ON m.imdb_title_id = r.imdb_title_id) AS T1
                              GROUP BY T1.production_company
                              HAVING number_of_movies >= 200
                              ORDER BY average_vote_of_movies DESC
                              LIMIT 10
                            ) AS T2
                       )
             GROUP BY production_company
             ORDER BY rating DESC;`;

        db.query(thirdQuery1, (err, result1) => {
            if (err) throw err;

            db.query(thirdQuery2, (err, result2) => {
                if (err) throw err;
                return res.render('_partials/top10_production_companies_films', { topCompanies: result1, topCompanyFilms: result2 }, function(err, partial){
                    res.send(partial);
                });
            });
        });
    },

    postSearchFourthQuery: (req, res) => {
        const { searchInput } = req.body;

        let fourthQuery1 =
            `SELECT COUNT(*) AS count_films
             FROM Movies, Title_principals, Names
             WHERE Names.imdb_name_id = Title_principals.imdb_name_id
             AND Title_principals.imdb_title_id = Movies.imdb_title_id
             AND Names.name like "%${searchInput}%";`;
        let fourthQuery2 =
            `SELECT title, year, genre, director, duration
             FROM Movies, Title_principals, Names
             WHERE Names.imdb_name_id = Title_principals.imdb_name_id 
             AND Title_principals.imdb_title_id = Movies.imdb_title_id
             AND Names.name like "%${searchInput}%";`;

        db.query(fourthQuery1, (err, result1) => {
            if (err) throw err;

            db.query(fourthQuery2, (err, result2) => {
                if (err) throw err;
                return res.render('_partials/actor_films', { actorName: searchInput, countOfFilms: result1, actorFilms: result2 }, function(err, partial){
                    res.send(partial);
                });
            });
        });
    },

    postSearchFifthQuery: (req, res) => {
        const { searchInput } = req.body;  

        let fifthQueryHigh = 
            `SELECT DISTINCT T1.year, m1.title, m1.director, COALESCE(tp1.job,'None') AS job, T1.Ratings
             FROM            MOVIES m1, RATINGS r1, TITLE_PRINCIPALS tp1,
                ( SELECT     m2.year, MAX(r2.weighted_average_vote) AS 'Ratings'
                  FROM       MOVIES m2, RATINGS r2
                  WHERE      r2.imdb_title_id=m2.imdb_title_id
                  GROUP BY   m2.year
                ) T1
             WHERE (T1.year = m1.year 
                    AND T1.Ratings = r1.weighted_average_vote)
                    AND r1.imdb_title_id=m1.imdb_title_id
                    AND m1.imdb_title_id=tp1.imdb_title_id
                    AND tp1.category ="director"
                    AND T1.year LIKE "%${searchInput}%"
             ORDER BY year ASC;
            `;

        let fifthQueryLow = 
            `SELECT DISTINCT T1.year, m1.title, m1.director, COALESCE(tp1.job,'None') AS job, T1.Ratings
             FROM            MOVIES m1, RATINGS r1, TITLE_PRINCIPALS tp1,
                ( SELECT     m2.year, MIN(r2.weighted_average_vote) AS 'Ratings'
                  FROM       MOVIES m2, RATINGS r2
                  WHERE      r2.imdb_title_id=m2.imdb_title_id
                  GROUP BY   m2.year
                ) T1
             WHERE (T1.year = m1.year 
                    AND T1.Ratings = r1.weighted_average_vote)
                    AND r1.imdb_title_id=m1.imdb_title_id
                    AND m1.imdb_title_id=tp1.imdb_title_id
                    AND tp1.category ="director"
                    AND T1.year LIKE "%${searchInput}%"
             ORDER BY       year ASC;
            `;

        db.query(fifthQueryHigh, (err, highResult) => {
            if (err) throw err;

            db.query(fifthQueryLow, (err, lowResult) => {
                if (err) throw err;
                    if (highResult.length === 0 && lowResult.length === 0){
                        result = "None found: Please search again";
                        return res.render('_partials/none_found', { res: result }, function(err, partial){
                            res.send(partial);
                        });
                    }
                    return res.render('_partials/years_rating', { yearsHighRate: highResult, yearsLowRate: lowResult }, function(err, partial){
                        res.send(partial);
                    });
            });

        });

    },

    postSearchSixthQuery: (req, res) => {
        const { searchInput, page } = req.body;

        let countQuery =
            `SELECT COUNT(*) AS totalCount
             FROM   title_principals P, movies M, names N
             WHERE  N.imdb_name_id = P.imdb_name_id 
                    AND P.imdb_title_id = M.imdb_title_id
                    AND N.name LIKE "%${searchInput}%";
            `;

        /*Get total items*/
        db.query(countQuery,(err,count) => {
            if (err) throw err;

            // Display 100 items per page
            const perPage = 100, totalCount = count[0].totalCount;

            if (totalCount === 0) {
                result = "None found: Please search again";
                return res.render('_partials/none_found', { res: result }, function(err, partial){
                    res.send({
                        partial
                    });
                });
            }

            /*Query items*/
            let sixthQuery = 
                `SELECT N.name, M.title, IFNULL(P.job, 'None') AS 'Job', 
                        TRIM(TRAILING ']' FROM TRIM(LEADING '[' FROM (REPLACE(IFNULL(P.characters, 'none'), '"', '')))) AS 'Characters'
                    FROM   title_principals P, movies M, names N
                    WHERE  N.imdb_name_id = P.imdb_name_id 
                        AND P.imdb_title_id = M.imdb_title_id
                        AND N.name LIKE "%${searchInput}%"
                    LIMIT ${perPage}
                    OFFSET ${(page - 1) * perPage};
                `;

            db.query(sixthQuery,(err,result) => {
                console.log('secondhere');
                if (err) throw err;

                return res.render('_partials/character_job_actor', { characterJobActor: result }, function(err, partial){
                    res.send({ 
                        partial, 
                        totalCount
                    });
                });
            });
        });
    }



};

module.exports = searchController;