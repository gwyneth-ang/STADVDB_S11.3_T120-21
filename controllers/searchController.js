const searchController = {

    viewHomePage: (req, res) => res.render('home'),

    postRollUpQuery: (req, res) => {
        // page is intially 1 (at line 126 of checkQuery.js and with offset at line 261 of checkQuery.js)
        const { searchInput, page } = req.body;     

        // count query used to count the total number of rows
        let countQuery =
            `SELECT COUNT(*) AS totalCount
            FROM(SELECT D.year, C.country, G.genre,
            AVG(M.weighted_average_vote) as AverageScore
            FROM F_MOVIE as M, D_GENRE as G, D_DATE as D, D_COUNTRY as C
            WHERE D.year >= '${searchInput}' 
            AND M.genre_id = G.genre_id 
            AND M.date_id = D.date_id
            AND M.country_id = C.country_id
            GROUP BY D.year, C.country, G.genre with ROLLUP) a;`;

        db.query(countQuery, (err, count) => {
            if (err) {
                let error = "Something went wrong! Please try again.";
                return res.render('_partials/error', { error }, function(err, partial){
                    res.send({
                        partial
                    });
                });
            }

            // Display 100 items per page
            const perPage = 100, totalCount = count[0].totalCount;

            console.log(totalCount);

            // modify the query to add limit (how many tuples) and offset (how many will be skipped)
            let rollupquery =
            `SELECT D.year, C.country, G.genre,
            AVG(M.weighted_average_vote) as AverageScore
            FROM F_MOVIE as M, D_GENRE as G, D_DATE as D, D_COUNTRY as C
            WHERE D.year >= '${searchInput}'
            AND M.genre_id = G.genre_id 
            AND M.date_id = D.date_id 
            AND M.country_id = C.country_id
            GROUP BY D.year, C.country, G.genre with ROLLUP
            LIMIT    ${perPage}
            OFFSET    ${(page - 1) * perPage};`;

            db.query(rollupquery, (err, result) => {
                if (err) {
                    let error = "Something went wrong! Please try again.";
                    return res.render('_partials/error', { error }, function(err, partial) {
                        res.send(partial);
                    });
                }

                if (result.length === 0) {
                    let none = "None found: Please search again";
                    return res.render('_partials/none_found', { res: none }, function(err, partial) {
                        res.send({partial: partial});
                    });
                }

                return res.render('_partials/roll_up_results', { rollResult: result, year : searchInput}, function(err, partial) {
                    res.send({
                        partial,
                        totalCount
                    });
                });
            });
        });
    },

    postDrillDownQuery: (req, res) => {
        // page is intially 1 (at line 126 of checkQuery.js and with offset at line 261 of checkQuery.js)
        const { searchInput, page } = req.body;

        // count query used to count the total number of rows
        let countQuery =
            `SELECT COUNT(*) AS totalCount FROM 
            (
                SELECT YEAR(D.date_published) year, QUARTER(D.date_published) quarter, G.genre, COUNT(G.genre) number_of_movies
                FROM F_MOVIE M, D_DATE D, D_GENRE G
                WHERE M.genre_id = G.genre_id
                AND M.date_id = D.date_id
                AND YEAR(D.date_published) = '${searchInput}'
                AND QUARTER(D.date_published)IS NOT NULL 
                GROUP BY YEAR(D.date_published), QUARTER(D.date_published), G.genre
                ORDER BY YEAR(D.date_published), QUARTER(D.date_published), G.genre
            ) T1`;

        db.query(countQuery, (err, count) => {
            if (err) {
                console.log(err);
                let error = "Something went wrong! Please try again.";
                return res.render('_partials/error', { error }, function(err, partial){
                    res.send({
                        partial
                    });
                });
            }

            // Display 100 items per page
            const perPage = 100, totalCount = count[0].totalCount;

            // modify the query to add limit (how many tuples) and offset (how many will be skipped)
            let drillDownQuery =
                `
                SELECT YEAR(D.date_published) year, QUARTER(D.date_published) quarter, G.genre, COUNT(G.genre) number_of_movies
                FROM F_MOVIE M, D_DATE D, D_GENRE G
                WHERE M.genre_id = G.genre_id
                AND M.date_id = D.date_id
                AND YEAR(D.date_published) = '${searchInput}'
                AND QUARTER(D.date_published) IS NOT NULL 
                GROUP BY YEAR(D.date_published), QUARTER(D.date_published), G.genre
                ORDER BY YEAR(D.date_published), QUARTER(D.date_published), G.genre
                LIMIT    ${perPage}
                OFFSET    ${(page - 1) * perPage};`;

            db.query(drillDownQuery, (err, result) => {
                console.log(err);
                if (err) {
                    let error = "Something went wrong! Please try again.";
                    return res.render('_partials/error', { error }, function(err, partial) {
                        res.send(partial);
                    });
                }

                if (result.length === 0) {
                    let none = "None found: Please search again";
                    return res.render('_partials/none_found', { res: none }, function(err, partial) {
                        res.send({partial: partial});
                    });
                }

                return res.render('_partials/drill_down_results', { drillDownResult: result, year: searchInput }, function(err, partial) {
                    res.send({
                        partial,
                        totalCount
                    });
                });
            });
        });
    },

    postDiceQuery: (req, res) => {
        const { countryInput, genreInput } = req.body;

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
                return res.render('_partials/none_found', { res: none }, function(err, partial) {
                    res.send(partial);
                });
            }

            return res.render('_partials/dice_results', { diceResults: result, country: countryInput, genre: genreInput }, function(err, partial){
                res.send(partial);
            });

         });
    },

    postSliceQuery: (req, res) => {
        //const { page } = req.body;
        const { searchInput } = req.body;
        //const name = req.body.searchInput;

        let seventhquery =
            `SELECT T.title, G.genre, D.year
            FROM F_MOVIE M, D_DATE D, D_TITLE T, D_COUNTRY C, D_GENRE G
            WHERE M.genre_id = G.genre_id
            AND M.date_id = D.date_id
            AND M.imdb_title_id = T.imdb_title_id
            AND M.country_id = C.country_id
            AND C.country = '${searchInput}'
            GROUP BY G.genre, D.year
            ORDER BY G.genre, D.year;`;

        db.query(seventhquery, (err, result) => {
            if (err) {
                let error = "Something went wrong! Please try again.";
                return res.render('_partials/error', { error }, function(err, partial) {
                    res.send(partial);
                });
            }

            if (result.length === 0) {
                let none = "None found: Please search again";
                return res.render('_partials/none_found', { res: none }, function(err, partial) {
                    res.send(partial);
                });
            }

            return res.render('_partials/slice_results', { slice_results: result, country: searchInput }, function(err, partial) {
                res.send(partial);
            });
        });
    },

    postCountriesQuery: (req, res) => {
        let query =
            `SELECT country
             FROM D_COUNTRY;`;

        db.query(query, (err, result) => {
            return res.render('_partials/countries_datalist', { countriesList: result }, function(err, partial) {
                res.send(partial);
            });
        });
    },

    postGenreQuery: (req, res) => {
        let query =
            `SELECT genre
             FROM D_GENRE;`;

        db.query(query, (err, result) => {
            return res.render('_partials/genre_datalist', { genreList: result }, function(err, partial) {
                res.send(partial);
            });
        });
    }
};

module.exports = searchController;