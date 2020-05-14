
const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function fetchGetbBookmark( title ){
    let url = `/getbookmark/${title}`

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
        }
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if ( response.ok ){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {

            results.innerHTML = "";
            
            for ( let i = 0; i < responseJSON.length; i++ ){
                results.innerHTML += `<div> ${responseJSON[i].id}, ${responseJSON[i].title}, ${responseJSON[i].description}, ${responseJSON[i].url}, ${responseJSON[i].rating}, </div>`;
            }

        })
        .catch( err => {
            results.innerHTML = err.message;
        })


}


function fetchModifyBookmark(id, body ){

    let url = `/bookmark/${id}`

    let data = body;

    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if ( response.ok ){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            
            fetchListBookmarks();            


        })
        .catch( err => {
            results.innerHTML = err.message;
        })
     
}

function fetchDeleteBookmark( id ){
    let url = `/bookmark/${id}`

    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
        }
    }

    console.log(settings)

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if ( response.ok ){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchListBookmarks();
        })
        .catch( err => {
            results.innerHTML = err.message;
        })


}


function fetchAddBookmark( title, description, urlBookmark, rating ){

    let url = "/bookmarks";

    let data = {
        title : title,
        description : description,
        url : urlBookmark,
        rating : Number( rating )
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if ( response.ok ){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            
            results.innerHTML += `<div> ${responseJSON.id}, ${responseJSON.title}, ${responseJSON.description}, ${responseJSON.url}, ${responseJSON.rating}, </div>`;
            


        })
        .catch( err => {
            results.innerHTML = err.message;
        })
     
}

function fetchListBookmarks(){

    let url = "/bookmarks";
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    console.log(settings)


    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if ( response.ok ){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {

            results.innerHTML = "";

            for ( let i = 0; i < responseJSON.length; i++ ){
                results.innerHTML += `<div> ${responseJSON[i].id}, ${responseJSON[i].title}, ${responseJSON[i].description}, ${responseJSON[i].url}, ${responseJSON[i].rating}, </div>`;
            }


        })
        .catch( err => {
            results.innerHTML = err.message;
        })

}


function watchgetBookmarksForm(){
    let getBookmarksForm = document.querySelector(".form-get-bookmarks");

    getBookmarksForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        fetchListBookmarks();
    });
}

function watchAddBookmarkForm(){
    let addBookmarkForm = document.querySelector(".form-add-bookmark");

    addBookmarkForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'bookmarkTitleAdd' ).value;
        let description = document.getElementById( 'bookmarkDescriptionAdd' ).value;
        let url = document.getElementById( 'bookmarkUrlAdd' ).value;
        let rating = document.getElementById( 'bookmarkRatingAdd' ).value;

        fetchAddBookmark( title, description, url, rating );
    });
}

function watchDeleteBookmarkForm(){
    let deleteBookmarkForm = document.querySelector(".form-delete-bookmark");

    deleteBookmarkForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let id = document.getElementById( 'bookmarkIdDel' ).value;

        fetchDeleteBookmark( id );
    })
}

function watchModifyBookmarkForm(){
    let ModifyBookmarkForm = document.querySelector(".form-modify-bookmark");

    ModifyBookmarkForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let id = document.getElementById( 'bookmarkIdMod' ).value;
        let title = document.getElementById( 'bookmarkTitleMod' ).value;
        let description = document.getElementById( 'bookmarkDescriptionMod' ).value;
        let url = document.getElementById( 'bookmarkUrlMod' ).value;
        let rating = document.getElementById( 'bookmarkRatingMod' ).value;

        let body = {
            id : id
        }

        if(title){
            body.title = title; 
        }

        if(description){
            body.description = description; 
        }

        if(url){
            body.url = url;
        }

        if(rating){
            body.rating = Number( rating );
        }

        fetchModifyBookmark( id, body );
    });
}


function watchGetBookmarkForm(){
    let GetBookmarkForm = document.querySelector(".form-getbytitle-bookmark");

    GetBookmarkForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'bookmarkTitleGet' ).value;

        fetchGetbBookmark( title );
    })
}

function init(){
    watchgetBookmarksForm();
    watchAddBookmarkForm();
    watchDeleteBookmarkForm();
    watchModifyBookmarkForm();
    watchGetBookmarkForm();

    fetchListBookmarks();
}

init();