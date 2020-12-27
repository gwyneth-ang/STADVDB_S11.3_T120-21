const { SafeString } = require('hbs');
let name, ordering, firstTime = 0;

const hbsHelpers = {
    printOnceNameAndAve: (hbsName, hbsOrdering) => {
        let hbs = '';

        if (firstTime === 0) {
            name = hbsName;
            ordering = hbsOrdering;
            firstTime = 1;
            hbs = `
                <div class="container header-page2">
                    <div class="centered">
                        <h3><u>${hbsName}</u> has an on average <u>${hbsOrdering}</u> for order of importance in the movies</h3>
                    </div>
                </div>
            `;
        } else if (hbsName !== name || hbsOrdering !== ordering) {
            name = hbsName;
            ordering = hbsOrdering;
            hbs = `
            <div class="container header-page2">
                <div class="centered">
                    <h3><u>${hbsName}</u> has an on average <u>${hbsOrdering}</u> for order of importance in the movies</h3>
                </div>
            </div>
        `; 
        }

        return new SafeString(hbs);
    }
};

module.exports = hbsHelpers;