const authController = require('./authController');

test('get token from cookie', () => {
  expect(
    authController.getTokenFromCookie({
      cookies: {
        token: 'TEST_TOKEN'
      }
    })
  ).toBe('TEST_TOKEN');
});
