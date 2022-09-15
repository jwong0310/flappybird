import request from 'sync-request';
import config from '../config.json';

const port = config.port;
const url = config.url;
const OK = 200;
const badRequest = 400;
const restrictedAccess = 403;

// Helper function for clear
beforeEach(() => {
  request('DELETE', `${url}:${port}/clear/v1`);
});

// Helper function for authRegister/POST
const postRegister = (path: string, body: {email: string, password: string,
  nameFirst: string, nameLast: string}) => {
  const res = request(
    'POST',
    `${url}:${port}/${path}`,
    {
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
      },
    }
  );
  const status = res.statusCode;
  if (status !== OK) {
    return {status};
  }
  const bodyObj = JSON.parse(String(res.getBody()));
  return {bodyObj, status}
};

// Helper function for authLogin/POST
const postLogin = (path: string, body: {email: string, password: string}) => {
  const res = request(
    'POST',
    `${url}:${port}/${path}`,
    {
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
      },
    }
  );
  const status = res.statusCode;
  if (status !== OK) {
    return {status};
  }
  const bodyObj = JSON.parse(String(res.getBody()));
  return {bodyObj, status}
};

describe('Test Cases for AuthLogin', () => {
  test('Test successful login', () => {
    const resRegister = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const res = postLogin('auth/login/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
    });
    expect(res.status).toStrictEqual(OK);
    expect(res.bodyObj).toStrictEqual({
      token: resRegister.bodyObj.token,
      authUserId: resRegister.bodyObj.authUserId
    });
  });
  test('Test invalid email', () => {
    const resRegister = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const res = postLogin('auth/login/v2', {
      email: 'jacky.wong@unsw.edu.au',
      password: '123456789010',
    });
    expect(res.status).toStrictEqual(badRequest)
  });
  test('Test invalid password', () => {
    const resRegister = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const res = postLogin('auth/login/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '12345678',
    });
    expect(res.status).toStrictEqual(badRequest)
  });
});
