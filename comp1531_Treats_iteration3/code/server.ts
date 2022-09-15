import express from 'express';
import morgan from 'morgan';
import HttpError from 'http-errors';
import errorHandler from 'middleware-http-errors';
import config from './config.json';
import { authLoginV1, authLogoutV1, authRegisterV1 } from './auth';
import { dmCreate, dmDetails, dmLeave, dmList, dmMessagesV1, dmRemove, dmSendV1 } from './dms';
import { clearV1 } from './other';
import { echo } from './echo';
import { userProfileV1, usersAllV1, userSetNameV1, userSetMailV1, userSetHandleV1 } from './users';
import { channelsCreateV1 } from './channels';
import { channelInviteV1, channelMessagesV1 } from './channel';
import { messageEdit, messagePinned, messageReact, messageSend, messageUnpinned, messageUnreact } from './message';
import { saveData } from './dataStore';

// Set up node-cron
const cron = require('node-cron');

// Set up web app, use JSON
const app = express();
app.use(express.json());

export const PORT: number = parseInt(process.env.PORT || config.port);
export const HOST: string = process.env.IP || 'localhost';

// Save state of treats every minute
cron.schedule('* * * * *', () => {
  saveData();
});

// Clear http server
app.delete('/clear/v1', (req, res) => {
  res.json(clearV1());
});

// Auth
// AuthRegister
app.post('/auth/register/v2', (req, res) => {
  const { email, password, nameFirst, nameLast } = req.body;
  // const { token, authU} = authRegisterV1(email, password, nameFirst, nameLast);
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});
// AuthLogin
app.post('/auth/login/v2', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  res.json(authLoginV1(email, password));
});
// AuthLogout
app.post('/auth/logout/v1', (req, res) => {
  const token = req.body.token;
  res.json(authLogoutV1(token));
});

// DMs
// dmCreate
app.post('/dm/create/v1', (req, res) => {
  const { token, uIds } = req.body;
  res.json(dmCreate(token, uIds));
});
// dmList
app.get('/dm/list/v1', (req, res) => {
  const token = req.query.token as string;
  res.json(dmList(token));
});
// dmDetails
app.get('/dm/details/v1', (req, res) => {
  const token = req.query.token as string;
  const dmId = Number(req.query.dmId);
  res.json(dmDetails(token, dmId));
});
// dmRemove
app.delete('/dm/remove/v1', (req, res) => {
  const token = req.query.token as string;
  const dmId = Number(req.query.dmId);
  res.json(dmRemove(token, dmId));
});
// dmLeave
app.post('/dm/leave/v1', (req, res) => {
  const { token, dmId } = req.body;
  res.json(dmLeave(token, dmId));
});
// dmSend
app.post('/message/senddm/v1', (req, res) => {
  const { token, dmId, message } = req.body;
  res.json(dmSendV1(token, dmId, message));
});
// dm/messages/v2
app.get('/dm/messages/v1', (req, res) => {
  const token = req.query.token as string;
  const dmId = Number(req.query.dmId);
  const start = Number(req.query.dmId);
  res.json(dmMessagesV1(token, dmId, start));
});


// Echo Test

app.get('/echo', (req, res, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// Channels
// ChannelsCreateV1
app.post('/channels/create/v2', (req, res) => {
  const { token, name, isPublic } = req.body;
  res.json(channelsCreateV1(token, name, isPublic));
});

// Channel
// channelInvite
app.post('/channel/invite/v2', (req, res) => {
  const { token, channelId, uId } = req.body;
  res.json(channelInviteV1(token, channelId, uId));
});
// channelMessages
app.get('/channel/messages/v2', (req, res) => {
  const token = req.query.token as string;
  const channelId = Number(req.query.channelId);
  const start = Number(req.query.start);
  res.json(channelMessagesV1(token, channelId, start));
});

// Users
// UserProfile
app.get('/user/profile/v2', (req, res) => {
  const token = req.query.token as string;
  const uId = req.query.uId as string;
  const user = parseInt(uId);
  res.json(userProfileV1(token, user));
});
// UsersAllV1
app.get('/users/all/v1', (req, res) => {
  const token = req.query.token as string;
  res.json(usersAllV1(token));
});
// UserSetNameV1
app.put('/user/profile/setname/v1', (req, res) => {
  const { token, nameFirst, nameLast } = req.body;
  res.json(userSetNameV1(token, nameFirst, nameLast));
});
// UserSetMail
app.put('/user/profile/setmail/v1', (req, res) => {
  const { token, email } = req.body;
  res.json(userSetMailV1(token, email));
});
// UserSetHandle
app.put('/user/profile/sethandle/v1', (req, res) => {
  const { token, handleStr } = req.body;
  res.json(userSetHandleV1(token, handleStr));
});

// Messages
// messageSend
app.post('/message/send/v1', (req, res) => {
  const { token, channelId, message } = req.body;
  res.json(messageSend(token, channelId, message));
});
// messageEdit  
app.put('/message/edit/v1', (req, res) => {
  const { token, messageId, message } = req.body;
  res.json(messageEdit(token, messageId, message));
});
// messageReact  
app.post('/message/react/v1', (req, res) => {
  const { token, messageId, reactId } = req.body;
  res.json(messageReact(token, messageId, reactId));
});
// messageUnreact  
app.post('/message/unreact/v1', (req, res) => {
  const { token, messageId, reactId } = req.body;
  res.json(messageUnreact(token, messageId, reactId));
});
// messagePinned  
app.post('/message/pin/v1', (req, res) => {
  const { token, messageId } = req.body;
  res.json(messagePinned(token, messageId));
});
// messageUnpinned  
app.post('/message/unpin/v1', (req, res) => {
  const { token, messageId } = req.body;
  res.json(messageUnpinned(token, messageId));
});

// for error handling
app.use(errorHandler());

// for logging errors
app.use(morgan('dev'));

// start server
app.listen(PORT, HOST, () => {
  console.log(`Server listening on port ${PORT} at ${HOST}`);
});
