'use strict'

const validation = {
    isLooselyDefinedUrl (url) {
        // Verify we have a URL (this checks if we have periods and at least two characters at the end after 
        //     a period: eg: someWordWithAt.LeastTwoCharsAtE.nd). That would qualify as a URL.
        const looselyDefinedUrlRegex = RegExp(/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/g);
        return looselyDefinedUrlRegex.test(url);
    }
}

module.exports = validation;
