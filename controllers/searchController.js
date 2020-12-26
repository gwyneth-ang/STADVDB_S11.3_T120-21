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