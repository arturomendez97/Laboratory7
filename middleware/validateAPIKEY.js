//API_KEY
//const API_KEY = '2abbf7c3-245b-404f-9473-ade729ed4653';
const {TOKEN} = require( './../config' );

//Middleware function
function validateAPIKEY( req, res, next ){
    console.log( "Inside the middleware." );
    //console.log( req.headers );

    //Get apikey
    let ApiKey = req.query.apiKey;

    console.log(API_KEY);

    if ( !ApiKey ){
        ApiKey = req.headers.authorization;
    }

    if ( !ApiKey ){
        ApiKey = req.headers['book-api-key'];
    }

    if ( !ApiKey ){
        res.statusMessage = "Unauthorized. You need to send the 'ApiKey'."
        return res.status ( 401 ).end();
    }

    if( ApiKey != `Bearer ${TOKEN}` && ApiKey != `${TOKEN}`)
    {
        res.statusMessage = "Unauthorized. ApiKey is incorrect."
        return res.status ( 401 ).end();
    }

    next();
}

module.exports = validateAPIKEY;