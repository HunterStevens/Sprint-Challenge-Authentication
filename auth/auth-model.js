const db = require('../database/dbConfig');

module.exports ={
    getUsers,
    getUserById,
    findUser,
    addUser,
    isValid

}

function getUsers(){
    return db('users').select('id','username');
}

function findUser(filter){
    return db('users').where(filter).orderBy('id');
}

async function addUser(newUser){
    try{
        const [id] = await db('users').insert(newUser);
        return getUserById(id);
    }catch(err){
        throw err;
    }
}

function getUserById(id){
    return db('users').where({id});
}

function isValid(credential){
    return Boolean(credential.username && credential.password && typeof credential.password === 'string');
}