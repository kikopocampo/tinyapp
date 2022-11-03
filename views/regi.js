const users = {
  asasas : {
    email:'k@a.com',
    password: 'asas',
    id:'asasas',
  }
};
// console.log(users.findEmail('k@a.com'))

const findEmail = (email,data) => {
  for (const key in data){
   
    if(email === data[key].email){
      return data[key];
    }
  }
  return null;
}

console.log(findEmail('k@a.com', users))