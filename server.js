/* jshint esversion:6 */

const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080; //change?
const db = require('./models');
const Gallery = db.gallery;
const Author = db.author;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

/*ROUTES*/
app.get('/', (req, res) => {
  return res.json('Hello World!');
});

//GET to view a list of gallery photos
app.get('/gallery', (req, res) => {
  return Gallery.findAll()
    .then(galleryInformation => {
      return res.json(galleryInformation);
    });
});

//GET/gallery/:id to see a single photo
app.get('/gallery/:id', (req, res) => {
  const id = req.params.id;
  return Gallery.findById(id) 
    .then(pictureInformation => {
      return res.json(pictureInformation);
    });
});

//GET/gallery/new to see a 'new photo' form
app.get('/gallery/new', (req, res) => {
  return res.render('/views/partials/new');
});

//GET/gallery/:id/edit : see a form to edit a gallery identified by :id
//fields are: author : text, link : Text(image URL), descrip : TextArea
app.get('/gallery/:id/edit', (req, res) => {
  const id = req.params.id;
  return Gallery.findById(id)
    .then(pictureInformation => {
      return res.render('partials/edit', { pictureInformation });
    });
});

//POST/gallery : create a new gallery photo i
app.post('/gallery', (req, res) => {
  //{author: string, link: string, description: string}
  const author = req.body.author;
  const link = req.body.link;
  const description = req.body.description;

  return Gallery.create({
    author : author,
    link : link,
    description : description
  })
    .then(newPicture => {
      console.log('POST is done');
      return res.json(newPicture);
    });
});

//PUT/gallery/:id : updates a single gallery photo identified by :id
app.put('/gallery/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body; 
  //{author: string, link: string, description: string}

  return Gallery.findById(id)
    .then(pictureInformation => {
      let updateObject = {};

      if (data.author) Gallery.update({ 
        author : data.author }, {
          where : { id : id }
        });
      if (data.link) Gallery.update({ 
        link : data.link }, {
          where : { id : id }
        });
      if (data.description) Gallery.update({ description : data.description}, {
          where : { id : id }
        });

      console.log('Picture edited');
      return res.json(pictureInformation);
    });
});

//DELETE/gallery/:id : deletes a single gallery photo ientified by :id
app.delete('/gallery/:id', (req, res) => {
  const id = req.params.id;

  return Gallery.findById(id)
    .then((pictureInformation) => {
      Gallery.destroy({ where : {
        id : id
      }});

      console.log('Picture deleted');
      return res.json(pictureInformation);
    });
});

app.listen(PORT, () => {
  db.sequelize.sync({ force: true });
  console.log('Server running on ' + PORT);
});
