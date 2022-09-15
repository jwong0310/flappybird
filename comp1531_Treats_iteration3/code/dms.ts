import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

export interface error {
error: string
}
export interface dmCreateV1 {
dmId: number
}

export interface dmListV1 {
dms: {
dmId: number,
name: string[],
owner: number,
members: {
uId: number,
email: string,
nameFirst: string,
nameLast: string,
handleStr: string,
password: string,
token: string
}[]
}[]
}

export interface dmDetailsV1 {
name: string[],
members: {
uId: number,
email: string,
nameFirst: string,
nameLast: string,
handleStr: string,
password: string,
token: string
}[]
}

interface Message {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number;
  reacts: {
    reactId: number,
    uIds: number[],
    isThisUserReacted: boolean,
  }[],
  isPinned: boolean
}

export interface dmMessages {
messages: Message[],
start: number,
end: number
}

export interface dmSend {

}

export const dmRemoveV1 = {} as Record<string, never>;

export const dmLeaveV1 = {} as Record<string, never>;

/* Creates a direct message with one or more registered users.
 * Only an autherised user with a valid token can create this direct message.
 */
// Arguments:
// <name> (<data type>) <description>
// token (string)   identifies autherised user's online/offline status
// uIds  (number[]) array of user IDs

// Return Values:
// Returns {error: 'error'} on invalid token
// Returns {error: 'error'} if uId in uIds array does not exist in dataStore
// Returns {error: 'error'} if uId of dm creator is in uIds array
// Returns {     dmId     } on valid token and uIds array.

