const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('./auth-model');
const config = require('../database/ConfigVars');

router.post('/register', (req, res) => {
  // implement registration
  const creds = req.body;
  console.log('req.body: ', req.body);

  if(users.isValid(creds)){
    const rounds = process.env.BCRYPT_ROUNDS || 10;
    const hash = bcrypt.hashSync(creds.password, rounds);
    creds.password = hash;

    users.addUser(creds).then(newUser =>{
      //console.log('newUser: ', newUser);
      res.status(201).json({message:'register success',
    data:newUser});
    }).catch(err => res.status(500).json(err.message));
  }else{
    res.status(400).json({message:'credentials are invalid'});
  }
});

router.post('/login', (req, res) => {
  // implement login
  const {username, password} = req.body;

  if(users.isValid(req.body)){
    users.findUser({username:username})
    .then(([found])=>{
      if(found && bcrypt.compareSync(password, found.password)){
        const token = createToken(found);
        res.status(200).json({message:'login success',
      data:found, token:token});
      }else{
        res.status(404).json({message:'re-enter credentials. Correctly this time'});
      }
    }).catch(err =>res.status(500).json(err.message));
  }else{
    res.status(400).json({message:'Provide correct credentials'})
  }
});

function createToken(subject){
  const payload = {
    sub:subject.id,
    username:subject.username,
    role:subject.role
  };
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, config.jwtSecret, options);
}

module.exports = router;
