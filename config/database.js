if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb+srv://sbutenko:Password12345@cluster0-icuw9.mongodb.net/test?retryWrites=true&w=majority'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/hotdog'}
}