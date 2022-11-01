const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;
// to read/render ejs file.
app.set('view engine', 'ejs');
// to translate POST data: buffer -> human readable.
// middleware for buffer and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// short URL generator
const generateRandomString = () => {
  output = "";
  const random = (min,max) => (Math.trunc(Math.random() * (max - min)) + 1) + min;
  for (i = output.length; i < 6; i = output.length){
    let rNum = random(0,10);
    if (rNum % 2 === 0) { output += rNum - 1
    } else {
      const randLet = String.fromCharCode(random(65,90));
      const caseLet = rNum > 5 ? randLet.toLowerCase() : randLet;
      output += caseLet;
    }
  }
  return output;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get('/', (req,res) => {
  res.send(`Hello!`);
});

app.get('/urls', (req,res) => {
  const templateVars = {username: req.cookies['username'], urls: urlDatabase}
  res.render('urls_index', templateVars)
})

app.get('/urls/new', (req,res) => {
  console.log(req.cookies)
  const templateVars = {username: req.cookies['username']}
  res.render('urls_new', templateVars)
})

app.get('/urls/:id', (req,res) => {
  const templateVars = {username: req.cookies['username'], id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render('urls_show', templateVars)
})

app.post('/urls', (req,res) => {
  const randomStr = generateRandomString();
  urlDatabase[randomStr] = `http://${req.body.longURL}`;
  res.redirect(`/urls/${randomStr}`)
})

app.post('/urls/:id/delete', (req,res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.post('/urls/:id/edit', (req,res) => {
  urlDatabase[req.params.id] = `http://${req.body.longURL}`
  res.redirect('/urls')
})

app.post('/login', (req,res) => {
  res.cookie('username',req.body.username)
  res.redirect('/urls')
})

app.post('/logout', (req,res) => {
  res.clearCookie('username');
  res.redirect('/urls')
})

app.get('/u/:id', (req,res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL)
})

// app.get('/urls.json', (req,res) => {
//   res.json(urlDatabase);
// });


app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});