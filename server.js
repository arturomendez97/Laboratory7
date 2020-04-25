//Hold the function that express has in the const express
const express = require( 'express' );
//Importn body parser for post
const bodyParser = require( 'body-parser' );
//Middleware unction to get body of request and parse it to a json object.
const jsonParser = bodyParser.json();
//Import morgan for logging
const morgan = require( 'morgan' );
//Executing express function
//app now has a lot of methods and properties for us to use.
const app = express();
//Import uuid
const uuid = require( 'uuid');
//Import middleware function validateAPIKEY
const validateAPIKEY = require( './middleware/validateAPIKEY');

//Execute a middleware in all endpoints.
//Dev is the environment.
app.use( morgan( 'dev' ) );
app.use( validateAPIKEY );

//Data
let bookmarkList = [
    {
        id : uuid.v4(),
        title : "Instagram",
        description : "Instagram webpage",   
        url : "https://instagram.com",
        rating : 1
    },
    {
        id : uuid.v4(),
        title : "Facebook",
        description : "My facebook homepage.",   
        url : "https://facebook.com",
        rating : 2
    },
    {
        id : uuid.v4(),
        title : "Youtube",
        description : "Youtube homepage",   
        url : "https://youtube.com",
        rating : 3
    },
    {
        id : uuid.v4(),
        title : "Blackboard",
        description : "My school's blackboard",   
        url : "https://miscursos.tec.mx/",
        rating : 4
    }
]

//get endpoint
//@Param: req = request
//@Param: res = response
app.get('/bookmarks', (req, res) => {
    console.log("Getting all list of bookmarks." );

    //Return status text and bookmarklist parsed as a json object.
    return res.status( 200 ).json( bookmarkList );

});

//get by name endpoint
//@Param: req = request
//@Param: res = response
app.get('/bookmark', (req, res) => {
    console.log("Getting one bookmark given the name parameter")
    console.log(req.query);

    //Get the ?title=blabla
    let title = req.query.title

    if ( ! title ){
        res.statusMessage = "The 'title' parameter is required."
        //406 es not acceptable
        //No regresamos el json object porque hubo un error.
        return res.status ( 406 ).end();
    }

    //THe result is an array because there can be more than one bookmark with the same name.
    let result = [];

    //Look for bookmarks with that name and add them to the array
    bookmarkList.filter( ( bookmark ) => {
        if (bookmark.title == title){
            result.push( bookmark );
        }
    })

    if (result.length == 0){
        res.statusMessage = `No bookmarks with the title = ${title} were found on the list.`;
        return res.status ( 404 ).end();
    }

    return res.status ( 200 ).json(result);
});

//get by name endpoint alternative version 
//@Param: req = request
//@Param: res = response
app.get( '/getbookmark/:title' , (req, res) => {

    console.log("Getting one bookmark given the name parameter")
    console.log(req.params);

    //Get the ?title=blabla
    let title = req.params.title

    //THe result is an array because there can be more than one bookmark with the same name.
    let result = [];

    //Look for bookmarks with that name and add them to the array
    bookmarkList.filter( ( bookmark ) => {
        if (bookmark.title == title){
            result.push( bookmark );
        }
    })

    if (result.length == 0){
        res.statusMessage = `No bookmarks with the title = ${title} were found on the list.`;
        return res.status ( 404 ).end();
    }

    return res.status ( 200 ).json(result);

});