function dmCreate(token: string, uIds: number[]): error | dmCreateV1 {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;

  // if token does not correlate to a registered user, return error
  if (userData.find(function(userToken) {
    return userToken.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Token is invalid.');
  }

  // if uId in uIds array does not exist in user data, return error
  for (let userIdIndex = 0; userIdIndex < uIds.length; userIdIndex++) {
    if (userData.find(function(userId) {
      return userId.uId === uIds[userIdIndex];
    }) === undefined) {
      throw HTTPError(400, 'uId is invalid.');
    }
  }

  // if creator uId is in uIds array, return error
  for (let userIdIndex = 0; userIdIndex < uIds.length; userIdIndex++) {
    if (userData.find(function(userId) {
      return userId.token === token;
    }).uId === uIds[userIdIndex]) {
      throw HTTPError(400, 'Creator uId cannot be part of uIds.');
    }
  }

  // if uId has been called repeatedly in uId array, return error
  const findDuplicates = (uIds: number[]) => uIds.filter((uId: number, uIdIndex: number) => uIds.indexOf(uId) !== uIdIndex);
  if (findDuplicates(uIds).length > 0) {
    throw HTTPError(400, 'uId already exists.');
  }

  // add creator user object to memberArray
  const memberArray = [];
  memberArray.push(userData.find(function(member) {
    return member.token === token;
  }));

  // add creator's handle string to dmName
  const dmName = [];
  dmName.push(userData.find(function(creator) {
    return creator.token === token;
  }).handleStr);

  // if uId is not a registered user
  // or creator uId is in uIds array, return error
  for (let userIndex = 0; userIndex < userData.length; userIndex++) {
    for (let userIdIndex = 0; userIdIndex < uIds.length; userIdIndex++) {
      if (userData[userIndex].uId === uIds[userIdIndex] && userData[userIndex].token !== token) {
        memberArray.push(userData.find(function(userId) {
          return userId.uId === uIds[userIdIndex];
        }));
        dmName.push(userData.find(function(userId) {
          return userId.uId === uIds[userIdIndex];
        }).handleStr);
      }
    }
  }
  // sort dmName array alphabetically
  dmName.sort();

  // if dmName array already exists, return error
  if (dmData.length !== 0) {
    let dmExists = true;
    for (let dmDataIndex = 0; dmDataIndex < dmData.length; dmDataIndex++) {
      for (let dmNameIndex = 0; dmNameIndex < dmName.length; dmNameIndex++) {
        if (dmName[dmNameIndex] !== dmData[dmDataIndex].name[dmNameIndex]) {
          dmExists = false;
        }
      }
    }
    if (dmExists === true) {
      throw HTTPError(400, 'DM already exists.');
    }
  }
  // creating dmId value
  const directMessageIdValue = Object.keys(dmData).length;

  // ownerHandle string correlated to the token
  const ownerUid = userData.find(function(userName) {
    return userName.token === token;
  }).uId;

  data.dms.push({
    dmId: directMessageIdValue,
    name: dmName,
    owner: ownerUid,
    members: memberArray,
    messages: []
  });
  return { dmId: directMessageIdValue };
}

/* Returns list of dms given a valid token
*/
// Arguments:
// <name> (<data type>) <description>
// token (string) - identifies autherised user's online/offline status

// Return Values:
// Returns {error: 'error'} on invalid token
// Returns {              } on valid token

function dmList(token: string): error | dmListV1 {
  const data = getData();
  const dataUsers = data.users;
  const dataDms = data.dms;
  // if token does not correlate to a registered user, return error
  if (dataUsers.find(function(userToken) {
    return userToken.token === token;
  }) === undefined) {
    // console.log('error0');
    throw HTTPError(403, 'Token is invalid.');
  }

  const listOfDmsWithUser = [];
  // returns rm array if user is in dm, returns empty array otherwise
  for (let index = 0; index < dataDms.length; index++) {
    for (let indexMembers = 0;
      indexMembers < dataDms[index].members.length; indexMembers++) {
      delete dataDms[index].members[indexMembers].password;
      if (dataDms[index].members[indexMembers].token === token) {
        listOfDmsWithUser.push(dataDms[index]);
      }
    }
  }
  return { dms: listOfDmsWithUser };
}

/* Returns details of dm given valid token and dmId
*/
// Arguments:
// <name> (<data type>) <description>
// token (string) - identifies autherised user's online/offline status
// dmId  (number) - id of direct message

// Return Values:
// Returns {error: 'error'} if dmId does not exist in dataStore
// Returns {error: 'error'} if dmId is valid but uId is not a member of dm
// Returns {name , members} on valid token and dmId

function dmDetails(token: string, dmId: number): error | dmDetailsV1 {
  const data = getData();
  const dataDms = data.dms;

  // dmId does not exist in dm array, return error
  if (dataDms.find(function(userToken) {
    return userToken.dmId === dmId;
  }) === undefined) {
    throw HTTPError(400, 'dmID is invalid.');
  }

  // dmId is valid but user id not a member of DM, return error
  let isMember = false;
  for (let index = 0; index < dataDms.length; index++) {
    for (let indexMembers = 0;
      indexMembers < dataDms[index].members.length; indexMembers++) {
      if (dataDms[index].members[indexMembers].token === token) {
        isMember = true;
      }
    }
  }
  if (!isMember) {
    // console.log('error1');
    throw HTTPError(403, 'Not a member of DM.');
  }

  const dmDetails = [];
  for (let index = 0; index < dataDms.length; index++) {
    for (let indexMembers = 0;
      indexMembers < dataDms[index].members.length; indexMembers++) {
      delete dataDms[index].members[indexMembers].password;
      if (dataDms[index].members[indexMembers].token === token) {
        dmDetails.push(dataDms[index]);
      }
    }
  }
  const nameOfDms = dmDetails.find(function(dm) {
    return dm.dmId === dmId;
  }).name;

  const membersOfDms = dmDetails.find(function(dm) {
    return dm.dmId === dmId;
  }).members;

  return { name: nameOfDms, members: membersOfDms };
}

/* Returns details of dm given valid token and dmId
*/
// Arguments:
// <name> (<data type>) - <description>
// token (string) - identifies autherised user's online/offline status
// dmId  (number) - id of direct message

// Return Values:
// Returns {error: 'error'} if dmId does not exist in dataStore
// Returns {error: 'error'} if dmId is valid but uId is not a member of dm
// Returns {name , members} on valid token and dmId

function dmRemove(token: string, dmId: number): error | Record<string, never> {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;

  // return error if dmId does not belong list of dms
  if (dmData.find(function(user) {
    return user.dmId === dmId;
  }) === undefined) {
    // console.log('error0');
    throw HTTPError(400, 'dmId is invalid.');
  }

  // return error is token is unregistered
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Token is invalid.');
  }

  // return error if token is not owner of DM
  const tokenUserId = userData.find(function(user) {
    return user.token === token;
  }).uId;

  if (dmData.find(function(dm) {
    return dm.owner === tokenUserId;
  }) === undefined) {
    throw HTTPError(403, 'User is not owner of DM.');
  }

  // return error if dmId exists but auth user is not in DM
  let isMember = false;
  for (let index = 0; index < dmData.length; index++) {
    for (let indexMembers = 0;
      indexMembers < dmData[index].members.length; indexMembers++) {
      if (dmData[index].members[indexMembers].token === token) {
        isMember = true;
      }
    }
  }
  if (!isMember) {
    throw HTTPError(403, 'dmId is not an authorised user.');
  }

  // return {} otherwise
  // set length of dmData to 0
  dmData.length = 0;
  setData(data);
  return {};
}

/* Returns empty object when given valid token and dmId
*/
// Arguments:
// <name> (<data type>) - <description>
// token (string) - identifies autherised user's online/offline status
// dmId  (number) - id of direct message

// Return Values:
// Returns {error: 'error'} if dmId does not exist in dataStore
// Returns {error: 'error'} if dmId is valid but uId is not a member of dm
// Returns {              } on valid token and dmId
function dmLeave(token: string, dmId: number): error | Record<string, never> {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;

  //  return error if dmId does not belong
  if (dmData.find(function(userToken) {
    return userToken.dmId === dmId;
  }) === undefined) {
    throw HTTPError(400, 'dmId is invalid.');
  }
  // dmId is valid but user id not a member of DM, return error
  let isMember = false;
  for (let index = 0; index < dmData.length; index++) {
    for (let indexMembers = 0;
      indexMembers < dmData[index].members.length; indexMembers++) {
      if (dmData[index].members[indexMembers].token === token) {
        isMember = true;
      }
    }
  }
  if (!isMember) {
    throw HTTPError(400, 'Not a member of DM.');
  }

  // access member array and filter and push array without the corresponding token
  const memberRemaining = dmData.find(function(dmElement) {
    return dmElement.dmId === dmId;
  }).members.filter(member => member.token !== token);

  dmData[dmId].members.length = 0;
  for (const member of memberRemaining) {
    dmData[dmId].members.push(member);
  }

  setData(data);
  return {};
}

function finddmId(dmId: number) {
  const data = getData();
  return data.dms.find(a => a.dmId === dmId);
}

function findToken(token: string) {
  const data = getData();
  return data.users.find(a => a.token === token);
}
/*
Send a message from authorisedUser to the DM specified by dmId.
Note: Each message should have it's own unique ID,
i.e. no messages should share an ID with another message,
even if that other message is in a different channel or DM.
*/
function dmSendV1(token: string, dmId: number, message: string): dmSend | error {
  const data = getData();
  // dmId does not refer to a valid DM
  if (!finddmId(dmId)) {
    return { error: 'error' };
  }

  // length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    return { error: 'error' };
  }

  // dmId is valid and the authorised user is not a member of the DM
  let isMember = false;
  if (finddmId(dmId) && findToken(token)) {
    for (const dm of data.dms) {
      for (const member of dm.members) {
        if (member.token === token) {
          isMember = true;
        }
      }
    }
  }
  if (isMember === false) {
    return { error: 'error' };
  }

  const NewmessageId = Math.floor(Math.random() * 10000) + 1;
  const timestamp = Math.floor((new Date()).getTime() / 1000);
  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      for (const member of dm.members) {
        if (member.token === token) {
          dm.messages.push({
            messageId: NewmessageId,
            uId: member.uId,
            message: message,
            timeSent: timestamp,
            reacts: [],
            isPinned: false
          });
          return { messageId: NewmessageId };
        }
      }
    }
  }
}


