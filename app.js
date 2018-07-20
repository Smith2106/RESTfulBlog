const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/restful-blog', {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const Blog = mongoose.model('Blog', blogSchema);

// RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', {blogs});
        }
    });
});

app.listen(3000, () => {
    console.log('RESTful Blog server is running.');
});