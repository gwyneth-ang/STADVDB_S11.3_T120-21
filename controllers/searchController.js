// const Pagination = require('../modules/pagination');

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
        const { searchInput } = req.body;

        // let countQuery =
        //     `SELECT COUNT(*) AS totalCount
        //      FROM   title_principals P, movies M, names N
        //      WHERE  N.imdb_name_id = P.imdb_name_id 
        //             AND P.imdb_title_id = M.imdb_title_id
        //             AND N.name LIKE "%${searchInput}%";
        //     `;

        //     console.log(curPage);
            
        //     // Get current page from url (request parameter)
        //     let page_id = parseInt(curPage),
        //         currentPage = page_id > 0 ? page_id : currentPage,
    
        //         //Change pageUri to your page url without the 'page' query string 
        //         pageUri = '/sixthQuery/';

        //     /*Get total items*/
        //     db.query(countQuery,(err,count) => {
        //         if (err) throw err;
    
        //         // Display 50 items per page
        //         const perPage = 10,
        //             totalCount = count[0].totalCount;

        //         console.log(totalCount);

        //         if (totalCount === 0) {
        //             result = "None found: Please search again";
        //             return res.render('_partials/none_found', { res: result }, function(err, partial){
        //                 res.send(partial);
        //             });
        //         }
    
        //         // Instantiate Pagination class
        //         const Paginate = new Pagination(totalCount,currentPage,pageUri,perPage);
    
        //         /*Query items*/
        //         let sixthQuery = 
        //             `SELECT N.name, M.title, IFNULL(P.job, 'None') AS 'Job', IFNULL(P.characters, 'None') AS 'Characters'
        //              FROM   title_principals P, movies M, names N
        //              WHERE  N.imdb_name_id = P.imdb_name_id 
        //                     AND P.imdb_title_id = M.imdb_title_id
        //                     AND N.name LIKE "%${searchInput}%"
        //              LIMIT ${Paginate.perPage}
        //              OFFSET ${Paginate.offset};
        //             `;

        //         db.query(sixthQuery,(err,result) => {
        //             console.log('secondhere');
        //             if (err) throw err;

        //             return res.render('_partials/character_job_actor', { characterJobActor: result, pages: Paginate.links() }, function(err, partial){
        //                 res.send(partial);
        //             });
        //         });
        //     });

        let sixthQuery = 
            `SELECT N.name, M.title, IFNULL(P.job, 'None') AS 'Job', IFNULL(P.characters, 'None') AS 'Characters'
             FROM   title_principals P, movies M, names N
             WHERE  N.imdb_name_id = P.imdb_name_id 
                    AND P.imdb_title_id = M.imdb_title_id
                    AND N.name LIKE "%${searchInput}%";
            `;

        db.query(sixthQuery, (err, result) => {
            if (err) throw err;

            if (result.length === 0){
                result = "None found: Please search again";
                return res.render('_partials/none_found', { res: result }, function(err, partial){
                    res.send(partial);
                });
            }
            return res.render('_partials/character_job_actor', { characterJobActor: result }, function(err, partial){
                res.send(partial);
            });
        });

            
    }



};

module.exports = searchController;