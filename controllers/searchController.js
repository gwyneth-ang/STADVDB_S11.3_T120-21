const searchController = {

    viewHomePage: (req, res) => res.render('home'),

    postSearchFifthQuery: (req, res) => {
        const { searchInput } = req.body;     
        console.log(searchInput);

        let fifthQuery = {
            text: `
                SELECT DISTINCT T1.year, m1.title, m1.director, tp1.job, T1.'Ratings'
                FROM MOVIES m1, RATINGS r1, TITLE_PRINCIPALS tp1,
                    ( SELECT m2.year, 
                      MAX(r2.weighted_average_vote) AS 'Ratings'
                      FROM MOVIES m2, RATINGS r2
                      WHERE r2.imdb_title_id=m2.imdb_title_id
                      GROUP BY m2.year
                    ) T1
                WHERE (T1.year = m1.year 
                      AND T1.'Ratings' = r1.weighted_average_vote)
                      AND r1.imdb_title_id=m1.imdb_title_id
                      AND m1.imdb_title_id=tp1.imdb_title_id
                      AND tp1.category ="director"
                      AND T1.year LIKE "%$1%";
                ORDER BY year ASC;
            `,
            values: [ searchInput ]
        };

        db.query(fifthQuery, (err, result) => {
            return res.render('home', {
                
            })
        });
    }



};

module.exports = searchController;