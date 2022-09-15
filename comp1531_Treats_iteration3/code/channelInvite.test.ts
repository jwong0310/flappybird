import request from 'sync-request';
import config from '../config.json';

const port = config.port;
const url = config.url;

const OK = 200;

// helper functions
// 1. channelinvitev2: POST
const postChannelInvite = (path: string, body: {token: string, channelId: number, uId: number}) => {
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
  expect(res.statusCode).toStrictEqual(OK);
  const bodyObj = JSON.parse(res.body.toString());
  return bodyObj;
};

// 2. authRegister: POST
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
  expect(res.statusCode).toStrictEqual(OK);
  const bodyObj = JSON.parse(res.body.toString());
  return bodyObj;
};

// 3. channelsCreatev2: POST
const postChannelCreate = (path: string, body: {token: string, name: string, isPublic: boolean}) => {
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
  expect(res.statusCode).toStrictEqual(OK);
  const bodyObj = JSON.parse(res.body.toString());
  return bodyObj;
};

// 4. Clear function: DELETE
beforeEach(() => {
  request('DELETE', `${url}:${port}/clear/v1`);
});

// Tests
describe('Tests for /channel/invite/v2', () => {
  test('1. Testing for invalid token', () => {
    const res = postChannelInvite('channel/invite/v2', {
      token: '-1',
      channelId: 1,
      uId: 0
    });
    expect(res).toEqual({ error: 'error' });
  });
  test('2. Testing for invalid channelId', () => {
    const res = postChannelInvite('channel/invite/v2', {
      token: '-1',
      channelId: 0,
      uId: 0
    });
    expect(res).toEqual({ error: 'error' });
  });

  test('3. Testing for invalid uId', () => {
    const user = postRegister('auth/register/v2', {
      email: 'niranjana.arunmenon@unsw.edu.au',
      password: 'orangeH04',
      nameFirst: 'Nira',
      nameLast: 'Arun Menon',
    });
    const channel = postChannelCreate('channels/create/v2', {
      token: user.token,
      name: 'Oranges',
      isPublic: false
    });
    const res = postChannelInvite('channel/invite/v2', {
      token: user.token,
      uId: 15,
      channelId: channel.channelId
    });
    expect(res).toEqual({ error: 'error' });
  });

  test('4. Testing if uId contains characters', () => {
    const user = postRegister('auth/register/v2', {
      email: 'niranjana.arunmenon@unsw.edu.au',
      password: 'orangeH04',
      nameFirst: 'Nira',
      nameLast: 'Arun Menon',
    });
    const channel = postChannelCreate('channels/create/v2', {
      token: user.token,
      name: 'Oranges',
      isPublic: false
    });
    const res = postChannelInvite('channel/invite/v2', {
      token: user.token,
      uId: 1,
      channelId: channel.channelId
    });
    expect(res).toEqual({ error: 'error' });
  });

  test('5. Testing if uId is already in the channel', () => {
    const user = postRegister('auth/register/v2', {
      email: 'niranjana.arunmenon@unsw.edu.au',
      password: 'orangeH04',
      nameFirst: 'Nira',
      nameLast: 'Arun Menon',
    });
    const channel = postChannelCreate('channels/create/v2', {
      token: user.token,
      name: 'Oranges',
      isPublic: true
    });
    const res = postChannelInvite('channel/invite/v2', {
      token: user.token,
      uId: 1,
      channelId: channel.channelId
    });
    expect(res).toEqual({ error: 'error' });
  });

  test('6. Successful case', () => {
    const firstUser = postRegister('auth/register/v2', {
      email: 'niranjana.arunmenon@unsw.edu.au',
      password: 'orangeH04',
      nameFirst: 'Nira',
      nameLast: 'Arun Menon',
    });
    const secondUser = postRegister('auth/register/v2', {
      email: 'hannah.baker@unsw.edu.au',
      password: 'banannas',
      nameFirst: 'Hannah',
      nameLast: 'Baker'
    });
    const channel = postChannelCreate('channels/create/v2', {
      token: firstUser.token,
      name: 'Speaches',
      isPublic: false
    });
    const res = postChannelInvite('channel/invite/v2', {
      token: firstUser.token,
      channelId: channel.channelId,
      uId: secondUser.authUserId
    });
    expect(res).toEqual({});
  });

  test('7. Testing duplicate invites', () => {
    const Woody = postRegister('auth/register/v2', {
      email: 'sheriff.woody@andysroom.com',
      password: 'qazwsx!!',
      nameFirst: 'sheriff',
      nameLast: 'woody'
    });

    const Buzz = postRegister('auth/register/v2', {
      email: 'buzz.lightyear@starcommand.com',
      password: 'qazwsx@@',
      nameFirst: 'buzz',
      nameLast: 'lightyear'
    });

    const channel = postChannelCreate('channels/create/v2', {
      token: Woody.token,
      name: 'woodys toybox',
      isPublic: true
    });

    postChannelInvite('channel/invite/v2', {
      token: Woody.token,
      channelId: channel.channelId,
      uId: Buzz.authUserId
    });

    const res = postChannelInvite('channel/invite/v2', {
      token: Woody.token,
      channelId: channel.channelId,
      uId: Buzz.authUserId
    });

    expect(res).toEqual({ error: 'error' });
  });
});
