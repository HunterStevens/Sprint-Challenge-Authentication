const supertest = require("supertest")
const server = require('../api/server');
const db = require('../database/dbConfig');

beforeEach(() =>{
    return db.migrate
    .rollback()
    .then(() => db.migrate.latest());
});

describe('Server', () =>{
    describe('GET /', ()=>{
        test('should return the message', async()=>{
            const res = await supertest(server).get('/');
            // console.log('server get: ',res);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ message: 'Welcome to the Dad-a-base for dad jokes' });
        })
    })
})

describe('Users', ()=>{
    describe('POST register', ()=>{
        test('should return an error message when given invalid credentials', async()=>{
            const res = await supertest(server).post('/api/auth/register')
            .send({username:'no password'});
            //console.log(res);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({ message: 'credentials are invalid' });
        });
        test('returns a new error with token when given valid credentials', async()=>{
            const res= await supertest(server).post('/api/auth/register')
            .send({username:'theNewGuy', password:'passwordPlease'});
            //console.log('correct register: ',res.body);
            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({ message: 'register success' });
        })
    })
    describe('POST login', ()=>{
        test('should return an error message with one of the required credentials missing', async()=>{
            const newUser = await supertest(server).post('/api/auth/register')
            .send({username:'theNewGuy', password:'passwordPlease'});

            const res= await supertest(server).post('/api/auth/login')
            .send({username:'theNewGuy'});
            //console.log('Invalid login: ',res.status);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({message:'Provide correct credentials'});
        });
        test('should return an error message when the credentials are inserted incorrectly', async()=>{
            const newUser = await supertest(server).post('/api/auth/register')
            .send({username:'theNewGuy', password:'passwordPlease'});

            const res= await supertest(server).post('/api/auth/login')
            .send({username:'theNewGuy', password:'wrong password'});
            //console.log('Invalid login: ',res.body);
            expect(res.status).toBe(404);
            expect(res.body).toMatchObject({message:'re-enter credentials. Correctly this time'});
        });
        test('returns a token with correct credentials entered in', async()=>{
            const newUser = await supertest(server).post('/api/auth/register')
            .send({username:'theNewGuy', password:'passwordPlease'});

            const res= await supertest(server).post('/api/auth/login')
            .send({username:'theNewGuy', password:'passwordPlease'});
            //console.log('correct login: ',res.body);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({message:'login success'});
            expect(res.body).toHaveProperty('token');
        })
    })
})

describe('Jokes', ()=>{
    describe('GET /Jokes', ()=>{
        test('to see if it will return an error without proper authentication', async() =>{
            const res = await supertest(server).get('/api/jokes');
            //console.log('GET jokes without Authentication', res.body);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({message:'please provide the authentication.'});
        })
        test('should return error with proper token', async()=>{
            const newUser = await supertest(server).post('/api/auth/register')
            .send({username:'theNewGuy', password:'passwordPlease'});
            const userLogin= await supertest(server).post('/api/auth/login')
            .send({username:'theNewGuy', password:'passwordPlease'});
            console.log('token provided: ',userLogin.body.token);

            const res = await supertest(server).get('/api/jokes')
            .send('authorization', userLogin.body.token);
            console.log('Get Jokes with token', res.body);
        })
    })
})