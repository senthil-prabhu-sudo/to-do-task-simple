const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();

mongoose.connect('mongodb://localhost:27017/mytodotask', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', false);

const taskListSchema = new mongoose.Schema({
  notes: String,
});

const TaskList = mongoose.model('TaskList', taskListSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
      const taskLists = await TaskList.find({});
      res.render('index.ejs', { taskLists });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error: ' + err.message);
    }
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { notes } = req.body;
  const newTaskList = new TaskList({ notes });

  newTaskList.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/delete/:id', (req, res) => {
  const taskListId = req.params.id;
  TaskList.findByIdAndDelete(taskListId, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
