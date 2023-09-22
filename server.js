const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = express();
require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }));
app.use(express.static('/public'))
app.use(express.json())

const User = require('./models/users')
const mongoURL = process.env.URL



mongoose.connect(mongoURL)
  .then(() => {
    console.log(`Connected to MongoDB`)
  })
  .catch( err => {
    console.error(err)
  })

const port = process.env.port || 3000
app.listen(port, () => {
  console.log(`App running on port: ${port}`)
})

/* ------------------------------ App requests ------------------------------ */
app.get('/', async (req, res) => {
  const users = await User.find()
  res.render('index', { users })
})

app.get('/register', async (req, res) => {
  const user = new User(req.body)
  user.save()
  res.render('register', { user })
})

app.post('/register', async (req, res) => {
  const user = new User(req.body);
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.redirect('/login'); // Redirect after successful registration
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during registration.');
  }
});


app.get('/login', async (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  // const { username, password } = req.body;
  try {
    const user = await User.findOne(req.body.username);
    if (!user) {
      res.redirect('/register'); // Redirect to registration page or handle differently
      return;
    }
    await bcrypt.compare(req.body.password , user.password, (err, result) => {
      if (result) {
        res.redirect('/');
      } else {
        res.redirect('/register');
      }
    })
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Login failed.');
  }
});
