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

// Helper function for messageSend/POST
const postMessageSend = (path: string, body: {token: string, channelId: number, message: string}) => {
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

// Helper function for message/senddm/v2
const postDmSend = (path: string, body: {token: string, dmId: number, message: string}) => {
  const res = request(
    'POST',
      `${url}:${port}/${path}/`,
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

// Helper function for message/pin/v1
const postMessagePinned = (path: string, body: {token: string, messageId: number}) => {
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

  // Helper function for message/pin/v1
const postMessageUnpinned = (path: string, body: {token: string, messageId: number}) => {
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


describe('Test cases for messageUnpinned', () => {
  test('Test successful message unpinned in a channel message', () => {
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
    const resMessageSend = postMessageSend('message/send/v1', {
        token: resRegister1.bodyObj.token,
        channelId: resChannelCreate.bodyObj.channelId,
        message: 'This is a message'
    })
    expect(resMessageSend.bodyObj).toStrictEqual(
        expect.objectContaining({
            messageId: expect.any(Number)
        })
    );
    const resMessagePin = postMessagePinned('message/pin/v1', {
			token: resRegister1.bodyObj.token,
			messageId: resMessageSend.bodyObj.messageId,
    })
    expect(resMessagePin.bodyObj).toStrictEqual({});
    const resMessageUnpin = postMessageUnpinned('message/unpin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resMessageSend.bodyObj.messageId,
    })
    expect(resMessageUnpin.status).toStrictEqual(OK);
    expect(resMessageUnpin.bodyObj).toStrictEqual({});
 });
 test('Test successful message unpinning in a dm message', () => {
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
	const resDmSend = postDmSend('message/senddm/v1', {
		token: resRegister1.bodyObj.token, 
		dmId: resDmCreate.bodyObj.dmId, 
		message: 'great'
	});
	expect(resDmSend.bodyObj).toStrictEqual(
		expect.objectContaining({
			messageId: expect.any(Number)
		})
	);
    const resMessagePin = postMessagePinned('message/pin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resDmSend.bodyObj.messageId,
    })
    expect(resMessagePin.bodyObj).toStrictEqual({});
    const resMessageUnpin = postMessageUnpinned('message/unpin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resDmSend.bodyObj.messageId,
    })
    expect(resMessageUnpin.status).toStrictEqual(OK);
    expect(resMessageUnpin.bodyObj).toStrictEqual({});
});
	test('Test for invalid messageId in channel', () => {
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
    const resMessageSend = postMessageSend('message/send/v1', {
        token: resRegister1.bodyObj.token,
        channelId: resChannelCreate.bodyObj.channelId,
        message: 'This is a message'
    })
    expect(resMessageSend.bodyObj).toStrictEqual(
        expect.objectContaining({
            messageId: expect.any(Number)
        })
    );
    const resMessagePin = postMessagePinned('message/pin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resMessageSend.bodyObj.messageId,
    })
    expect(resMessagePin.bodyObj).toStrictEqual({});
    const resMessageUnpin = postMessageUnpinned('message/unpin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: 1.32445566,
    })
    expect(resMessageUnpin.status).toStrictEqual(badRequest);
  });

	test('Test for invalid messageId in dms', () => {
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
    const resDmSend = postDmSend('message/senddm/v1', {
        token: resRegister1.bodyObj.token, 
        dmId: resDmCreate.bodyObj.dmId, 
        message: 'great'
    });
    expect(resDmSend.bodyObj).toStrictEqual(
        expect.objectContaining({
            messageId: expect.any(Number)
        })
    );
    const resMessagePin = postMessagePinned('message/pin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resDmSend.bodyObj.messageId,
    })
    expect(resMessagePin.bodyObj).toStrictEqual({});
    const resMessageUnpin = postMessageUnpinned('message/unpin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: 1.32445566,
    })
    expect(resMessageUnpin.status).toStrictEqual(badRequest);
  });
	test('test for channel message is not pinned', () => {
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
    const resMessageSend = postMessageSend('message/send/v1', {
        token: resRegister1.bodyObj.token,
        channelId: resChannelCreate.bodyObj.channelId,
        message: 'This is a message'
    })
    expect(resMessageSend.bodyObj).toStrictEqual(
        expect.objectContaining({
            messageId: expect.any(Number)
        })
    );
    const resMessagePin = postMessagePinned('message/pin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resMessageSend.bodyObj.messageId
    })
    expect(resMessagePin.bodyObj).toStrictEqual({});
    const resMessageUnpin1 = postMessageUnpinned('message/unpin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resMessageSend.bodyObj.messageId
    })
    expect(resMessageUnpin1.bodyObj).toStrictEqual({});
    const resMessageUnpin2 = postMessageUnpinned('message/unpin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resMessageSend.bodyObj.messageId
    })
    expect(resMessageUnpin2.status).toStrictEqual(badRequest);
  });
	test('test for dm message already pinned', () => {
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
    const resDmSend = postDmSend('message/senddm/v1', {
        token: resRegister1.bodyObj.token, 
        dmId: resDmCreate.bodyObj.dmId, 
        message: 'great'
    });
    expect(resDmSend.bodyObj).toStrictEqual(
        expect.objectContaining({
            messageId: expect.any(Number)
        })
    );
    const resMessagePin = postMessagePinned('message/pin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resDmSend.bodyObj.messageId
    })
    expect(resMessagePin.bodyObj).toStrictEqual({});
    const resMessageUnpin1 = postMessageUnpinned('message/unpin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resDmSend.bodyObj.messageId
    })
    expect(resMessageUnpin1.bodyObj).toStrictEqual({});
    const resMessageUnpin2 = postMessageUnpinned('message/unpin/v1', {
        token: resRegister1.bodyObj.token,
        messageId: resDmSend.bodyObj.messageId
    })
    expect(resMessageUnpin2.status).toStrictEqual(badRequest);
	});
    test('test for user does not have access to message to pin in dm', () => {
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
			password: '1234567189',
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
    const resDmSend = postDmSend('message/senddm/v1', {
        token: resRegister1.bodyObj.token, 
        dmId: resDmCreate.bodyObj.dmId, 
        message: 'great'
    });
    expect(resDmSend.bodyObj).toStrictEqual(
        expect.objectContaining({
            messageId: expect.any(Number)
        })
    );
    const resMessagePin = postMessagePinned('message/pin/v1', {
        token: resRegister2.bodyObj.token,
        messageId: resDmSend.bodyObj.messageId
    })
		expect(resMessagePin.bodyObj).toStrictEqual({});
		const resMessageUnpin = postMessageUnpinned('message/unpin/v1', {
			token: resRegister3.bodyObj.token,
			messageId: resDmSend.bodyObj.messageId
	})
    expect(resMessageUnpin.status).toStrictEqual(restrictedAccess);
    });
    test('Test for user does not have access to message to pin in channel', () => {
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
				token: resRegister1.bodyObj.token,
				name: 'channelName',
				isPublic: true,
			})
			expect(resChannelCreate.bodyObj).toStrictEqual(
				expect.objectContaining({
					channelId: expect.any(Number)
				})
			);
			const resMessageSend = postMessageSend('message/send/v1', {
        token: resRegister1.bodyObj.token,
        channelId: resChannelCreate.bodyObj.channelId,
        message: 'This is a message'
			})
			expect(resMessageSend.bodyObj).toStrictEqual(
        expect.objectContaining({
          messageId: expect.any(Number)
        })
			);
			const resMessagePin = postMessagePinned('message/pin/v1', {
				token: resRegister1.bodyObj.token,
				messageId: resMessageSend.bodyObj.messageId,
			})
			expect(resMessagePin.status).toStrictEqual(OK);
      const resMessageUnpin = postMessageUnpinned('message/unpin/v1', {
				token: resRegister2.bodyObj.token,
				messageId: resMessageSend.bodyObj.messageId,
			})
			expect(resMessageUnpin.status).toStrictEqual(restrictedAccess);
	 });
});
