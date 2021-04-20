const { users: dbUsers, Sequence } = require('./database');

const cors = require('cors');
const express = require('express');
const { response } = require('express');


const app = express();
const PORT = 8000;

const sequence = new Sequence()

let users = [...dbUsers]

app.use(express.json());

app.use(cors());

app.get("/users", async (req, res, next) => {
    return res.status(200).json(users);
  });

app.get("/users/:id", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  return user ? res.status(200).json(user) : res.status(404).statusMessage("no user found");
});

app.post("/users", async (req, res, next) => {
  const user = req.body;
  const oldUserIndex = users.findIndex(u => u.id === user.id);
  if(oldUserIndex >= 0) {
    users.splice(oldUserIndex, 1, user)
  } else {
    user.id = sequence.nextVal();
    users = [...users, user];
  }
  return res.status(200).json(user);
})

app.listen(PORT, () => console.log('Server listen on port ' + PORT));
