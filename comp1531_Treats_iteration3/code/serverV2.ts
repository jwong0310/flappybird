import express from 'express';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { authLoginV1, authLogoutV1, authRegisterV3 } from './auth';
import { dmCreate, dmDetails, dmList, dmRemove, dmLeaveV1, dmMessagesV1, dmSendV1 } from './dms';
import { messageSendV2, messageEditV2, messageRemoveV2, messagePinnedV1, messageUnpinnedV1, messageReactV1, messageUnreactV1 } from './message';
import { clearV1 } from './other';
import { echo } from './echo';
import { userProfileV1, usersAllV1, userSetNameV1, userSetMailV1, userSetHandleV1 } from './users';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from './channels';
import {
  channelDetailsV1,
  channelInviteV1,
  channelJoinV1,
  channelLeaveV1,
  channelAddOwnerV1,
  channelRemoveOwnerV1,
  channelMessagesV1
} from './channel';
import { saveData } from './dataStore';

// Set up node-cron
const cron = require('node-cron');

// Set up web app, use JSON
const app = express();
app.use(express.json());
// Use middleware that allows for access from other domains
app.use(cors());

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

// AuthRegister http server route
app.post('/auth/register/v2', (req, res) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV3(email, password, nameFirst, nameLast));
});

// AuthLogin http server route
app.post('/auth/login/v2', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  res.json(authLoginV1(email, password));
});

// AuthLogout http server route
app.post('/auth/logout/v1', (req, res) => {
  const token = req.headers.token;
  res.json(authLogoutV1(token));
});

// DMs
// dmCreate http server route
app.post('/dm/create/v1', (req, res) => {
  const { token, uIds } = req.body;
  // const uIds = req.body;
  // const token = req.header('token');
  res.json(dmCreate(token, uIds));
});

// dmList http server route
app.get('/dm/list/v1', (req, res) => {
  const token = req.query.token as string;
  res.json(dmList(token));
});

// dmDetails http server route
app.get('/dm/details/v1', (req, res) => {
  const token = req.query.token as string;
  const dmId = Number(req.query.dmId);
  res.json(dmDetails(token, dmId));
});

// dmRemove http server route
app.delete('/dm/remove/v1', (req, res) => {
  const token = req.query.token as string;
  const dmId = Number(req.query.dmId);
  res.json(dmRemove(token, dmId));
});

// dmLeave http server route
app.post('/dm/leave/v1', (req, res) => {
  const { token, dmId } = req.body;
  res.json(dmLeaveV1(token, dmId));
});

// dmMessages http server route
app.get('/dm/messages/v1', (req, res) => {
  const token = req.query.token as string;
  const dmId = Number(req.query.dmId);
  const start = Number(req.query.start);
  res.json(dmMessagesV1(token, dmId, start));
});

// dmSend http server route
app.post('/message/senddm/v1', (req, res) => {
  const { token, dmId, message } = req.body;
  res.json(dmSendV1(token, dmId, message));
});

// Messages
// messageReact
app.post('/message/react/v1', (req, res) => {
  const { token, messageId, reactId } = req.body;
  res.json(messageReactV1(token, messageId, reactId));
});

// messageUnreact
app.post('/message/unreact/v1', (req, res) => {
  const { token, messageId, reactId } = req.body;
  res.json(messageUnreactV1(token, messageId, reactId));
});

// messagePinned
app.post('/message/pin/v1', (req, res) => {
  const { token, messageId } = req.body;
  res.json(messagePinnedV1(token, messageId));
});

// messageUnpinned
app.post('/message/unpin/v1', (req, res) => {
  const { token, messageId } = req.body;
  res.json(messageUnpinnedV1(token, messageId));
});

// messageSend http server route
app.post('/message/send/v2', (req, res) => {
  const { token, channelId, message } = req.body;
  res.json(messageSendV2(token, channelId, message));
});

// messageEdit http server route
app.put('/message/edit/v2', (req, res) => {
  const { token, messageId, message } = req.body;
  res.json(messageEditV2(token, messageId, message));
});

// messageRemove http server route
app.delete('/message/remove/v2', (req, res) => {
  const token = req.query.token;
  const messageId = req.query.messageId;
  res.json(messageRemoveV2(token as string, parseInt(messageId as string)));
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
// ChannelsCreateV1 http server route
app.post('/channels/create/v2', (req, res) => {
  const { token, name, isPublic } = req.body;
  res.json(channelsCreateV1(token, name, isPublic));
});

// ChannelsListV1 http server route
app.get('/channels/list/v2', (req, res) => {
  const token = req.query.token as string;
  res.json(channelsListV1(token));
});

// ChannelsListallV1 http server route
app.get('/channels/listall/v2', (req, res) => {
  const token = req.query.token as string;
  res.json(channelsListallV1(token));
});

// Channel
// channelInvite http server route
app.post('/channel/invite/v2', (req, res) => {
  const { token, channelId, uId } = req.body;
  res.json(channelInviteV1(token, channelId, uId));
});

// channelMessages http server route
app.get('/channel/messages/v2', (req, res) => {
  const token = req.query.token as string;
  const channelId = Number(req.query.channelId);
  const start = Number(req.query.start);
  res.json(channelMessagesV1(token, channelId, start));
});

// channelJoin http server route
app.post('/channel/join/v2', (req, res) => {
  const { token, channelId } = req.body;
  res.json(channelJoinV1(token, channelId));
});

// channelLeave http server route
app.post('/channel/leave/v1', (req, res) => {
  const { token, channelId } = req.body;
  res.json(channelLeaveV1(token, channelId));
});

// channelAddOwner http server route
app.post('/channel/addowner/v1', (req, res) => {
  const { token, channelId, uId } = req.body;
  res.json(channelAddOwnerV1(token, channelId, uId));
});

// channelRemoveOwner http server route
app.post('/channel/removeowner/v1', (req, res) => {
  const { token, channelId, uId } = req.body;
  res.json(channelRemoveOwnerV1(token, channelId, uId));
});

// channelDetails http server route
app.get('/channel/details/v2', (req, res) => {
  const { token, channelId } = req.query;
  res.json(channelDetailsV1(token as string, parseInt(channelId as string)));
});

// Users
// UserProfile http server route
app.get('/user/profile/v2', (req, res) => {
  const token = req.query.token as string;
  const uId = req.query.uId as string;
  const user = parseInt(uId);
  res.json(userProfileV1(token, user));
});

// UsersAllV1 http server route
app.get('/users/all/v1', (req, res) => {
  const token = req.query.token as string;
  res.json(usersAllV1(token));
});

// UserSetNameV1 http server route
app.put('/user/profile/setname/v1', (req, res) => {
  const { token, nameFirst, nameLast } = req.body;
  res.json(userSetNameV1(token, nameFirst, nameLast));
});

// UserSetMail http server route
app.put('/user/profile/setmail/v1', (req, res) => {
  const { token, email } = req.body;
  res.json(userSetMailV1(token, email));
});

// UserSetHandle http server route
app.put('/user/profile/sethandle/v1', (req, res) => {
  const { token, handleStr } = req.body;
  res.json(userSetHandleV1(token, handleStr));
});

// handles errors nicely
app.use(errorHandler());

// for logging errors
app.use(morgan('dev'));

// start server
const server = app.listen(parseInt(process.env.PORT || config.port), process.env.IP, () => {
  console.log(`M15B Server listening on port ${process.env.PORT || config.port}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