/*
Given a DM with ID dmId that the authorised user is a member of,
return up to 50 messages between index "w" and "start + 50".
Message with index 0 is the most recent message in the DM.
This function returns a new index "end" which is the value of "start + 50", or,
if this function has returned the least recent messages in the DM,
returns -1 in "end" to indicate there are no more messages to load after this return.
*/
function dmMessagesV1(token: string, dmId: number, start: number): dmMessages | error {
  const data = getData();
  const startValue = start;
  const endValue = -1;

  // Case 1: dmId does not refer to a valid dm
  const validDmIds = [];

  for (let i = 0; i < data.dms.length; i++) {
    const nextDm = data.dms[i].dmId;
    validDmIds.push(nextDm);
  }

  if (validDmIds.includes(dmId) === false) {
    return { error: 'error' };
  }

  // Case 2: Start is Greater than the total number of messages in the dm
  let numberOfMessages = 0;
  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      numberOfMessages = dm.messages.length;
    }
  }

  if (startValue > numberOfMessages) {
    return { error: 'error' };
  }

  // Case 3: dmId is valid but authorised user is not a member of the dm
  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      const validDmId = Object.values(dm.members);

      let x = 0;
      let validity = 0;
      while (x < validDmId.length) {
        if (validDmId[x].token === token) {
          validity = 1;
        }
        x++;
      }
      if (validity === 0) {
        return { error: 'error' };
      }
    }
  }

  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      return {
        messages: dm.messages.map(a => ({
          messageId: a.messageId,
          uId: a.uId,
          message: a.message,
          timeSent: a.timeSent,
          reacts: [],
          isPinned: false
        })),
        start: startValue,
        end: endValue,
      };
    }
  }
}




export { dmCreate, dmList, dmDetails, dmRemove, dmLeave, dmSendV1, dmMessagesV1 };
 // (1) channelId does not refer to valid channel
 if (data.channels.every((channel: Channel) => channel.channelId !== channelId)) {
  throw HTTPError(400, 'channelId is invalid.');
}

// (2) uId does not refer to valid user
if (data.users.every((user: User) => user.uId !== uId)) {
  throw HTTPError(400, 'uId is invalid.');
}

// (3) uId refers to a user who is not a member of the channel
const channel = data.channels.find((channel: Channel) => channel.channelId === channelId);
if (channel.members.allMembers.every((member: { uId: number }) => member.uId !== uId)) {
  throw HTTPError(403, 'User is not a member of the channel.');
}

// (4) uId refers to a user who is already an owner of the channel
if (channel.members.owners.some((owner: User) => owner.uId === uId)) {
  throw HTTPError(400, 'User is already the owner.');
}

// (5) channelId is valid and the authorised user does not have owner permissions in the channel
const tokenUser: User = data.users.find((user: User) => user.token === token);
if (channel.members.owners.every((owner: User) => {
  return owner.uId !== tokenUser.uId;
})) {
  throw HTTPError(403, 'Authorised user does not have owner permissions to this channel.');