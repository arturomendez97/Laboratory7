//Se pone aquí porque se usan comandos para iniciar la collection
const mongoose = require( 'mongoose' );

//Schema of collection
const bookmarkSchema = mongoose.Schema({
    id : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    }
});

//Referencia a la collection
//Le mandamos el nombre de la collection y el schema.
const bookmarkCollection = mongoose.model( 'bookmarks', bookmarkSchema );

//Los metodos
const Bookmarks = {
    createBookmark : function( newBookmark ){
        return bookmarkCollection // db.bookmarks.insert ( newBookmark );
                .create( newBookmark )
                //Como no sabemos cuanto va a tardar, el .then es para esperar
                //A que termine y despues ejecutar el código dentro del then.
                .then( createdBookmark => {
                    //Regresamos el objeto creado para usarlo en el server.
                    return createdBookmark;
                })
                .catch( err => {
                    return err;
                });
    },
    getAllBookmarks : function(){
        return bookmarkCollection
                .find()
                .then( allBookmarks => {
                    return allBookmarks;
                })
                .catch( err => {
                    return err;
                });
    },
    getBookmarksbyTitle : function( bookmarkTitle ){
        return bookmarkCollection
                .find({title: bookmarkTitle})
                .then( BookmarksbyTitle => {
                    return BookmarksbyTitle;
                })
                .catch( err => {
                    return err;
                });
    },
    removeBookmarkbyID : function( bookmarkID ){
        return bookmarkCollection
                .deleteOne({id: bookmarkID})
                .then( BookmarkDeleted => {
                    return BookmarkDeleted;
                })
                .catch( err => {
                    return err;
                });
    },
    updateBookmarkbyID : function( bookmarkID, valuesToEdit){
        return bookmarkCollection
                .update({ id: bookmarkID },{ $set: valuesToEdit })
                .then( BookmarkUpdated => {
                    return BookmarkUpdated;
                })
                .catch( err => {
                    return err;
                });
    }
}

//Exportar el objeto
module.exports = { Bookmarks };