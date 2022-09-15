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

// Helper function for authLogout/POST
const postLogout = (path: string, body: {token: string}) => {
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

describe('Test Cases for AuthLogout', () => {
  test('Test successful logout', () => {
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
    const resLogout = postLogout('auth/logout/v1', {
      token: resRegister.bodyObj.token
    });
    expect(resLogout.status).toStrictEqual(OK);
    expect(resLogout.bodyObj).toStrictEqual({});
  });
  test('Test successful logout of second user', () => {
    const resRegister1 = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister1.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resRegister2 = postRegister('auth/register/v2', {
      email: 'jamie.wong1@unsw.edu.au',
      password: '1234567890101',
      nameFirst: 'jamie',
      nameLast: 'wong',
    });
    expect(resRegister2.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resLogout = postLogout('auth/logout/v1', {
      token: resRegister2.bodyObj.token
    });
    expect(resLogout.status).toStrictEqual(OK);
    expect(resLogout.bodyObj).toStrictEqual({});
  });
  test('Test invalid token', () => {
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
    const resLogout = postLogout('auth/logout/v1', {
      token: 'Online 123'
    });
    expect(resLogout.status).toStrictEqual(restrictedAccess);
  });
  test('Test logout of User and logging back in', () => {
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
    const resLogin = postLogin('auth/login/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
    });
    expect(resLogin.bodyObj).toStrictEqual({
      token: resRegister.bodyObj.token,
      authUserId: resRegister.bodyObj.authUserId
    });
    const resLogout = postLogout('auth/logout/v1', {
      token: resRegister.bodyObj.token
    });
    expect(resLogout.bodyObj).toStrictEqual({});
    const resLoginAgain = postLogin('auth/login/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
    });
    expect(resLoginAgain.status).toStrictEqual(OK);
    expect(resLoginAgain.bodyObj).toStrictEqual({
      token: resRegister.bodyObj.token,
      authUserId: resRegister.bodyObj.authUserId
    });
  });
  test('Testing for unique tokens when multiple users log off and log on', () => {
    const resRegister1 = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister1.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resRegister2 = postRegister('auth/register/v2', {
      email: 'jamie.wong1@unsw.edu.au',
      password: '1234567892',
      nameFirst: 'jamie',
      nameLast: 'wong',
    });
    expect(resRegister2.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resRegister3 = postRegister('auth/register/v2', {
      email: 'vanessa.wong1@unsw.edu.au',
      password: '123456789',
      nameFirst: 'vanessa',
      nameLast: 'wong',
    });
    expect(resRegister3.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resLogout1 = postLogout('auth/logout/v1', {
      token: resRegister1.bodyObj.token,
    });
    expect(resLogout1.bodyObj).toStrictEqual({});
    const resLogout2 = postLogout('auth/logout/v1', {
      token: resRegister2.bodyObj.token
    });
    expect(resLogout2.status).toStrictEqual(OK);
    expect(resLogout2.bodyObj).toStrictEqual({});
    const resLogout3 = postLogout('auth/logout/v1', {
      token: resRegister3.bodyObj.token
    });
    expect(resLogout3.status).toStrictEqual(OK);
    expect(resLogout3.bodyObj).toStrictEqual({});
    const resLogin1 = postLogin('auth/login/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
    });
    expect(resLogin1.status).toStrictEqual(OK);
    expect(resLogin1.bodyObj).toStrictEqual({
      token: resRegister1.bodyObj.token,
      authUserId: resRegister1.bodyObj.authUserId
    });
    const resLogin2 = postLogin('auth/login/v2', {
      email: 'jamie.wong1@unsw.edu.au',
      password: '1234567892',
    });
    expect(resLogin2.status).toStrictEqual(OK);
    expect(resLogin2.bodyObj).toStrictEqual({
      token: resRegister2.bodyObj.token,
      authUserId: resRegister2.bodyObj.authUserId
    });
    const resLogin3 = postLogin('auth/login/v2', {
      email: 'vanessa.wong1@unsw.edu.au',
      password: '123456789',
    });
    expect(resLogin3.status).toStrictEqual(OK);
    expect(resLogin3.bodyObj).toStrictEqual({
      token: resRegister3.bodyObj.token,
      authUserId: resRegister3.bodyObj.authUserId
    });
  });
});
