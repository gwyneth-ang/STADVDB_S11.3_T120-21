const searchController = {

    viewHomePage: (req, res) => res.render('home'),





    postDiceQuery: (req, res) => {
        const { countryInput, genreInput } = req.body;

        console.log(countryInput);
        console.log(genreInput);

        let diceQuery = `
            SELECT DISTINCT M.weighted_average_vote, D.year, T.title
            FROM F_MOVIE M, D_DATE D, D_TITLE T, D_COUNTRY C, D_GENRE G
            WHERE M.imdb_title_id = T.imdb_title_id
            AND M.date_id = D.date_id
            AND M.country_id = C.country_id
            AND M.genre_id = G.genre_id
            AND C.country LIKE '%${countryInput}%'
            AND G.genre LIKE '%${genreInput}%'
            ORDER BY M.weighted_average_vote DESC;
        `;
        
        db.query(diceQuery, (err, result) => {
            if (err) {
                let error = "Something went wrong! Please try again.";
                return res.render('_partials/error', { error }, function(err, partial){
                    res.send(partial);
                });
            }
            
            if (result.length === 0){
                let none = "None found: Please search again";
                return res.render('_partials/none_found', { res: none }, function(err, partial){
                    res.send(partial);
                });
            }

            console.log(result);

            return res.render('_partials/dice_result', { diceResults: result }, function(err, partial){
                res.send(partial);
            });
        });
    },
    // postSearchFirstQuery: (req, res) => {
    //     const { page } = req.body;

    //     let countQuery =
    //         `SELECT COUNT(*) AS totalCount
    //          FROM Movies
    //          WHERE Language = "English"
    //          ORDER BY year DESC;`;

    //     db.query(countQuery, (err, count) => {
    //         if (err) {
    //             let error = "Something went wrong! Please try again.";
    //             return res.render('_partials/error', { error }, function(err, partial){
    //                 res.send({
    //                     partial
    //                 });
    //             });
    //         }

    //         // Display 100 items per page
    //         const perPage = 100, totalCount = count[0].totalCount;

    //         let firstquery =
    //             `SELECT title, year, genre, director, duration
    //             FROM Movies
    //             WHERE Language = "English"
    //             ORDER BY year DESC
    //             LIMIT    ${perPage}
    //             OFFSET ${(page - 1) * perPage}`;

    //         db.query(firstquery, (err, result) => {
    //             if (err) {
    //                 let error = "Something went wrong! Please try again.";
    //                 return res.render('_partials/error', { error }, function(err, partial){
    //                     res.send({
    //                         partial
    //                     });
    //                 });
    //             }

    //             return res.render('_partials/english_films', { movies: result }, function(err, partial) {
    //                 res.send({
    //                     partial,
    //                     totalCount
    //                 });
    //             });
    //         });
    //     });
    // },

    // postSearchSecondQuery: (req, res) => {
    //     let secondquery =
    //         `SELECT title, year, genre, director, metascore
    //          FROM Movies
    //          WHERE metascore >= 81
    //          ORDER BY metascore DESC;`;

    //     db.query(secondquery, (err, result) => {
    //         if (err) {
    //             let error = "Something went wrong! Please try again.";
    //             return res.render('_partials/error', { error }, function(err, partial){
    //                 res.send(partial);
    //             });
    //         }

    //         return res.render('_partials/universally_acclaimed', { res: result }, function(err, partial) {
    //             res.send(partial);
    //         });
    //     });
    // },

    // postSearchThirdQuery: (req, res) => {
    //     let thirdQuery1 =
    //         `SELECT production_company, COUNT(production_company) AS number_of_movies, FORMAT(AVG(weighted_average_vote), 2) AS average_vote_of_movies
    //          FROM Movies m
    //          JOIN Ratings r
    //          ON m.imdb_title_id = r.imdb_title_id
    //          GROUP BY production_company
    //          HAVING number_of_movies >= 200
    //          ORDER BY average_vote_of_movies DESC
    //          LIMIT 10;`;

    //     let thirdQuery2 =
    //         `SELECT production_company, title, year, genre, director, duration, MAX(weighted_average_vote) AS rating
    //          FROM Movies m
    //          JOIN Ratings r 
    //          ON m.imdb_title_id = r.imdb_title_id
    //          WHERE production_company IN
    //             (SELECT production_company
    //              FROM 
    //                 (SELECT production_company, COUNT(production_company) AS number_of_movies, FORMAT(AVG(weighted_average_vote), 2) AS average_vote_of_movies
    //                  FROM Movies m
    //                  JOIN Ratings r
    //                  ON m.imdb_title_id = r.imdb_title_id
    //                  GROUP BY production_company
    //                  HAVING number_of_movies >= 200
    //                  ORDER BY average_vote_of_movies DESC
    //                  LIMIT 10) AS T2)
    //          GROUP BY production_company
    //          ORDER BY rating DESC;`;

    //     db.query(thirdQuery1, (err, result1) => {
    //         if (err) {
    //             let error = "Something went wrong! Please try again.";
    //             return res.render('_partials/error', { error }, function(err, partial){
    //                 res.send(partial);
    //             });
    //         }

    //         db.query(thirdQuery2, (err, result2) => {
    //             if (err) {
    //                 let error = "Something went wrong! Please try again.";
    //                 return res.render('_partials/error', { error }, function(err, partial){
    //                     res.send(partial);
    //                 });
    //             }
                
    //             return res.render('_partials/top10_production_companies_films', { topCompanies: result1, topCompanyFilms: result2 }, function(err, partial) {
    //                 res.send(partial);
    //             });
    //         });
    //     });
    // },

    // postSearchFourthQuery: (req, res) => {
    //     const { searchInput } = req.body;

    //     let fourthQuery1 =
    //         `SELECT COUNT(*) AS count_films
    //          FROM Movies, Title_principals, Names
    //          WHERE Names.imdb_name_id = Title_principals.imdb_name_id
    //          AND Title_principals.imdb_title_id = Movies.imdb_title_id
    //          AND (Title_principals.category = "actor" OR Title_principals.category = "actress")
    //          AND Names.name like "%${searchInput}%";`;

    //     let fourthQuery2 =
    //         `SELECT title, year, genre, director, duration
    //          FROM Movies, Title_principals, Names
    //          WHERE Names.imdb_name_id = Title_principals.imdb_name_id 
    //          AND Title_principals.imdb_title_id = Movies.imdb_title_id
    //          AND Title_principals.category IN ("actor", "actress")
    //          AND Names.name like "%${searchInput}%";`;

    //     db.query(fourthQuery1, (err, result1) => {
    //         if (err) {
    //             let error = "Something went wrong! Please try again.";
    //             return res.render('_partials/error', { error }, function(err, partial){
    //                 res.send(partial);
    //             });
    //         }

    //         db.query(fourthQuery2, (err, result2) => {
    //             if (err) {
    //                 let error = "Something went wrong! Please try again.";
    //                 return res.render('_partials/error', { error }, function(err, partial){
    //                     res.send(partial);
    //                 });
    //             }

    //             if (result2.length === 0){
    //                 let none = "None found: Please search again";
    //                 return res.render('_partials/none_found', { res: none }, function(err, partial){
    //                     res.send(partial);
    //                 });
    //             }

    //             return res.render('_partials/actor_films', { actorName: searchInput, countOfFilms: result1, actorFilms: result2 }, function(err, partial){
    //                 res.send(partial);
    //             });
    //         });
    //     });
    // },

    // postSearchFifthQuery: (req, res) => {
    //     const { searchInput } = req.body;

    //     let fifthQueryHigh =
    //         `SELECT DISTINCT T1.year, m1.title, m1.director, COALESCE(tp1.job,'None') AS job, T1.Ratings
    //         FROM             (SELECT    m2.year, MAX(r2.weighted_average_vote) AS 'Ratings'
    //                           FROM      Movies m2, Ratings r2
    //                           WHERE     r2.imdb_title_id=m2.imdb_title_id
    //                           GROUP BY m2.year) T1, Movies m1, Title_principals tp1, Ratings r1
    //         WHERE  (T1.year = m1.year 
    //                 AND T1.Ratings = r1.weighted_average_vote)
    //                 AND r1.imdb_title_id=m1.imdb_title_id
    //                 AND m1.imdb_title_id=tp1.imdb_title_id
    //                 AND tp1.category ="director"
    //                 AND T1.year LIKE "%${searchInput}%"
    //         ORDER BY          T1.year ASC; 
    //         `;

    //     let fifthQueryLow =
    //         `SELECT DISTINCT T1.year, m1.title, m1.director, COALESCE(tp1.job,'None') AS job, T1.Ratings
    //         FROM           (SELECT    m2.year, MIN(r2.weighted_average_vote) AS 'Ratings'
    //                         FROM      Movies m2, Ratings r2
    //                         WHERE     r2.imdb_title_id=m2.imdb_title_id
    //                         GROUP BY m2.year) T1, Movies m1, Title_principals tp1, Ratings r1
    //         WHERE  (T1.year = m1.year 
    //                 AND T1.Ratings = r1.weighted_average_vote)
    //                 AND r1.imdb_title_id=m1.imdb_title_id
    //                 AND m1.imdb_title_id=tp1.imdb_title_id
    //                 AND tp1.category ="director"
    //                 AND T1.year LIKE "%${searchInput}%"
    //         ORDER BY          T1.year ASC; 
    //         `;

    //     db.query(fifthQueryHigh, (err, highResult) => {
    //         if (err) {
    //             let error = "Something went wrong! Please try again.";
    //             return res.render('_partials/error', { error }, function(err, partial){
    //                 res.send(partial);
    //             });
    //         }

    //         db.query(fifthQueryLow, (err, lowResult) => {
    //             if (err) {
    //                 let error = "Something went wrong! Please try again.";
    //                 return res.render('_partials/error', { error }, function(err, partial){
    //                     res.send(partial);
    //                 });
    //             }

    //             if (highResult.length === 0 && lowResult.length === 0){
    //                 let none = "None found: Please search again";
    //                 return res.render('_partials/none_found', { res: none }, function(err, partial){
    //                     res.send(partial);
    //                 });
    //             }

    //             return res.render('_partials/years_rating', { yearsHighRate: highResult, yearsLowRate: lowResult }, function(err, partial){
    //                 res.send(partial);
    //             });
    //         });

    //     });

    // },

    // postSearchSixthQuery: (req, res) => {
    //     const { searchInput, page } = req.body;

    //     let countQuery =
    //         `SELECT COUNT(*) AS totalCount
    //          FROM (SELECT AVG(P1.ordering) AS 'Ordering', N1.imdb_name_id
    //                FROM   Title_principals P1 
    //                JOIN   Movies M1 ON P1.imdb_title_id = M1.imdb_title_id
    //                JOIN   Names N1 ON N1.imdb_name_id = P1.imdb_name_id 
    //                WHERE N1.name LIKE "%${searchInput}%"
    //                GROUP BY N1.name) T1
    //          JOIN  Names N ON T1.imdb_name_id = N.imdb_name_id
    //          JOIN  Title_principals P ON N.imdb_name_id = P.imdb_name_id 
    //          JOIN  Movies M ON P.imdb_title_id = M.imdb_title_id;
    //         `;

    //     /*Get total items*/
    //     db.query(countQuery, (err, count) => {
    //         if (err) {
    //             let error = "Something went wrong! Please try again.";
    //             return res.render('_partials/error', { error }, function(err, partial){
    //                 res.send({
    //                     partial
    //                 });
    //             });
    //         }

    //         // Display 100 items per page
    //         const perPage = 100, totalCount = count[0].totalCount;
            
    //         if (totalCount === 0) {
    //             result = "None found: Please search again";
    //             return res.render('_partials/none_found', { res: result }, function(err, partial) {
    //                 res.send({
    //                     partial
    //                 });
    //             });
    //         }

    //         /*Query items*/
    //         let sixthQuery = 
    //             `SELECT T1.Ordering, N.name, M.title, COALESCE(P.category,'None') AS 'Job', TRIM(TRAILING ']' FROM TRIM(LEADING '[' 
    //                     FROM(REPLACE(COALESCE(P.characters,'None'), '"', '')))) AS 'Characters'
    //              FROM (SELECT AVG(P1.ordering) AS 'Ordering', N1.imdb_name_id
    //              FROM   Title_principals P1 
    //              JOIN   Movies M1 ON P1.imdb_title_id = M1.imdb_title_id
    //              JOIN   Names N1 ON N1.imdb_name_id = P1.imdb_name_id 
    //              WHERE N1.name LIKE "%${searchInput}%"
    //              GROUP BY N1.name) T1
    //              JOIN  Names N ON T1.imdb_name_id = N.imdb_name_id
    //              JOIN  Title_principals P ON N.imdb_name_id = P.imdb_name_id 
    //              JOIN  Movies M ON P.imdb_title_id = M.imdb_title_id
    //              LIMIT ${perPage}
    //              OFFSET ${(page - 1) * perPage};
    //             `;

    //         db.query(sixthQuery,(err,result) => {
    //             if (err) {
    //                 let error = "Something went wrong! Please try again.";
    //                 return res.render('_partials/error', { error }, function(err, partial){
    //                     res.send({
    //                         partial
    //                     });
    //                 });
    //             }

    //             return res.render('_partials/character_job_actor', { characterJobActor: result }, function(err, partial) {
    //                 res.send({
    //                     partial,
    //                     totalCount
    //                 });
    //             });
    //         });
    //     });
    // },

    // postSearchSeventhQuery: (req, res) => {
    //     const { searchInput } = req.body;
    //     const name = req.body.searchInput;

    //     let seventhquery =
    //         `SELECT name, year, b.best_year_rating, title,  max(weighted_average_vote) as movie_rating, job, characters
    //         FROM Names n , Title_principals t, Movies m, Ratings r, 
    //             (SELECT a.name as best_name, a.year as best_year, 
    //         max(year_rating) as best_year_rating
    //             FROM ( SELECT name, year, avg(weighted_average_vote) 
    //         as year_rating
    //                     FROM Names n , Title_principals t, Movies m, Ratings r
    //                     WHERE n.imdb_name_id = t.imdb_name_id 
    //                         AND t.imdb_title_id = m.imdb_title_id 
    //                         AND m.imdb_title_id = r.imdb_title_id
    //                         AND name LIKE "%${searchInput}%"
    //                     GROUP BY name, year
    //                     ORDER BY name) a
    //             GROUP BY a.name
    //             ORDER BY a.name)b
    //         WHERE n.imdb_name_id = t.imdb_name_id 
    //             AND t.imdb_title_id = m.imdb_title_id 
    //         AND m.imdb_title_id = r.imdb_title_id
    //                 AND name = best_name 
    //                 AND year = best_year
    //         GROUP BY name
    //         ORDER BY name;`;

    //     db.query(seventhquery, (err, result) => {
    //         if (err) {
    //             let error = "Something went wrong! Please try again.";
    //             return res.render('_partials/error', { error }, function(err, partial){
    //                 res.send(partial);
    //             });
    //         }
            
    //         if (result.length === 0){
    //             let none = "None found: Please search again";
    //             return res.render('_partials/none_found', { res: none }, function(err, partial){
    //                 res.send(partial);
    //             });
    //         }

    //         return res.render('_partials/best_year', { res: result, search: name}, function(err, partial){
    //             res.send(partial);
    //         });
    //     });
    // },

    // postActorNamesQuery: (req, res) => {
    //     const { searchInput } = req.body;

    //     let query =
    //         `SELECT name
    //          FROM Names
    //          WHERE name like "%${searchInput}%"
    //          LIMIT 5;`;

    //     db.query(query, (err, result) => {
    //         return res.render('_partials/actors_datalist', { actorsList: result }, function(err, partial) {
    //             res.send(partial);
    //         });
    //     });
    // },

};

module.exports = searchController;