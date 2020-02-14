const userController = require('../controllers/userController');
test('should get all of the users', done => {
  const mongoObj = {
    find: jest.fn((emptyObj, cb) => {
      return cb(null, [
        {
          _doc: {
            role: 0,
            _id: '5c08063feb087861d7f81a49',
            firstName: 'dere',
            lastName: 'fasil des',
            email: 'dere@gmail.com',
            created_date: '2018-12-05T17:09:19.664Z',
            password: 'test'
          }
        }
      ]);
    })
  };
  userController.getAllUsersQuery(mongoObj).then(users => {
    expect(users).toMatchObject([
      {
        role: 0,
        _id: '5c08063feb087861d7f81a49',
        firstName: 'dere',
        lastName: 'fasil des',
        email: 'dere@gmail.com',
        created_date: '2018-12-05T17:09:19.664Z'
      }
    ]);
    expect(users.pop()).not.toHaveProperty('password');
    return done();
  });
});
