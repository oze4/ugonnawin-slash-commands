// String/Text helper

'use strict'


module.exports = {
    replaceMultipleSpacesWithSingleSpace: (str) => {
        return str.replace(/ +(?= )/g,'');
    }  
}
