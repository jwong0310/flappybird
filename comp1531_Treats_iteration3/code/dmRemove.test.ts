import request from 'sync-request';
import config from '../config.json';

const port = config.port;
const url = config.url;

// Helper function for clear
beforeEach(() => {
  request('DELETE', `${url}:${port}/clear/v1`);
});

afterEach(() => {
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
  const bodyObj = JSON.parse(String(res.getBody()));
  return bodyObj;
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
  const bodyObj = JSON.parse(String(res.getBody()));
  return bodyObj;
};

// Helper function for dmRemove/DELETE
const removeDms = (path: string, qs: {token: string, dmId: number}) => {
  const res = request(
    'DELETE',
    `${url}:${port}/${path}/`,
    {
      qs: qs
    }
  );
  const bodyObj = JSON.parse(String(res.getBody()));
  return bodyObj;
};

// Helper function for dmLeave/POST
const postDmLeave = (path: string, body: {token: string, dmId: number}) => {
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
  const bodyObj = JSON.parse(String(res.getBody()));
  return bodyObj;
};

describe('Test Cases for DM Remove', () => {
  test('test for valid dm removal', () => {
    const resRegister1 = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister1).toStrictEqual(
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
    expect(resRegister2).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resDmCreate = postDmCreate('dm/create/v1', {
      token: resRegister1.token,
      uIds: [resRegister2.authUserId]
    });
    expect(resDmCreate).toStrictEqual(
      expect.objectContaining({
        dmId: expect.any(Number)
      })
    );
    const resDmRemove = removeDms('dm/remove/v1', {
      token: resRegister1.token,
      dmId: resDmCreate.dmId
    });
    expect(resDmRemove).toStrictEqual({});
  });
  test('test for invalid dmId', () => {
    const resRegister1 = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister1).toStrictEqual(
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
    expect(resRegister2).toStrictEqual(
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
    expect(resRegister3).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resDmCreate = postDmCreate('dm/create/v1', {
      token: resRegister1.token,
      uIds: [resRegister2.authUserId, resRegister3.authUserId]
    });
    expect(resDmCreate).toStrictEqual(
      expect.objectContaining({
        dmId: expect.any(Number)
      })
    );
    const resDmRemove = removeDms('dm/remove/v1', {
      token: resRegister1.token,
      dmId: 123
    });
    expect(resDmRemove).toStrictEqual({ error: 'error' });
  });
  test('test for user of tokenId is not the owner of DM', () => {
    const resRegister1 = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister1).toStrictEqual(
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
    expect(resRegister2).toStrictEqual(
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
    expect(resRegister3).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resDmCreate = postDmCreate('dm/create/v1', {
      token: resRegister2.token,
      uIds: [resRegister3.authUserId]
    });
    expect(resDmCreate).toStrictEqual(
      expect.objectContaining({
        dmId: expect.any(Number)
      })
    );
    const resDmRemove = removeDms('dm/remove/v1', {
      token: resRegister1.token,
      dmId: resDmCreate.dmId
    });
    expect(resDmRemove).toStrictEqual({ error: 'error' });
  });
  test('test for user of tokenId no longer in DM', () => {
    const resRegister1 = postRegister('auth/register/v2', {
      email: 'jacky.wong1@unsw.edu.au',
      password: '123456789010',
      nameFirst: 'jacky',
      nameLast: 'wong',
    });
    expect(resRegister1).toStrictEqual(
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
    expect(resRegister2).toStrictEqual(
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
    expect(resRegister3).toStrictEqual(
      expect.objectContaining({
        token: expect.any(String),
        authUserId: expect.any(Number)
      })
    );
    const resDmCreate = postDmCreate('dm/create/v1', {
      token: resRegister2.token,
      uIds: [resRegister1.authUserId, resRegister3.authUserId]
    });
    expect(resDmCreate).toStrictEqual({ dmId: 0 });
    const resDmLeave = postDmLeave('dm/leave/v1', {
      token: resRegister1.token,
      dmId: resDmCreate.dmId
    })
    expect(resDmLeave).toStrictEqual({});
    const resDmRemove = removeDms('dm/remove/v1', {
      token: resRegister1.token,
      dmId: resDmCreate.dmId
    });
    expect(resDmRemove).toStrictEqual({ error: 'error' });
  });
});
