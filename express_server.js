const express = require('express');
const app = express();
const PORT = 8080;
// to read/render ejs file.
app.set('view engine', 'ejs');
// to translate POST data: buffer -> human readable.
// middleware
app.use(express.urlencoded({ extended: true }));

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
  // const a = 'kiko';
  res.send(`Hello!`);
});

app.get('/urls', (req,res) => {
  const templateVars = {urls: urlDatabase}
  res.render('urls_index', templateVars)
})


app.get('/urls/new', (req,res) => {
  res.render('urls_new')
})

app.get('/urls/:id', (req,res) => {
  const templateVars = {id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render('urls_show', templateVars)
})

app.post('/urls', (req,res) => {
  console.log(req.body);
  res.send('Ok')
})


app.get('/urls.json', (req,res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req,res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});