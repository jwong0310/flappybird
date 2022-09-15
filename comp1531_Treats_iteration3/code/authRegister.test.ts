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

describe('Test Cases for AuthRegister', () => {
  test('Test successful registration', () => {
    const res = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(res.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    expect(res.status).toStrictEqual(OK);
  });
  test('Test invalid email', () => {
    const res = postRegister('auth/register/v2', {
      email: 'jacky1@unswedu@?au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(res.status).toStrictEqual(badRequest);
    //console.log(res.bodyObj)
    
  });
  test('Test invalid password length', () => {
    const res = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '12345',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(res.status).toStrictEqual(badRequest);
  });
  test('Testing for nameFirst less than 1 character', () => {
    const res = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456',
      nameFirst: '',
      nameLast: 'wong',
    });
    expect(res.status).toStrictEqual(badRequest);
  });
  test('Testing for nameLast less than 1 character', () => {
    const res = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456',
      nameFirst: 'jacky',
      nameLast: '',
    });
    expect(res.status).toStrictEqual(badRequest);
  });
  test('Testing for nameFirst with 50 characters', () => {
    const res = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456',
      nameFirst: 'F'.repeat(50),
      nameLast: 'wong',
    });
    expect(res.status).toStrictEqual(badRequest);
  });
  test('Testing for nameLast with 50 characters', () => {
    const res = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456',
      nameFirst: 'jacky',
      nameLast: 'F'.repeat(50),
    });
    expect(res.status).toStrictEqual(badRequest);
  });
});