const authController = require('./authController');
const bcrypt = require('bcryptjs');
const SALT_ROUND = 10;
const salt = bcrypt.genSaltSync(SALT_ROUND);

describe('Checks password hashing and comparision', () => {
  const myPassword = '123';
  const fakePassword = '345';
  let hash = bcrypt.hashSync(myPassword, salt);

  test('password is hashed', done => {
    expect(authController.hashPassword(myPassword, salt)).resolves.not.toEqual(
      myPassword
    );

    done();
  });

  test('real password comapare to hashed part', done => {
    expect(
      authController.comparePassword(myPassword, hash)
    ).resolves.toBeTruthy();

    done();
  });

  test('fake password comapare to hashed part', done => {
    expect(
      authController.comparePassword(fakePassword, hash)
    ).resolves.toBeFalsy();

    done();
  });
});