//post endpoint using parser
//@Param: req = request
//@Param: res = response
app.post( '/bookmarks' , jsonParser, ( req, res ) => {

    console.log( "body", req.body );

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    //We must recieve all parts of the object.
    if (!title || !description || !url || !rating){
        res.statusMessage = "One of these parameters is missing in the request: 'id' 'title' 'description' 'url' 'rating'.";
        return res.status( 406 ).end();
    }

    //Rating must be a number
    if ( typeof( rating ) !== 'number' ){
        res.statusMessage = "The rating must be a number.";
        return res.status( 409 ).end();
    }

    let id = uuid.v4();

    //Check for duplicate id
    let flag = true;
    for( let i = 0; i < bookmarkList.length; i++ ){
        if( bookmarkList[i].id === id){
            flag = !flag;
            break;
        }
    }
    
    if ( flag ){
        //Add bookmark to list
        let newBookmark = {
            id : id,
            title : title,
            description : description,
            url : url,
            rating : rating
        };
        bookmarkList.push( newBookmark );
        return res.status( 201 ).json( newBookmark );
    }
    else{
        res.statusMessage = "The 'id' is already on the list. ";
        return res.status( 409 ).end();
    }

});

//Delete endpoint
//@Param: req = request
//@Param: res = response
app.delete( '/bookmark/:id', ( req,res ) => {
    //No validation required because endpoint is only called when there's an id.
    let id = req.params.id

    let bookmarkToRemove = bookmarkList.findIndex( (bookmark ) => {
        if (bookmark.id == id ){
            return true; 
        }
    });

    console.log(bookmarkToRemove);

    if ( bookmarkToRemove < 0 ){
        res.statusMessage = "That 'id' was not found in the bookmark list";
        return res.status( 404 ).end()
    }
    else{

        bookmarkList.splice( bookmarkToRemove, 1 );
        return res.status( 200 ).end();
    }

    
});

//Patch endpoint
//@Param: req = request
//@Param: res = response
app.patch( '/bookmark/:id', jsonParser, ( req, res ) => {

    //id obtained from url
    let id_URL = req.params.id

    //Data obtained from body
    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    console.log("Id_URL", id_URL);
    console.log("id", id);
    console.log("title", title);
    console.log("description", description);
    console.log("url", url);
    console.log("rating", rating);

    //CHecks if there's an id in the body.
    if ( !id ){
        res.statusMessage = "The 'id' is missing in the body of the request";
        return res.status( 406 ).end();
    }

    //Checks if id in body and in path are the same.
    if (id != id_URL){
        res.statusMessage = "id in the path parameters and id in the body must be the same.";
        return res.status( 409 ).end();
    }

    //Get the index of the bookmark to edit.
    let bookmarkToEdit = bookmarkList.findIndex( (bookmark ) => {
        if (bookmark.id == id ){
            return true; 
        }
    });

    //If id wasn't found in the list.
    if (bookmarkToEdit < 0){
        res.statusMessage = `No bookmarks with the 'id' = ${id} were found on the list.`;
        return res.status ( 404 ).end();
    }

    //Rating must be a number
    if ( typeof( rating ) !== 'number' ){
        res.statusMessage = "The rating must be a number.";
        return res.status( 409 ).end();
    }

    //Edit the object when the variable isn't null. 
    if ( title != null ){
        bookmarkList[bookmarkToEdit].title = title;
    }

    
    if ( description != null ){
        bookmarkList[bookmarkToEdit].description = description;
    }

    
    if ( url != null ){
        bookmarkList[bookmarkToEdit].url = url;
    }

    
    if ( rating != null ){
        bookmarkList[bookmarkToEdit].rating = rating;
    }


    return res.status( 202 ).json( bookmarkList[bookmarkToEdit] );
})

//To listen actively
// 8080= port number for running locally
//Second parameter = function
app.listen( 8080, () => {
    console.log("this server is running on port 8080");
});

//Base URL : http://localhost:8080
//GET endpoint : http://localhost:8080/bookmarks
//GET by name endpoint : http://localhost:8080/bookmark?title=bookmark1
//GET by name endpoint alternative : http://localhost:8080/getbookmark/bookmark1
//POST a new bookmark: http://localhost:8080/bookmarks
//DELETE a bookmark : http://localhost:8080/bookmark/123
//PATCH edit a bookmark : http://localhost:8080/bookmark/123