const findEmail = (email,data) => {
  for (const key in data){
    if(email === data[key].email){
      return data[key];
    }
  }
  return null;
}

module.exports = findEmail;