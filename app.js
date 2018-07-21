const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/restful-blog', {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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
});

// INDEX ROUTE
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

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});

// CREATE ROUTE
app.post('/blogs', (req, res) => {
    // Create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new');
        }
        else {
            // Then, redirect to the index
            res.redirect('/blogs');
        }
    });
});

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect('/blogs');
        }
        else {
            res.render('show', {blog});
        }
    });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect('/blogs');
        }
        else {
            res.render('edit', {blog});
        }
    });
});

// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect('/blogs');
        }
        else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

// Delete Route
app.delete('/blogs/:id', (req, res) => {
    // Destroy blog
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect(`/blogs/${req.params.id}`);
        }
        else {
            res.redirect('/blogs');
        }
    });
});

app.listen(3000, () => {
    console.log('RESTful Blog server is running.');
});