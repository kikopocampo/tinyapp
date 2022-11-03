const express = require('express');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const findEmail = require('./helpers.js');
const app = express();
const PORT = 8080;

// to read/render ejs file.
app.set('view engine', 'ejs');

// middleware for url, photos, and cookies
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
}));

// random URL generator
const generateRandomString = () => {
  let output = "";
  const random = (min,max) => (Math.trunc(Math.random() * (max - min)) + 1) + min;
  for (let i = output.length; i < 6; i = output.length) {
    let rNum = random(0,10);
    if (rNum % 2 === 0) {
      output += rNum - 1;
    } else {
      const randLet = String.fromCharCode(random(65,90));
      const caseLet = rNum > 5 ? randLet.toLowerCase() : randLet;
      output += caseLet;
    }
  }
  return output;
};

// Users Database
const users = {};

// Urls Database
const urlDatabase2 = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",
    userID: 'asasas'},
};

// identifies if a certain short url exists in the database
const findId = (id,data) => {
  for (const key in data) {
    if (id === key) {
      return data[key];
    }
  }
  return null;
};

// displays the urls for a specific user
const urlsForUser = (id,database) => {
  const output = [];
  for (const key in urlDatabase2) {
    if (id === database[key].userID) {
      output.push(key);
    }
  }
  return output;
};

// homepage - transfers to login page if logged out
// CREATE
app.get('/', (req,res) => {
  const id = req.session.username;
  if (!id) {
    res.redirect('/login');
    return;
  }
  res.redirect('/urls');
});

// creates a new user - checks if a user already exists or if all inputs are filled.
// CREATE
app.post('/register', (req,res) => {
  if (!req.body.password || !req.body.email || findEmail(req.body.email,users)) {
    res.redirect('/400');
    return;
  }
  const newId = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password,10);
  users[newId] = {
    'id': newId,
    email: req.body.email,
    password: hashedPassword
  };
  req.session.username = users[newId]['id'];
  res.redirect('/urls');
});

// displays the create new url form - redirects to login if logged out
// CREATE
app.get('/urls/new', (req,res) => {
  const id = req.session.username;
  if (!id) {
    res.redirect('/login');
    return;
  }
  const templateVars = {user : users[id], urls: urlDatabase2};
  res.render('urls_new', templateVars);
});

// creates a new url
// sends a 403 if wrong user tries to create url via curl
// CREATE
app.post('/urls', (req,res) => {
  const id = req.session.username;
  if (!id) {
    res.status(403);
    return;
  }
  const randomStr = generateRandomString();
  urlDatabase2[randomStr] = {
    longURL: req.body.longURL,
    userID: id,
  };
  res.redirect(`/urls/${randomStr}`);
});

// displays the users list of urls
// READ
app.get('/urls', (req,res) => {
  const id = req.session.username;
  const matchURL = urlsForUser(id,urlDatabase2);
  if (!id) {
    res.redirect('/login');
    return;
  }
  const templateVars = {user : users[id], urls: urlDatabase2, matchURL};
  res.render('urls_index', templateVars);
});


// displays the register page - redirects to list of urls if logged in
// READ
app.get('/register', (req, res) => {
  const id = req.session.username;
  if (id) {
    res.redirect('/urls');
    return;
  }
  const templateVars = {user : users[id], urls: urlDatabase2};
  res.render('registration',templateVars);
});

// displays the login page - redirects to list of urls if already logged in
// READ
app.get('/login', (req, res) => {
  const id = req.session.username;
  req.session = null;
  if (id) {
    res.redirect('/urls');
    return;
  }
  const templateVars = {user : users[id], urls: urlDatabase2};
  res.render('login', templateVars);
});

// login page - findEmail function checks if an email exists
// checks if bcrypt passes, else, 403 error.
app.post('/login', (req,res) => {
  const userInfo = findEmail(req.body.email, users);
  if (!userInfo || !bcrypt.compareSync(req.body.password,userInfo.password)) {
    res.redirect('/403');
    return;
  }
  req.session.username = userInfo.id;
  res.redirect('/urls');
});

// directs anyone to the corresponding site
// even those who are logged out, provided they have the short-url info
// READ
app.get('/u/:id', (req,res) => {
  const dataURL = findId(req.params.id, urlDatabase2);
  if (!dataURL) {
    res.redirect('/400');
    return;
  }
  res.redirect(dataURL.longURL);
});

// displays the specifics of a url, also the editing page
// sends a 400 if someone accessed a short URL that are not in their database
// UPDATE
app.get('/urls/:id', (req,res) => {
  const id = req.session.username;
  if (!id) {
    res.status(400);
    res.redirect('/400');
    return;
  }
  if (id !== urlDatabase2[req.params.id].userID) {
    res.status(400);
    res.redirect('/400');
    return;
  }

  const templateVars = {user : users[id], id: req.params.id, longURL: urlDatabase2[req.params.id].longURL};
  res.render('urls_show', templateVars);
});


// confirms the edit and directs to the index page
// also confirms first if the user is correct, else 403 error.
// UPDATE
app.put('/urls/:id', (req,res) => {
  const id = req.session.username;
  if (urlDatabase2[req.params.id].userID === id) {
    urlDatabase2[req.params.id].longURL = req.body.longURL;
    res.redirect('/urls');
    return;
  }
  res.redirect('/403');
});



// logout page, directs to login page and removed existing cookies
// DELETE
app.post('/logout', (req,res) => {
  req.session = null;
  res.redirect('/login');
});

// deletes any selected URL
// checking first if user is correct, else gets a 403 error.
// DELETE
app.delete('/urls/:id', (req,res) => {
  const id = req.session.username;
  if (urlDatabase2[req.params.id].userID === id) {
    delete urlDatabase2[req.params.id];
    res.redirect('/urls');
    return;
  }
  res.redirect('/403');
});

// 400 Error page - sends a status code as well.
app.get('/400', (req,res) => {
  // req.send('invalid')
  res.status(400);
  res.render('400');
});

// 403 Error page - sends a status code as well.
app.get('/403', (req,res) => {
  res.status(403);
  res.render('403');
});

// 404 Error page - sends a status code as well.
app.get('*', (req,res) => {
  res.status(404);
  res.render('404');
});

// 🦻🏼🦻🏼🦻🏼
app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});