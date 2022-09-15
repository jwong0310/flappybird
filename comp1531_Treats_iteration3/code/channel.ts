import { getData } from './dataStore';
import HTTPError from 'http-errors';

export interface error {
    error: string
}

export const channelInvite = {};
export interface channelMessagesV2 {
  messages: {
    messageId: number,
    uId: number,
    message: string,
    timeSent: number
  }[],
  start: number,
  end: number
}
/// ///////////////////////////////////////////////////////////////////////////////////////////
/* Invites a user with ID uId to join a channel with ID channelId. Once invited,
*  the user is added to the channel immediately. In both public and private channels,
*  all members are able to invite users.
*
* // Arguments:
*  <name>      (<data type>) - <description>
* token        (string)      - token of the said user
* channelId    (integer)     - Id of channel
* uId          (integer)     - Id of user

* // Return Values:
* // Returns {error: 'error' } if uId or token does not exist.
* // Returns {error: 'error'} if user (uId) already exists in channel.
* // Returns {error: 'error'} if channelId is valid but uId does not exist in channel.
* // Returns {} if channelId and uId is valid, user does not exist in channel.
*/

const channelInviteV1 = (token: string, channelId: number, uId: number): error | typeof channelInvite => {
  const data = getData();
  // token is invalid
  // userId does not exist
  if (data.users.find((user) => { return user.token === token; }) === undefined ||
  data.users.find((user) => { return user.uId === uId; }) === undefined) {
    return { error: 'error' };
  }

  // user is already in the channel
  if (data.channels[channelId].members.allMembers.find((allMember) => { return allMember.uId === uId; }) !== undefined) {
    return { error: 'error' };
  }

  const index = data.users.findIndex((user) => {
    return user.token === token;
  });

  // userId of the person who passed the token
  const ownerId = data.users[index].uId;

  // invite has already been given to the user
  if (data.channels[channelId].members.owners.find((owner) => { return owner.uId === ownerId; }).uId === ownerId &&
      data.channels[channelId].channelId === channelId &&
      data.channels[channelId].members.allMembers.find((allMember) => { return allMember.uId === ownerId; }) !== undefined) {
    return { error: 'error' };
  }

  // channelId is valid but user is not in the channel: otherwise
  data.channels[channelId].members.allMembers.push({ uId: data.users[index].uId });

  return {};
};

function channelMessagesV1(token: string, channelId: number, start: number): channelMessagesV2 | error {
  const data = getData();
  const channelData = data.channels;
  const userData = data.users;

  // return error if channelId does not refer to a valid channel
  if (channelData.find(function(channelNum) {
    return channelNum.channelId === channelId;
  }) === undefined) {
    throw HTTPError(400, 'ChannelID does not exist.');
  }

  // return error if start index is greater than the total number of messages in channel
  if (start > channelData.find(function(channelNum) {
    return channelNum.channelId === channelId;
  }).messages.length) {
    throw HTTPError(400, 'Start is greater than total number of messages in channel.');
  }

  // return error if channelId is valid and authuser is not a member of the channel
  const membersInChannel = channelData.find(function(member) {
    return member.channelId === channelId;
  });

  const uIdOfToken = userData.find(function(user) {
    return user.token === token;
  }).uId;

  if (channelData.find(function(channelNum) {
    return channelNum.members.allMembers.find(function(member) {
      return member.uId === uIdOfToken;
    });
  }) === undefined &&
  channelData.find(function(channelNum) {
    return channelNum.members.owners.find(function(member) {
      return member.uId === uIdOfToken;
    });
  }) === undefined) {
    throw HTTPError(403, 'ChannelID is valid but user is not a member.');
  }

  // if there are no messages, set start = 0 and end = -1;
  let startIndex = 0;
  let endIndex = startIndex + 50;
  if (channelData.find(function(message) {
    return message.channelId === channelId;
  }).messages.length === 0) {
    startIndex = 0;
    endIndex = -1;
  }

  // initialise new array and push sorted messages according to timeSent
  const messageArray = [];
  for (let messageIndex = 0; messageIndex < channelData.find(function(message) {
    return message.channelId === channelId;
  }).messages.length; messageIndex++) {
    messageArray.push(channelData.find(function(message) {
      return message.channelId === channelId;
    }).messages[messageIndex]);
  }

  messageArray.sort(function(a, b) {
    return b.timeSent - a.timeSent;
  });

  if (channelData.find(function(message) {
    return message.channelId === channelId;
  }).messages.length !== 0) {
    if (messageArray.length < start + 50) {
      endIndex = -1;
    } else {
      endIndex = start + 50;
    }
  }

  // return messsages between start and end indices if end < messageArray.length
  const messagesBetweenIndices = [];
  if (endIndex === -1) {
    for (start = 0; start < messageArray.length; start++) {
      messagesBetweenIndices.push(messageArray[start]);
    }
  } else if (endIndex === start + 50) {
    for (start = 0; start < endIndex; start++) {
      messagesBetweenIndices.push(messageArray[start]);
    }
  }

  return {
    messages: messagesBetweenIndices,
    start: startIndex,
    end: endIndex
  };
}
export { channelInviteV1, channelMessagesV1 };
