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

// Helper function for channelCreate/GET
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
  const status = res.statusCode;
  if (status !== OK) {
    return {status};
  }
  const bodyObj = JSON.parse(String(res.getBody()));
  return {bodyObj, status}
};

// Helper function for channelMessages/GET
const getChannelMessages = (path: string, qs: {token: string, channelId: number, start: number}) => {
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

describe('Test cases for channelMessages', () => {
  test('Test empty message', () => {
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
    const resChannelCreate = postChannelCreate('channels/create/v2', {
      token: resRegister1.bodyObj.token,
      name: 'channelName',
      isPublic: true,
    })
    expect(resChannelCreate.bodyObj).toStrictEqual(
      expect.objectContaining({
        channelId: expect.any(Number)
      })
    );
    const resChannelMessages = getChannelMessages('channel/messages/v2', {
        token: resRegister1.bodyObj.token,
        channelId: resChannelCreate.bodyObj.channelId,
        start: 0
    })
    expect(resChannelMessages.status).toStrictEqual(OK);
    expect(resChannelMessages.bodyObj).toStrictEqual(
			expect.objectContaining({
				messages: [],
				start: 0,
				end: -1
			})
    );
  });
	test('Test for invalid channelId', () => {
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
    const resChannelCreate = postChannelCreate('channels/create/v2', {
      token: resRegister1.bodyObj.token,
      name: 'channelName',
      isPublic: true,
    })
    expect(resChannelCreate.bodyObj).toStrictEqual(
      expect.objectContaining({
        channelId: expect.any(Number)
      })
    );
    const resChannelMessages = getChannelMessages('channel/messages/v2', {
        token: resRegister1.bodyObj.token,
        channelId: 99999999999,
        start: 0
    })
    expect(resChannelMessages.status).toStrictEqual(badRequest);
  });
	test('Test for invalid start value', () => {
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
    const resChannelCreate = postChannelCreate('channels/create/v2', {
      token: resRegister1.bodyObj.token,
      name: 'channelName',
      isPublic: true,
    })
    expect(resChannelCreate.bodyObj).toStrictEqual(
      expect.objectContaining({
        channelId: expect.any(Number)
      })
    );
    const resChannelMessages = getChannelMessages('channel/messages/v2', {
        token: resRegister1.bodyObj.token,
        channelId: resChannelCreate.bodyObj.channelId,
        start: 99999999999
    })
    expect(resChannelMessages.status).toStrictEqual(badRequest);
  });
	test('Test for valid channelId but authUser is not member of channel', () => {
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
    const resChannelCreate = postChannelCreate('channels/create/v2', {
      token: resRegister2.bodyObj.token,
      name: 'channelName',
      isPublic: true,
    })
    expect(resChannelCreate.bodyObj).toStrictEqual(
      expect.objectContaining({
        channelId: expect.any(Number)
      })
    );
    const resChannelMessages = getChannelMessages('channel/messages/v2', {
        token: resRegister1.bodyObj.token,
        channelId: resChannelCreate.bodyObj.channelId,
        start: 0
    })
    expect(resChannelMessages.status).toStrictEqual(restrictedAccess);
  });
})