//API_KEY
const API_KEY = "2abbf7c3-245b-404f-9473-ade729ed4653";

//Middleware function
function validateAPIKEY( req, res, next ){
    console.log( "Inside the middleware." );
    console.log( req.headers );

    //Get apikey from all possible locations
    let Api_Key_Query = req.query.apiKey;
    let Api_Key_Authorization = req.headers.authorization;
    let Api_Key_Header = req.headers['book-api-key'];


    if (Api_Key_Query == API_KEY){
        next();
    }

    if (Api_Key_Authorization == `Bearer ${API_KEY}`){
        next();
    }

    if (Api_Key_Header == API_KEY){
        next();
    }

    if( !Api_Key_Query && !Api_Key_Authorization && !Api_Key_Header)
    {
        res.statusMessage = "Unauthorized. You need to send the 'ApiKey'."
        return res.status ( 401 ).end();
    }

    res.statusMessage = "Unauthorized. ApiKey is incorrect."
    return res.status ( 401 ).end();
}

module.exports = validateAPIKEY;