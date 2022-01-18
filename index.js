const express = require('express');
const req = require('express/lib/request');
const { append } = require('express/lib/response');
const res = require('express/lib/response');
const { restart } = require('nodemon');
const app = express();
const cors = require('cors');
const port = 5000;

/* this the branched version so we can link frontend to backenc*/
/* time to work */

const users = { 
    users_list :
    [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
   const name = req.query.name;
   const job = req.query.job;

   if(name != undefined && job != undefined){
      let result = findUserByNameAndJob(name, job);
      result = {users_list: result};
      res.send(result);
   }

   else if(name != undefined){
      let result = findUserByName(name);
      result = {users_list: result};
      res.send(result)
   }
   else{
      res.send(users);
   }
});

app.get('/users/:id', (req, res) => {
   const id = req.params['id'];
   let result = findUserById(id);
   if (result === undefined || result.length == 0)
      res.status(404).send('Resource not found.')
   else {
      result = {users_list: result};
      res.send(result);
   }
});

app.delete('/users/:id', (req, res) => {
   const id = req.params['id'];
   //console.log('hello');
   deleteUser(id);
   // successful deletion
   res.status(204).end();
});

function deleteUser(id){
   //resource not found
   if (id.length == 0 || undefined == findUserById(id)){
      res.status(404).send('Resource not found.');
   }
   else{
      const new_users = users['users_list'].filter( (user) => user['id'] != id);
      users['users_list'] = new_users;
   }
}

app.post('/users', (req, res) => {
   const userToAdd = req.body;
   addUser(userToAdd);
   // return updated representation of the object I inserted with status code as well.
   res.status(201).send(userToAdd).end();
});

function findUserByNameAndJob(name, job){
   return users['users_list'].filter( (user) => user['name'] === name && user['job'] === job);
}

function generateID(){
   return Date.now().toString()
}

function addUser(user){
   user.id = generateID();
   users["users_list"].push(user);
}

function findUserById(id) {
   return users['users_list'].find( (user) => user['id'] === id); // or line below
   //return users['users_list'].filter( (user) => user['id'] === id);
}

const findUserByName = (name) => {
   return users['users_list'].filter( (user) => user['name'] == name);
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
