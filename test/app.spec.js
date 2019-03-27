const app = require('../src/app')
const knexFn = require('knex');
const { PORT } = require('../src/config');
const Shows = require('./fixtureShows');
const User = require('./fixturesUsers');
const tableName = 'shows';
const userTable = 'users';

describe('Testing TV endpoints', () => {

  let db;

  before((next) => {
    db = knexFn({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });

    db(tableName).truncate();
    db(userTable).truncate();

    app.set('db', db);

    app.listen(PORT, () => {
      next();
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  });

  after(() => db.destroy())


  context('testing with data', () => {
    beforeEach((next) => {
      db.into(tableName).insert(Shows);
      db.into(userTable).insert(User);
      next();
    });

    afterEach((next) => {
      db(tableName).truncate();
      db(userTable).truncate();
      next();
    });

    it('INSERT /auth should return 400 if username or password is wrong', (next) => {
      const login = {
        user_name: 'taco',
        password: 'wrong_password'
      }

      supertest(app)
        .post('/api/auth/login')
        .send(login)
        .expect(400, next)
    })

    it('INSERT /api/users should return 201', (next) => {
      const newUser = {
        user_name: 'taco3',
        password: 'passworD1!',
        full_name: 'taco bell'
      }

      supertest(app)
        .post('/api/users')
        .send(newUser)
        .expect(201, next)
    })

    it('INSERT /api/users should return 400 if username is already taken', (next) => {
      const newUser = {
        user_name: 'taco',
        password: 'passworD1!',
        full_name: 'taco bell'
      }

      supertest(app)
        .post('/api/users')
        .send(newUser)
        .expect(400, next)
    })

    it('INSERT /api/shows should return 401 when trying to post without JWT', (next) => {
      let show = {
        title: 'show1',
        content: 'something',
        show_time: '9:00 AM',
        day: 'Daily',
        duration: 30,
        user_id: 1,
        network: 'Some network',

      }

      supertest(app)
        .post('/api/shows')
        .send(show)
        .expect(401, next)
    })

    it('PATCH /api/shows should return 401 when trying to patch without JWT', (next) => {
      let show = {
        title: 'show1',
        content: 'something',
        show_time: '9:00 AM',
        day: 'Daily',
        duration: 30,
        user_id: 1,
        network: 'Some network',

      }

      supertest(app)
        .patch('/api/shows')
        .send(show)
        .expect(401, next)
    })

    it('INSERT /api/shows should return 201 when trying to post with JWT', (next) => {
      let show = {
        title: 'show1',
        content: 'something',
        show_time: '9:00 AM',
        day: 'Daily',
        duration: 30,
        user_id: 1,
        network: 'Some network',

      }

      supertest(app)
        .post('/api/shows')
        .set({
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTcwMTQsImV4cCI6MTU1MzcyNzgxNCwic3ViIjoidGFjbyJ9.VAtECafcQckgBxIBpuaHZBPnVvdDSJJy9RLgAlC1_jE',
          Accept: 'application/json'
        })
        .send(show)
        .expect(201, next)
    })

    it('DELETE /api/shows should return 404 when deleting a show that does not exists', (next) => {
      const id = { id: '53432' }

      supertest(app)
        .delete('/api/shows')
        .set({
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTcwMTQsImV4cCI6MTU1MzcyNzgxNCwic3ViIjoidGFjbyJ9.VAtECafcQckgBxIBpuaHZBPnVvdDSJJy9RLgAlC1_jE',
          Accept: 'application/json'
        })
        .send(id)
        .expect(404, next)
    })

    it('DELETE /api/shows should return 404 when deleting a show that does exists', (next) => {
      const id = { id: '5a2f2b1c-3f19-4345-a862-813fb8a2307f' }

      supertest(app)
        .delete('/api/shows')
        .set({
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTcwMTQsImV4cCI6MTU1MzcyNzgxNCwic3ViIjoidGFjbyJ9.VAtECafcQckgBxIBpuaHZBPnVvdDSJJy9RLgAlC1_jE',
          Accept: 'application/json'
        })
        .send(id)
        .expect(204, next)
    })

    it('UPDATE /api/myshows/:id should return 200 when trying to post with JWT', (next) => {
      let show = {
        title: 'show1_new',
        content: 'something',
        show_time: '9:00 AM',
        day: 'Daily',
        duration: 30,
        user_id: 1,
        network: 'Some network',

      }

      supertest(app)
        .patch('/api/myshows/b679e4f1-d3c6-49cb-98cb-d37939a34b4a')
        .set({
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTcwMTQsImV4cCI6MTU1MzcyNzgxNCwic3ViIjoidGFjbyJ9.VAtECafcQckgBxIBpuaHZBPnVvdDSJJy9RLgAlC1_jE',
          Accept: 'application/json'
        })
        .send(show)
        .expect(200, next)
    })

    it('UPDATE /api/myshows/:id should return 500 when trying to post with JWT', (next) => {
      let show = {
        title: 'show1_new',
        content: 'something',
        show_time: '9:00 AM',
        day: 'Daily',
        duration: 30,
        user_id: 1,
        network: 'Some network',

      }

      supertest(app)
        .patch('/api/myshows/id_that_does_not_exist')
        .set({
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTcwMTQsImV4cCI6MTU1MzcyNzgxNCwic3ViIjoidGFjbyJ9.VAtECafcQckgBxIBpuaHZBPnVvdDSJJy9RLgAlC1_jE',
          Accept: 'application/json'
        })
        .send(show)
        .expect(500, next)
    })

    it('GET /api/myshows/:id should return 200', (next) => {

      supertest(app)
        .get('/api/myshows/b679e4f1-d3c6-49cb-98cb-d37939a34b4a')
        .set({
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTcwMTQsImV4cCI6MTU1MzcyNzgxNCwic3ViIjoidGFjbyJ9.VAtECafcQckgBxIBpuaHZBPnVvdDSJJy9RLgAlC1_jE',
          Accept: 'application/json'
        })
        .expect(200, next)
    })

    it('GET /api/myshows/:id should return 404', (next) => {

      supertest(app)
        .get('/api/myshows/something')
        .set({
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTcwMTQsImV4cCI6MTU1MzcyNzgxNCwic3ViIjoidGFjbyJ9.VAtECafcQckgBxIBpuaHZBPnVvdDSJJy9RLgAlC1_jE',
          Accept: 'application/json'
        })
        .expect(404, next)
    })
  })





})

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTA0NTMsImV4cCI6MTU1MzcyMTI1Mywic3ViIjoidGFjbyJ9.cIJaHj8DoAe5Kv5CvLIzu3L2jxK57o2YFNoKSfZa2ws

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NTM3MTcwMTQsImV4cCI6MTU1MzcyNzgxNCwic3ViIjoidGFjbyJ9.VAtECafcQckgBxIBpuaHZBPnVvdDSJJy9RLgAlC1_jE