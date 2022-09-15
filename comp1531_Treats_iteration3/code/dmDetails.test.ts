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

// Helper function for dmCreate/POST
const postDmCreate = (path: string, body: {token: string, uIds: number[]}) => {
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

// Helper function for dmList/GET
const getDmList = (path: string, qs: {token: string}) => {
  const res = request(
    'GET',
      `${url}:${port}/${path}`,
      {
        qs: qs,
      }
  );
  const status = res.statusCode;
  if (status !== OK) {
    return {status};
  }
  const bodyObj = JSON.parse(String(res.getBody()));
  return {bodyObj, status}
};

// Helper function for dmDetails/GET
const getDmDetails = (path: string, qs: {token: string, dmId: number}) => {
  const res = request(
    'GET',
      `${url}:${port}/${path}`,
      {
        qs: qs,
      }
  );
  const status = res.statusCode;
  if (status !== OK) {
    return {status};
  }
  const bodyObj = JSON.parse(String(res.getBody()));
  return {bodyObj, status}
};

describe('Test Cases for DM Details', () => {
  test('valid details of DMs with new user', () => {
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
      password: '123456789',
      nameFirst: 'jamie',
      nameLast: 'wong',
    });
    expect(resRegister2.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resDmCreate = postDmCreate('dm/create/v1', {
      token: resRegister1.bodyObj.token,
      uIds: [resRegister2.bodyObj.authUserId]
    });
    expect(resDmCreate.bodyObj).toStrictEqual(
      expect.objectContaining({
        dmId: expect.any(Number)
      })
    );
    const resDmDetails = getDmDetails('dm/details/v1', {
      token: resRegister1.bodyObj.token,
      dmId: resDmCreate.bodyObj.dmId
    });
    expect(resDmDetails.status).toStrictEqual(OK);
    expect(resDmDetails.bodyObj).toStrictEqual({
      name: [expect.any(String), expect.any(String)],
      members: [
        {
          uId: resRegister1.bodyObj.authUserId,
          email: expect.any(String),
          nameFirst: expect.any(String),
          nameLast: expect.any(String),
          handleStr: expect.any(String),
          token: resRegister1.bodyObj.token
        },
        {
          uId: resRegister2.bodyObj.authUserId,
          email: expect.any(String),
          nameFirst: expect.any(String),
          nameLast: expect.any(String),
          handleStr: expect.any(String),
          token: resRegister2.bodyObj.token
        }
      ]
    });
  });
  test('test for invalid dmId', () => {
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
      password: '123456789',
      nameFirst: 'jamie',
      nameLast: 'wong',
    });
    expect(resRegister2.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resDmCreate = postDmCreate('dm/create/v1', {
      token: resRegister1.bodyObj.token,
      uIds: [resRegister2.bodyObj.authUserId]
    });
    expect(resDmCreate.bodyObj).toStrictEqual(
      expect.objectContaining({
        dmId: expect.any(Number)
      })
    );
    const resDmDetails = getDmDetails('dm/details/v1', {
      token: resRegister1.bodyObj.token,
      dmId: 123
    });
    expect(resDmDetails.status).toStrictEqual(badRequest);
  });
  test('dmId is valid but authorised user is not a member of DM', () => {
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
      password: '123456789',
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
      password: '1234567890102',
      nameFirst: 'vanessa',
      nameLast: 'wong',
    });
    expect(resRegister3.bodyObj).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resDmCreate = postDmCreate('dm/create/v1', {
      token: resRegister1.bodyObj.token,
      uIds: [resRegister2.bodyObj.authUserId]
    });
    expect(resDmCreate.bodyObj).toStrictEqual(
      expect.objectContaining({
        dmId: expect.any(Number)
      })
    );
    const resDmDetails = getDmDetails('dm/details/v1', {
      token: resRegister3.bodyObj.token,
      dmId: resDmCreate.bodyObj.dmId
    });
    expect(resDmDetails.status).toStrictEqual(restrictedAccess);
  });
});