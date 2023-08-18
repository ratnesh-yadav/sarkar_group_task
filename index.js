const express = require('express');
const db = require('./db/db')
const {getAll,createchildsubcategory,createsubcategory,createcategory} = require('./controller/controller')

const app = express();
const port = 3000;



db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

app.use(express.json());

// API to add a category
app.post('/addCategory', createcategory);

// API to add a subcategory
app.post('/addSubcategory', createsubcategory);

// API to add a child subcategory
app.post('/addChildSubcategory', createchildsubcategory);

// API to fetch categories and their subcategories with child subcategories
app.get('/categoriesWithSubcategories', getAll);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
