const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;
// to read/render ejs file.
app.set('view engine', 'ejs');
// to translate POST data: buffer -> human readable.
// middleware for buffer and cookies
// express.static for the photo
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
// short URL generator
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

const users = {
  findEmail(email) {
    for (const key in this) {
      if (email === this[key]['email']) {
        return this[key];
      }
    }
    return null;
  },
  asasas : {
    email:'k@a.com',
    password: 'asas',
    id:'asasas',
  }
};

const urlDatabase2 = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",
  userID: 'asasas'},
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const findId = (id,data) => {
  for(const key in data){
    // console.log(key)
    if(id === key){
      return data[key];
    } 
  }
  return null;
};

const urlsForUser = (id,database) => {
  output = [];
  for (const key in urlDatabase2){
    if(id === database[key].userID){
      output.push(key)
    };
  };
  return output;
}


app.get('/', (req,res) => {
  res.send(`Hello!`);
});

app.get('/urls', (req,res) => {
  const id = req.cookies['username'];
  const matchURL = urlsForUser(id,urlDatabase2);
  if(!id){
    res.redirect('/login');
    return;
  }
  const templateVars = {user : users[id], urls: urlDatabase2, matchURL};
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req,res) => {
  const id = req.cookies['username'];
  if(!id){
    res.redirect('/login');
    return
  }
  const templateVars = {user : users[id], urls: urlDatabase2};
  res.render('urls_new', templateVars);
});

app.get('/register', (req, res) => {
  const id = req.cookies['username'];
  if(id){
    res.redirect('/urls');
    return;
  }
  const templateVars = {user : users[id], urls: urlDatabase2};
  res.render('registration',templateVars);
});

app.get('/login', (req, res) => {
  const id = req.cookies['username'];
  res.clearCookie('username');
  if(id){
    res.redirect('/urls')
    return
  }
  const templateVars = {user : users[id], urls: urlDatabase2};
  res.render('login', templateVars);
});

app.get('/urls/:id', (req,res) => {
  const id = req.cookies['username'];
  if(id !== urlDatabase2[req.params.id].userID) {
    res.status(400);
    res.redirect('/400');
    return;
  }

  const templateVars = {user : users[id], id: req.params.id, longURL: urlDatabase2[req.params.id].longURL};
  res.render('urls_show', templateVars);
});

app.post('/urls', (req,res) => {
  const id = req.cookies['username'];
  if(!id){
    res.status(403);
    return;
  }
  const randomStr = generateRandomString();
  urlDatabase2[randomStr] = {
    longURL: `http://${req.body.longURL}`,
    userID: id,
  };
  res.redirect(`/urls/${randomStr}`);
});

app.post('/urls/:id/delete', (req,res) => {
  delete urlDatabase2[req.params.id];
  res.redirect('/urls');
});

app.post('/urls/:id/edit', (req,res) => {
  urlDatabase2[req.params.id].longURL = `http://${req.body.longURL}`;
  res.redirect('/urls');
});

app.post('/login', (req,res) => {
  const userInfo = users.findEmail(req.body.email);
  // console.log(userInfo)
  if (!userInfo || req.body.password !== userInfo.password) {
    res.redirect('/403');
    return;
  }
  res.cookie('username',userInfo.id);
  res.redirect('/urls');
});

app.post('/logout', (req,res) => {
  res.clearCookie('username');
  res.redirect('/login');
});

app.post('/register', (req,res) => {
  if (!req.body.password || !req.body.email || users.findEmail(req.body.email)) {
    res.redirect('/400');
    return;
  }
  const newId = generateRandomString();
  users[newId] = {
    'id': newId,
    email: req.body.email,
    password: req.body.password
  };
  
  res.cookie('username', users[newId]['id']);
  res.redirect('/urls');
});

app.get('/u/:id', (req,res) => {
  const dataURL = findId(req.params.id, urlDatabase2)
  if(!dataURL){
    res.status(400);
    res.redirect('/400');
    return
  }; 
  res.redirect(dataURL.longURL);

});

app.get('/400', (req,res) => {
  // req.send('invalid')
  console.log(urlDatabase2)
  res.status(400);
  res.render('400');
});

app.get('/403', (req,res) => {
  res.status(403);
  res.render('403');
});

app.get('*', (req,res) => {
  console.log(users);
  console.log(urlDatabase2)
  res.status(404);
  res.render('404');
});


app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});