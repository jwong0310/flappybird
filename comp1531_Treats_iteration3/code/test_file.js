// YOU SHOULD MODIFY THIS OBJECT BELOW
let data = {
  'users': [],
  'channels': [/*
    {
      'channelId': 0,
      'name': 'Netflix-sub',
      'isPublic': true,

      // Rather than put in two distinct properties in channels, allMembers
      // and ownerMembers, members is made to be an array of objects containing
      // properties including owners and allMembersExclOwner. This prevents data
      // duplication.
      'members': {
          'owners': [
            {
              'uId': 0,
            },
          ],
          'allMembers': [
            {
              'uId': 0
            },
            { 
              'uId': 1,
            },
            
          ],
        },
      

      // Most recent message has messageId = 0, second-most recent
      // message has messageId = 1, etc...
      // Least recent message has highest messageId and can be accessed
      // by datastore.messages[-1]
      'messages': [
        {
          'messageId': 0,
          'uId': 0,     // refers to which user is the author of the message
          'message': 'this is a message',
          'timeSent': 1658809485, // exact timestamp UTC converted from 
          // Tue, 26 Jul 2022 04:24:45 GMT
        },
        {
          'messageId': 1,
          'uId': 0,     // refers to which user is the author of the message
          'message': 'this is a message',
          'timeSent': 1658809486, // exact timestamp UTC converted from 
          // Tue, 26 Jul 2022 04:24:45 GMT
        },
        {
          'messageId': 2,
          'uId': 0,     // refers to which user is the author of the message
          'message': 'this is a message',
          'timeSent': 1658809487, // exact timestamp UTC converted from 
          // Tue, 26 Jul 2022 0:24:45 GMT
        },
      ]
    }, 
    {
      // Newly created channel with one member and no messages...
      'channelId': 1,
      'name': 'Crunchies',
      'isPublic': false,
      'members': [
        {
          'owners': [
            {
              'uId': 0,
            }
          ],
          'allMembers': [
            {
              'uId': 0,
            }
          ],
        },
      ],
      'messages': [
        {
          'messageId': 0,
          'uId': 0,     // refers to which user is the author of the message
          'message': '',
          'timeSent': 1658809485, // exact timestamp UTC converted from 
          // Tue, 26 Jul 2022 04:24:45 GMT
        },
      ]
    },*/
  ],
  'dms': [/*
    {
      'dmId': 0,
      'owner': 'Jacky Wong',
      'members': [
        {
          'uId': 1,
          'handleStr': 'jamiewong',
          'token': 'Online 0'
        }
      ],
      'messages': [
      {
        'messageId': 0,
        'uId': 0,     // refers to which user is the author of the message
        'message': '',
        'timeSent': 1658809485, // exact timestamp UTC converted from 
        // Tue, 26 Jul 2022 04:24:45 GMT
      },
    ]

    }
  */]
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData) {
  data = newData;
}

  
  //export { getData, setData };

  import validator from 'validator';

  function authRegisterV1(email, password, nameFirst, nameLast) {
   
    if ((nameFirst.length <= 0 || nameFirst.length >= 50)) {
      return {error: 'error'};
    }
    if (nameLast.length < 0 || nameLast.length > 50) {
      return {error: 'error'};
    } 
    if (password.length < 6) {
      return {error: 'error'};
    } 
    if (validator.isEmail(email) !== true) {
      return {error: 'error'};
    } 
    const data = getData();
    // check for duplicate emails
    if (data.users.find((user) => user.email == email) != undefined) {
      console.log({error: 'error'});
      return {error: 'error'}; 
    }
    


  //2. include userHandle concatenation when user 
  // firstName and lastName has been used
  // Arbitrary allocation of userId
  // Incrementation of AuthId
  let newUserId = Object.keys(data.users).length;
  
  // User Handle for new User Id,
  let combinedNameHandle = nameFirst.toLowerCase() + nameLast.toLowerCase();
  let newUserHandle = combinedNameHandle.replace(/[^a-z]/gi, '');

  // If the user handle exceeeds 20 characters
  if (newUserHandle.length > 20) {
    newUserHandle = newUserHandle.substring(0,20);
  } 
  // If the concatenated user handle is still taken 
  if (data.users.find(function(element) {
    return element.handleStr === newUserHandle;
  }) !== undefined) {
    newUserHandle = newUserHandle + (newUserId - 1);
  }

  // Incrementation of Token for multiple users;
  let userToken = 'Online '+ Object.keys(data.users).length;

  
  data.users.push(
     {
      uId: newUserId,
      email: email,
      password: password,
      nameFirst: `${nameFirst}`,
      nameLast:`${nameLast}`,
      handleStr: newUserHandle,
      token: userToken
    },
  );
  const lastUserPos = data.users.length - 1;
  setData(data);
  //console.log([data.users.length]);
  //console.log(data)
  //console.log(data.users[lastUserPos].uId);
  return {
    token: userToken,
    authUserId: data.users[lastUserPos].uId
  }
}

//console.log(authRegisterV1('jacky4@unsw.edu.au', '12345678', 'jacky', 'wong'))
//console.log(data.users);
//console.log(authRegisterV1('jamie3@unsw.edu.au', '1234567821', 'jamie', 'wong'));
//console.log(data.users);
//console.log(authRegisterV1('vanessa2@unsw.edu.au', '123456782', 'vanessa', 'liu'));
//console.log(data.users);
/* Given a registered user's email and password, returns their `authUserId` value.
*/
// Arguments: 
// <name> (<data type>) - <description>
// email     (string) - registered user's email
// password  (string) - registered user's register and login password 

// Return Values:
// Returns {error: 'error'} if email does not belong to user 
// Returns {error: 'error'} if password is incorrect

function authLoginV1(email, password) {
  const data = getData();

  // return error when user is trying to log into an empty database
  if (data.users.length === 0) {
    return {error: 'error'};
  }
  // check if email is in database
  const lastUserPos = data.users.length - 1;
  let isValidEmail = false;
  for (let index = 0; index < data.users.length; index++) {
    if (data.users[index].email === email) {
       isValidEmail = true;
      }  
  }
  if (isValidEmail === false) {
    return {error: 'error'};
  }

   // check for valid password
  let isValidPassword = false;
  for (let index = 0; index < data.users.length; index++) {
    if (data.users[index].password === password) {
      isValidPassword = true;
    }
  }
  if (isValidPassword === false) {
    return {error: 'error'};
  }

  // return authUserId if email and password matches registered user
  // email and password
  let regId = data.users.find((user) => user.email == email).uId;
  let tokenId = 'Online '+ Object.keys(data.users).length;
  
  // re-assign token if user is logging back in 
  Object.keys(data.users).forEach(key => {
    if (data.users[key].email === email && data.users[key].token === null) {
      data.users[key].token = 'Online ' + data.users[key].uId;
    }
  })

  setData(data);
    return {
      authUserId: regId,
      token: tokenId
    }
  }

function authLogoutV1( token ) {
  const data = getData();
  const userData = data.users;
  //if token does not exist in dataUsers, return error
  if (data.users.find(function(user) {
    return user.token === token;
  }) === undefined) {
    console.log('error0');
    return {error: 'error'};
  }
// Invalid user token to NULL
Object.keys(userData).forEach(key => {
  if (userData[key].token === token) {
    userData[key].token = null;
  }
})

setData(data)
  //console.log(data);
  
  //data.users.find((user) => user.token === token).token == null;
  //console.log(data.users.find((user) => user.token === token).token)
  return {}
}



//data.users[lastUserPos].email != email
//console.log(authRegisterV1('z528@unss.edu', 'thisisfine', 'a', 'b'));
//console.log(authRegisterV1('blah1@gmail.com', 'qazwsx!!', 'sheriff', 'woody'));
//console.log(authRegisterV1('blah2@gmail.com', 'qazwsx!!!!', 'sheriff', 'woody'));
//console.log(authRegisterV1('blah3@gmail.com', 'qazwsx!!!!!', 'sheriff', 'woody'));
//console.log(authLoginV1('sheriff.woody@andysroom.com', 'qazwsx!!'));
//console.log(authLogoutV1('Online 0'));
//console.log(data.users)

//authLogoutV1('Online 1')
//authLogoutV1('Online 2')
//console.log(data)
//authLoginV1('jamie3@unsw.edu.au', '1234567821');
//authLoginV1('jacky4@unsw.edu.au', '12345678');
//authLoginV1('vanessa2@unsw.edu.au', '123456782');
//console.log(data)

/*
authRegisterV1('jacky1@unsw.edu.au', '12345678', 'JACKYabcdefghijklmnopq','WONG2');
authRegisterV1('james@unsw.edu.au', '12345678', 'james','WONG2');
authRegisterV1('bob@unsw.edu.au', '12345678', 'bob','WONG2');
authRegisterV1('tom@unsw.edu.au', '12345678', 'tom','WONG2');
authRegisterV1('tim@unsw.edu.au', '12345678', 'tim','WONG2');
authLoginV1('jacky1@unsw.edu.au', '12345678');
//authLoginV1('jacky@unsw.edu.au', '12345678');*/


function dmCreate(token, uIds) {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;

  // if token does not correlate to a registered user, return error
  if (userData.find(function(userToken) {
    return userToken.token === token;
  }) === undefined) {
    return { error: 'error' };
  }

  // if uId in uIds array does not exist in user data, return error
  for (let userIdIndex = 0; userIdIndex < uIds.length; userIdIndex++) {
    if (userData.find(function(userId) {
      return userId.uId === uIds[userIdIndex];
    }) === undefined) {
      return { error: 'error' };
    }
  }

  // if creator uId is in uIds array, return error
  for (let userIdIndex = 0; userIdIndex < uIds.length; userIdIndex++) {
    if (userData.find(function(userId) {
      return userId.token === token;
    }).uId === uIds[userIdIndex]) {
      return { error: 'error' };
    }
  }

  // if uId has been called repeatedly in uId array, return error
  const findDuplicates = uIds => uIds.filter((uId, uIdIndex) => uIds.indexOf(uId) !== uIdIndex);
  if (findDuplicates(uIds).length > 0) {
    return { error: 'error'}
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
      return {error: 'error123'};
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
console.log(authRegisterV1('sheriff.woody@andysroom.com', 'qazwsx!!f', 'abcdefghij', 'klmnopqrs'))
console.log(authRegisterV1('buzz.lightyear@starcommand.com', 'qazwsx@@', 'abcdefghij', 'klmnopqrs'));
console.log(authRegisterV1('sheriff.jessie@andysroom.com', 'qazwsx@@@', 'abcdefghijk', 'klmnopqrst'));
//console.log(data.users);
//console.log(authRegisterV1('sheriff.jessie@andysroom.com', 'qazwsx@@!', 'sheriff', 'jessie'));

//console.log(data.dms[0])
//console.log(dmCreate('Online 0', [1]));
//console.log(dmCreate('Online 0', [2]));
//console.log(data.dms[0].members)
//console.log(data.dms)
//console.log(dmCreate('Online 0', 1));
//console.log(dmCreate('Online 1', 0));

/*
const userProfileV1 = (token, uId) => {
  const data = getData();
  // returning the index at which authuserid or uid exists in the data.users object
  const userIndex = data.users.findIndex(user => {
    return user.uId === uId;
  });
  // return error message if neither exists
  if (data.users.find((user) => user.token === token) === undefined ||
      userIndex === undefined) {
    return { error: 'error' };
  } else {
    return {
      user: {
        uId: data.users[userIndex].uId,
        nameFirst: data.users[userIndex].nameFirst,
        nameLast: data.users[userIndex].nameLast,
        handleStr: data.users[userIndex].handleStr,
        email: data.users[userIndex].email,

      }
    };
  }
};

console.log(userProfileV1('Online 0', 0));
console.log(userProfileV1('Online 1', 1));

*/
/*
function dmLeave(token, dmId) {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  
  //  return error if dmId does not belong
  if (dmData.find(function(userToken) {
    return userToken.dmId === dmId;
  }) === undefined) {
    //console.log('error0');
    return {error: 'error'};
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
  if (!isMember ) {
   // console.log('error1');
    return {error: 'error1'}
  }

  // access member array and filter and push array without the corresponding dmId
  //let memberRemaining = []
  const memberRemaining = dmData.find(function(dmElement) {
    return dmElement.dmId === dmId;
  }).members.filter(member => member.token !== token);
  
  dmData[dmId].members.length = 0;
  for (let member of memberRemaining) {
    dmData[dmId].members.push(member);
  }

  setData(data);
  return {};
}
*/
/*
dmLeave('Online 1', 0);
console.log(data.dms[0].members);
console.log(data.dms[0]);*/



/*
function dmList(token) {
  const data = getData();
  const dataUsers = data.users;
  const dataDms = data.dms;
  // if token does not correlate to a registered user, return error
	if (dataUsers.find(function(userToken) {
		return userToken.token === token;
	}) === undefined) {
		//console.log('error0');
		return {error: 'error'};
	} 

  let listOfDmsWithUser = [];
  // returns rm array if user is in dm, returns empty array otherwise
  for (let index = 0; index < dataDms.length; index++) {
    for (let indexMembers = 0; 
      indexMembers < dataDms[index].members.length; indexMembers++) {
        if (dataDms[index].members[indexMembers].token === token) {
          listOfDmsWithUser.push(dataDms[indexMembers]);
        } 
      }
  }
  
  console.log(listOfDmsWithUser[0].members)
  return { dms: listOfDmsWithUser };
}


console.log(dmList('Online 0').dms);*/

//console.log(dmList('Online 1'));
//console.log(dmList('Online 0', 1));
/*
function dmDetails( token, dmId ) {
  const data = getData();
  const dataDms = data.dms;
  const dataUsers = data.users;

  // dmId does not exist in dm array, return error
  if (dataDms.find(function(userToken) {
		return userToken.dmId === dmId;
	}) === undefined) {
		//console.log('error0');
		return {error: 'error'};
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
  if (!isMember ) {
   // console.log('error1');
    return {error: 'error1'}
  }

  // return name and members in DM with corresponding dmId
  const uIdOfName = dataDms.find(function(dm) {
    return dm.dmId === dmId;
  }).members.find(function(member) {
    return member.uId;
  }).uId;

  // return corresponding first name of uId
  const nameFirstOfUser = dataUsers.find(function(user) {
    return user.uId === uIdOfName;
  }).nameFirst;

  // return corresponding last name of uId
  const nameLastOfUser = dataUsers.find(function(user) {
    return user.uId === uIdOfName;
  }).nameLast;

  // return corresponding members of dmId
  const membersInDm = dataDms.find(function(dm) {
    return dm.dmId === dmId;
  }).members;

  return { 
    name: `${nameFirstOfUser}` + ` ${nameLastOfUser}`,
    members: membersInDm
  };
}*/

//console.log(dmDetails('Online 0', 1));

function dmRemove( token, dmId ) {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;

  // return error if dmId does not belong list of dms
  if (dmData.find(function(user) {
    return user.dmId === dmId;
  }) === undefined) {
    //console.log('error0');
    return {error: 'error'};
  } 

  // return error is token is unregistered
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    return {error: 'error1'}
  }
  
  // return error if token is not owner of dm
  const tokenUserName = userData.find(function(user) {
    return user.token === token;
  }).handleStr;

  if (dmData.find(function(dm) {
    return dm.owner === tokenUserName;
  }) === undefined) {
    return {error: 'error2'};
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
    if (!isMember ) {
      return {error: 'error3'}
    }

  // return {} otherwise
  // set length of dmData to 0 
  dmData.length = 0;
  //const removeData = dmData;
  //console.log(dmData);
  setData(data);
  return {}
}
/*
console.log(dmCreate('Online 0', [1, 2]));
console.log(dmLeave('Online 0', 0));
console.log(data.dms[0]);
console.log(dmRemove('Online 0', 0));*/
//console.log(data.dms[0]);
//console.log(data.dms[0].members);




/*
//import { getData, setData } from './dataStore';
import { channelsListV1 } from './channels';

/**
 * Given a channel with ID channelId that the authorised user is a member of,
 * returns an object providing basic details about the object including its
 * name, public/private status, owner ids and member ids.
 * 
 * Arguments:
 *  authUserId (Number) - uId of an existing user
 *  channelId  (Number) - id of an existing channel
 * 
 * Return value:
 *  Returns { error: 'error' } on channelId not referring to a valid channel
 *  Returns { error: 'error' } on authUserId referring to user that is not a
 *  member of the channel.
 *  Returns { names, isPublic, ownerMembers, allMembers } on success
 

function channelDetailsV1(authUserId, channelId) {
  const data = getData();
  ////////////// ERROR CHECKING //////////////
  // CASE 1: channelId does not refer to valid channel
  if (data.channels.every((channel) => {
    return channelId !== channel.channelId;
  })) {
    return { error: 'error' };
  }

  // CASE 2: channelId is valid and the authorised user is not a 
  // member of the channel
  const user_member_check = (
    data.channels[channelId].members.allMembers.every((member) => {
      return member.uId !== authUserId;
    }) && 
    data.channels[channelId].members.owners.every((member) => {
      return member.uId !== authUserId;
    }));

  if (user_member_check) {
    return { error: 'error' };
  }

  /////////////// END OF ERROR CHECKING //////////////

  const dataChannel = data.channels[channelId];

  const allMembersChannel = [];
  const ownerMembersChannel = [];

  dataChannel.members.allMembers.forEach((member) => {
    const user = data.users.find((user) => {
      return user.uId === member.uId;
    });
    allMembersChannel.push(user);
  });

  dataChannel.members.owners.forEach((owner) => {
    const user = data.users.find((user) => {
      return user.uId === owner.uId;
    });
    ownerMembersChannel.push(user);
  });

  // assumption: allMembers and ownerMembers will be in ascending order of uId
  allMembersChannel.sort((memberA, memberB) => {
    return memberA.uId > memberB.uId ? 1 : -1;
  });

  ownerMembersChannel.sort((ownerA, ownerB) => {
    return ownerA.uId > ownerB.uId ? 1 : -1;
  });

  return {
    name: dataChannel.name,
    isPublic: dataChannel.isPublic,
    ownerMembers: ownerMembersChannel,
    allMembers: allMembersChannel,
  };
}

function channelJoinV1(authUserId, channelId) {
  const data = getData();
  const channelList = data.channels;

  // Invalid channel. Iterates thru channels[index].channelid, returns if no match.

  if (data.channels.every((channel) => {
    return channelId !== channel.channelId;
  })) {
    return { error: 'error' };
  }

  // Invalid authId - already a member. Proceeded from matched channelId.
  // checks array of owners / all members to match authUserId. 

  const owner_matchAuthId = (
    channelList[channelId].members.owners.find((owner) => {
      return owner.uId === authUserId;
    }));
  
  const member_matchAuthId = (
    channelList[channelId].members.allMembers.find((member) => {
      return member.uId === authUserId;
    }));

  if (owner_matchAuthId != null || member_matchAuthId != null) {
    return { error: 'error' };
    // Channel is private and returns error if bool isPublic == false.
  } else if (channelList[channelId].isPublic === false) {
      return { error: 'error' };
  } else {
    // No error matched - pushes authUserId to all members array, within the 
    // matched channelId
    channelList[channelId].members.allMembers.push({
      'uId': authUserId,
    });
  } 
      
}

//////////////////////////////////////////////////////////////////////////////////////////////
/* Invites a user with ID uId to join a channel with ID channelId. Once invited, 
*  the user is added to the channel immediately. In both public and private channels, 
*  all members are able to invite users.

// Arguments: 
// <name>       (<data type>) - <description>
// authUserId   (integer)     - Id of user calling the function/navigating the interface
// channelId    (integer)     - Id of channel
// uId          (integer)     - Id of user

// Return Values:
// Returns {error: 'error'} on empty channelId or empty uId input.
// Returns {error: 'error'} if channelId input or uId input contains an alphabetical character.
// Returns {error: 'error'} if user (uId) already exists in channel.
// Returns {error: 'error'} if channelId is valid but authUserId does not exist in channel.
// Returns {} if channelId and uId is valid, user does not exist in channel, and authUserId
// exists in channel.

function channelInviteV1(authUserId, channelId, uId) {
	
  // channelId or uId is an empty input
  if (channelId === '' || uId === '') {
    return {error: 'error'};
  }

  // channelId or uId is contains an alphabetical character
  if (/[a-zA-Z]/.test(channelId) || /[a-zA-Z]/.test(uId)) {
    return {error: 'error'};
  }

  // user is already in the channel
	const channelDets = channelDetailsV1(authUserId, channelId);
	const channelList = channelsListV1(authUserId);
	if (uId == channelDets.allMembersExclOwners.find(function(element) {
		return element.hasOwnProperty("uId");
	}).uId) {
		return {error: 'error'};
	}

	// channelId is valid but authUser is not in the channel
	if (channelId == channelList.channels.find(function(element) {
			return element.hasOwnProperty("channelId");
				}).channelId &&
				authUserId != channelDets.allMembersExclOwners.find(function(element) {
					return element.hasOwnProperty("uId");
				}).uId) {
		return {error: 'error'};
	}
	
  const data = getData();
	delete data.users[uId].password;
	data.channels[channelId].members.allMembersExclOwners.push(data.users)

	return {};  
}
*/

function channelsCreateV1(token, name, isPublic) {
  /// /////////// ERROR CHECKING //////////////
  // CASE: length of name is less than 1 or more than 20 characters

  if (name.length < 1 || name.length > 20) {
    return { error: 'error' };
  }

  /// /////////// END ERROR CHECKING //////////////

  //
  const data = getData();
  const userObject = data.users.find((user) => {
    return user.token === token;
  });
  const duplicateChannel = data.channels.find((channel) => {
    return channel.name === name;
  });

  // If no user is associated with the authUserId, then ???
  // In there exists a duplicate channel, the user associated with
  // authUserId is added to owners
  if (userObject == null) {
    return { error: 'error' }; // ???
  } else if (duplicateChannel != null) {
    duplicateChannel.members.owners.push({
      uId: userObject.uId,
    });
    duplicateChannel.members.owners.sort((memberA, memberB) => {
      return memberA.uId > memberB.uId ? 1 : -1;
    });
    return { channelId: duplicateChannel.channelId };
  }

  const index = data.users.findIndex((user) => {
    return user.token === token;
  });

  const newChannelId = data.channels.length ? data.channels.at(-1).channelId + 1 : 0;
  data.channels.push({
    channelId: newChannelId,
    name: name,
    isPublic: isPublic,
    members: {
      owners: [{
        uId: data.users[index].uId,
      }],
      allMembers: [],
    },
    messages: [],
  });
  return { channelId: newChannelId };
};

function channelMessagesV1(token, channelId, start) {

  const data = getData();
  const channelData = data.channels;
  const userData = data.users;

  // return error if channelId does not refer to a valid channel 
  if (channelData.find(function(channelNum) {
    return channelNum.channelId === channelId;
  }) === undefined) {
    return {error: 'error1'};
  }

  // return error if start index is greater than the total number of messages in channel 
  if (start > channelData.find(function(channelNum) {
    return channelNum.channelId === channelId;
  }).messages.length) {
    return {error: 'error2'};
  }

  // return error if channelId is valid and authuser is not a member of the channel 
  const membersInChannel = channelData.find(function(member) {
    return member.channelId === channelId;
  })
  const uIdOfToken = userData.find(function(user) {
    return user.token === token;
  }).uId

  if (channelData.find(function(channelNum) {
    return channelNum.members.allMembers.find(function(member) {
      return member.uId === uIdOfToken;
    })
  }) === undefined 
  && channelData.find(function(channelNum) {
    return channelNum.members.owners.find(function(member) {
      return member.uId === uIdOfToken;
    })
  }) === undefined) {
    return {error: 'error43'};
  }
  
  let startIndex = 0;
  let endIndex = startIndex + 50;
  // if there are no messages, set start = 0 and end = -1;
  if (channelData.find(function(message) {
    return message.channelId === channelId;
  }).messages.length === 0) {
    startIndex = 0;
    endIndex = -1;
  }

  // initialise new array and push sorted messages according to timeSent
  let messageArray = [];
  for (let messageIndex = 0; messageIndex < channelData.find(function(message) {
    return message.channelId === channelId;
  }).messages.length; messageIndex++) {
      messageArray.push(channelData.find(function(message) {
        return message.channelId === channelId;
      }).messages[messageIndex]);
  }

  messageArray.sort(function(a, b) {
    return b.timeSent - a.timeSent;
  })

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
  let messagesBetweenIndices = [];
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
channelsCreateV1('Online 0', 'thisChannel', true);
channelsCreateV1('Online 1', 'anotherChannel', true);

channelMessagesV1('Online 0', 0, 0);
channelMessagesV1('Online 1', 1, 0);  

//export { channelDetailsV1, channelJoinV1, channelInviteV1, /*channelMessagesV1 };

function messageSend(token, channelId, message) {
  const data = getData();
  const channelData = data.channels;
  const dmData = data.dms;
  const userData = data.users;
  // return error if channelId is invalid
  if (channelData.find(function(channelNum) {
    return channelNum.channelId === channelId;
  }) === undefined) {
    return {error: 'error'};
  }

  // return error if token is invalid
    if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    return {error: 'error'};
  }

  // return error if message.length is < 1 or > 1000ccharacters
  if (message.length < 1 || message.length > 1000) {
    return {error: 'error'};
  }

  // return error if channelId is valid and authuser is not a member of the channel 
  const membersInChannel = channelData.find(function(member) {
    return member.channelId === channelId;
  })

  const uIdOfToken = userData.find(function(user) {
    return user.token === token;
  }).uId

  if (channelData.find(function(channelNum) {
    return channelNum.members.allMembers.find(function(member) {
      return member.uId === uIdOfToken;
    })
  }) === undefined 
  && channelData.find(function(channelNum) {
    return channelNum.members.owners.find(function(member) {
      return member.uId === uIdOfToken;
    })
  }) === undefined) {
    return {error: 'error'};
  }

  // pushes new message objects into data.channel[channelId].messages
  let messageIDNum = channelData.find(function(channel) {
    return channel.channelId === channelId;
  }).messages.length;

  // checks if messageId already exists in dmMessage, if so increment messageId 
  // for channelMessage
  if (/*dmData.find(function(dm) {
    return dm.messages.find(function(message) {
      return message.messageId === messageIDNum;
    })
  }) !== undefined
    ||*/ channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageIDNum;
      })
    }) !== undefined) {
    messageIDNum++;
  }

  // get timestamp of message
  let dateOfMessage = new Date();
  let getTime = dateOfMessage.getTime()/1000;
  let messageTimeStampUTC = Math.floor(getTime);

  channelData[channelId].messages.push({
      messageId: messageIDNum,
      uId: uIdOfToken,
      message: message,
      timeSent: messageTimeStampUTC,
      reacts: [],
      isPinned: false
  })
  setData(data);
  return { messageId: messageIDNum}

}
//console.log(messageSend('Online 0', 0, 'This is a message'));
//console.log(messageSend('Online 0', 1, 'This is a new message'));
//console.log(messageSend('Online 1', 0, 'This is another message'));
//console.log(messageSend('Online 0', 0, 'This is also a message'));
//console.log(messageSend('Online 0', 0, 'This is another message'));
//console.log(data.channels[0]);

function messageEdit(token, messageId, message) {
  const data = getData();
  const channelData = data.channels;
  const userData = data.users;

  // return error if message.length is < 1 or > 1000ccharacters
  if (message.length < 1 || message.length > 1000) {
    return {error: 'error0'};
  }

  // return error if invalid token
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    return {error: 'error0.5'};
  }

  // return error if messageId does not exist in message array
  if (channelData.find(function(channel) {
    return channel.messages.find(function(messageNum) {
      return messageNum.messageId === messageId;
    })
  }) === undefined) {
    return {error: 'error1'};
  }

  const authUserTokenUid = userData.find(function(user) {
    return user.token === token;
  }).uId;
  
  // return error if authUser does not belong in channel.owner
  if (channelData.find(function(channel) {
    return channel.members.owners.find(function(member) {
      return member.uId === authUserTokenUid;
    })
  }) === undefined) {
    return {error: 'error3'};
  }
  
  // return error message uId does not match token requesting messageEdit
  if (channelData.find(function(channel) {
    return channel.messages.find(function(messageNum) {
      return messageNum.uId === authUserTokenUid;
    })
  }) === undefined) {
    return {error: 'error2'};
  }


  // replace current message with new message
  channelData.find(function(channel) {
    return channel.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }).messages[messageId].message = message;

  setData(data);

  return {};
}

//console.log(messageEdit('Online 0', 0, 'new message0'));
//console.log(messageEdit('Online 0', 0, 'new message1'));
//console.log(messageEdit('Online 0', 0, 'new message2'));
//console.log(messageEdit('Online 0', 0, 'new message3'));
//console.log(data.channels[0])
//console.log(messageEdit('Online 0', 0, 'f'.repeat(1001)));
//console.log(messageEdit('Online 0', 123, 'new message1'));
//console.log(messageEdit('Online 1', 0, 'new message'));
//console.log(messageEdit('Online 2', 0, 'new message2'));



/*let messageId = 0;

console.log(data.channels.find(function(channel) {
  return channel.messages[messageId].messageId === messageId;
}).messages[messageId].messageId)
*/
/*
console.log(data.channels.find(function(channel) {
  return channel.messages.find(function (message) {
    return message.messageId === messageId;
  })
}).messages[messageId].messageId)*/
//console.log(data.dms);
//console.log(data.channels[0].messages);

// function messageUnreact(token, messageId, reactId) {
//   const data = getData();
//   const userData = data.users;
//   const dmData = data.dms;
//   const channelData = data.channels;

//   const uIdOfToken = userData.find(function(user) {
//     return user.token === token;
//   }).uId

//   // return error if messageID is not valid within a channel or DM
//   if (/*dmData.find(function(dmMessage) {
//     return dmMessage.messages.find(function(message) {
//       return message.messageId === messageId;
//     })
//   }) === undefined
//     && */channelData.find(function(channel) {
//       return channel.messages.find(function(message) {
//         return message.messageId === messageId;
//       })
//     }) === undefined) {
//       return {error: 'error01'}
//     }

//   // return error reactId !== 1
//   if (reactId !== 1) {
//     return {error: 'error11'}
//   }
  
//   const messageWithMessageIdInChannel = channelData.find(function(channel) {
//     return channel.messages.find(function(message) {
//       return message.messageId === messageId;
//     })
//   }).messages; 

//   //console.log(messageWithMessageIdInChannel);

//   // return error if message contains an empty react array (nothing to unreact)
//   if (messageWithMessageIdInChannel.find(function(message) {
//     return message.messageId === messageId;
//   }).reacts.length === 0) {
//     return {error: 'error12'}
//   }


//   // return error if message does not contain a react with ID reactID from user
//   let reactExists = false;
//   for (let i = 0; i < messageWithMessageIdInChannel.find(function(message) {
//     return message.messageId === messageId;
//   }).reacts[reactId - 1].uIds.length; i++) {

//     if (messageWithMessageIdInChannel.find(function(message) {
//       return message.messageId === messageId;
//     }).reacts[reactId - 1].uIds[i] === uIdOfToken) {
//       reactExists = true;
//     }
//   }

//   if (reactExists = true) {
//     return {error: 'error13'}
//   }
  



  /*
  // return error if message has no reacts/no reacts to unreact
  const messageWithMessageIdInChannel = channelData.find(function(channel) {
    return channel.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }).messages;

  if (messageWithMessageIdInChannel.find(function(message) {
    return message.messageId === messageId;
  }).reacts[reactId - 1].uIds.length === 0) {
    
    messageWithMessageIdInChannel.find(function(message) {
      return message.messageId === messageId;
    }).reacts[reactId - 1].isThisUserReacted = false

  }

  if (messageWithMessageIdInChannel.find(function(message) {
    return message.messageId === messageId;
  }).reacts[reactId - 1].isThisUserReacted === false 
    && messageWithMessageIdInChannel.find(function(message) {
      return message.messageId === messageId;
    }).reacts[reactId - 1].uIds.length === 0) {
    
    return {error: 'error03'}
  }

  // access member array and filter and push array without the corresponding uId
  const membersRemaining = messageWithMessageIdInChannel.find(function(message) {
    return message.messageId === messageId;
  }).reacts[reactId - 1].uIds.filter(member => member !== uIdOfToken);

  messageWithMessageIdInChannel.find(function(message) {
    return message.messageId === messageId;
  }).reacts[reactId - 1].uIds.length = 0;

  //dmData[dmId].members.length = 0;
  for (let member of membersRemaining) {
    messageWithMessageIdInChannel.find(function(message) {
      return message.messageId === messageId;
    }).reacts[reactId - 1].uIds.push(member);
  }
  
  messageWithMessageIdInChannel.find(function(message) {
    return message.messageId === messageId;
  }).reacts[reactId - 1].isThisUserReacted = false;

  setData(data);
*/
//   return {}
// }



// function messagePinned(token, messageId) {
//   const data = getData();
//   const userData = data.users;
//   const dmData = data.dms;
//   const channelData = data.channels;

//   const uIdOfToken = userData.find(function(user) {
//     return user.token === token;
//   }).uId

//   // return error if messageID is not valid within a channel or DM
//   if (/*dmData.find(function(dmMessage) {
//     return dmMessage.messages.find(function(message) {
//       return message.messageId === messageId;
//     })
//   }) === undefined
//     && */channelData.find(function(channel) {
//       return channel.messages.find(function(message) {
//         return message.messageId === messageId;
//       })
//     }) === undefined) {
//       return {error: 'error01'}
//   }

//    // return error if message has is already pinned
//    const messageWithMessageIdInChannel = channelData.find(function(channel) {
//     return channel.messages.find(function(message) {
//       return message.messageId === messageId;
//     })
//   }).messages;

//   if (messageWithMessageIdInChannel.find(function(message) {
//     return message.messageId === messageId;
//   }).isPinned === true) {
//     return {error: 'error02'}
//   }
  
//   /*
//   if (channelData.find(function(channel) {
//     return channel.messages[messageId].messageId === messageId;
//   }).messages[messageId].isPinned !== undefined 
//   && channelData.find(function(channel) {
//       return channel.messages[messageId].messageId === messageId;
//     }).messages[messageId].isPinned === true
//     ) {
//       return {error: 'error02'}
//     }*/
  
//   // pin message, set isPinned to true
//   // create new object property for isPinned in channel or DM
//   messageWithMessageIdInChannel.find(function(message) {
//     return message.messageId === messageId;
//   }).isPinned = true;

//   setData(data);

//   return {}
// }

// //console.log(messagePinned('Online 0', 1))
// //console.log(data.channels[0].messages)

// function messageUnpinned(token, messageId) {
//   const data = getData();
//   const userData = data.users;
//   const dmData = data.dms;
//   const channelData = data.channels;

//   const uIdOfToken = userData.find(function(user) {
//     return user.token === token;
//   }).uId

//   // return error if messageID is not valid within a channel or DM
//   if (/*dmData.find(function(dmMessage) {
//     return dmMessage.messages.find(function(message) {
//       return message.messageId === messageId;
//     })
//   }) === undefined
//     && */channelData.find(function(channel) {
//       return channel.messages.find(function(message) {
//         return message.messageId === messageId;
//       })
//     }) === undefined) {
//       return {error: 'error01'}
//   }

//    // return error if message has is already pinned
//   if (channelData.find(function(channel) {
//     return channel.messages[messageId].messageId === messageId;
//   }).messages[messageId].isPinned !== undefined 
//   && channelData.find(function(channel) {
//       return channel.messages[messageId].messageId === messageId;
//     }).messages[messageId].isPinned === true
//     ) {
//       return {error: 'error02'}
//     }
  
//   // pin message, set isPinned to true
//   // create new object property for isPinned in channel or DM
//   let messageIsPinned = true;

//   if (channelData.find(function(channel) {
//     return channel.messages[messageId].messageId === messageId;
//   }).messages[messageId].isPinned === undefined) {
    

//     channelData.find(function(channel) {
//       return channel.messages[messageId].messageId === messageId;
//     }).messages[messageId].isPinned = messageIsPinned

//   }

//   setData(data);

//   return {}
// }

function finddmId(dmId) {
  const data = getData();
  return data.dms.find(a => a.dmId === dmId);
}

function findToken(token) {
  const data = getData();
  return data.users.find(a => a.token === token);
}

export function dmSendV1(token, dmId, message) {
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
          setData(data);
          return { messageId: NewmessageId };
        }
      }
    }
  }
}


//console.log(data.dms[0])

const reactId = 1;

function messageReact(token, messageId, reactId) {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  const channelData = data.channels;

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    return {error: 'error00'}
  }

  const uIdOfToken = userData.find(function(user) {
    return user.token === token;
  }).uId
  
  // return error if token is not in channel or DM
  // if ((channelData.find(function(channel) {
  //   return channel.members.owners.find(function(owner) {
  //     return owner.uId === uIdOfToken;
  //   })
  // }) === undefined
  //   && channelData.find(function(channel) {
  //     return channel.members.allMembers.find(function(member) {
  //       return member.uId === uIdOfToken;
  //       })
  //     }) === undefined)
  //   || (dmData.find(function(dm) {
  //       return dm.owner === uIdOfToken;
  //     }) === undefined
  //   && dmData.find(function(dm) {
  //     return dm.members;
  //   }).members.find(function(member) {
  //     return member.uId === uIdOfToken;
  //   }) === undefined)) {

  //     // console.log(dmData.find(function(dm) {
  //     //   return dm.members;
  //     // }).members.find(function(member) {
  //     //   return member.uId === uIdOfToken;
  //     // }))
  //     return {error: 'error000'}
  //   }

  if ((channelData.find(function(channel) {
    return channel.members.owners.find(function(owner) {
      return owner.uId === uIdOfToken;
    })
  }) === undefined
    && channelData.find(function(channel) {
      return channel.members.allMembers.find(function(member) {
        return member.uId === uIdOfToken;
        })
      }) === undefined)
    || (dmData.find(function(dm) {
        return dm.owner === uIdOfToken;
      }) === undefined
    && dmData.find(function(dm) {
      return dm.members.find(function(member) {
        return member.uId === uIdOfToken;
      });
    }) === undefined)) {

      // console.log(dmData.find(function(dm) {
      //   return dm.members;
      // }).members.find(function(member) {
      //   return member.uId === uIdOfToken;
      // }))
      return {error: 'error000'}
    }







  // return error if messageID is not valid within a channel or DM
  if (dmData.find(function(dmMessage) {
    return dmMessage.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }) === undefined
    && channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }) === undefined) {
      return {error: 'error01'}
    }

  // return error reactId !== 1
  if (reactId !== 1) {
    return {error: 'error11'}
  }

  let messageWithMessageId = 0;
  let uIdsReacted = [];
  let hasUserReacted = true;

  // locate messageId in channel messages 
  if (dmData.find(function(dmMessage) {
    return dmMessage.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }) === undefined) {

    messageWithMessageId = channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }).messages;

    // if a react from another user already exists
    if (messageWithMessageId.find(function(message) {
      return message.messageId === messageId;
    }).reacts.length !== 0) {

    // return error if react contains react from user
    for (let i = 0; i <  messageWithMessageId.find(function(dm) {
      return dm.messageId === messageId; 
    }).reacts[reactId - 1].uIds.length; i++) {

      if (messageWithMessageId.find(function(channel) {
        return channel.messageId === messageId; 
      }).reacts[reactId - 1].uIds[i] === uIdOfToken) {
        return {error: 'error112'}
      }

    }
      
      uIdsReacted = messageWithMessageId.find(function(dm) {
        return dm.messageId === messageId; 
      }).reacts[reactId - 1].uIds;
    }
  
    uIdsReacted.push(uIdOfToken);
  
    let messageWithReact = [
      {
        reactId: reactId,
        uIds: uIdsReacted,
        isThisUserReacted: hasUserReacted
      }
    ]

    messageWithMessageId.find(function(message) {
      return message.messageId === messageId;
    }).reacts = messageWithReact;

      // or locate messageId in dm messages
    } else if (channelData.find(function(channel) {
        return channel.messages.find(function(message) {
          return message.messageId === messageId;
        })
      }) === undefined) {

        messageWithMessageId = dmData.find(function(dm) {
          return dm.messages.find(function(message) {
            return message.messageId === messageId;
          })
        }).messages;

        // if a react from another user already exists
        if (messageWithMessageId.find(function(message) {
          return message.messageId === messageId;
        }).reacts.length !== 0) {
          // return error if react contains react from user
          for (let i = 0; i <  messageWithMessageId.find(function(dm) {
            return dm.messageId === messageId; 
          }).reacts[reactId - 1].uIds.length; i++) {
            
            if (messageWithMessageId.find(function(dm) {
              return dm.messageId === messageId; 
            }).reacts[reactId - 1].uIds[i] === uIdOfToken) {
              return {error: 'error113'}
            }
          } 
          
          uIdsReacted = messageWithMessageId.find(function(dm) {
            return dm.messageId === messageId; 
          }).reacts[reactId - 1].uIds;
        }
      
        uIdsReacted.push(uIdOfToken);
        //console.log(uIdsReacted)
      
        let messageWithReact = [
          {
            reactId: reactId,
            uIds: uIdsReacted,
            isThisUserReacted: hasUserReacted
          }
        ]

        messageWithMessageId.find(function(message) {
          return message.messageId === messageId;
        }).reacts = messageWithReact;

    }
    setData(data);

  return {}
}



function messageUnreact(token, messageId, reactId) {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  const channelData = data.channels;

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    return {error: 'error00'}
  }

  const uIdOfToken = userData.find(function(user) {
    return user.token === token;
  }).uId
  
  // return error if token is not in channel or DM
  if ((channelData.find(function(channel) {
    return channel.members.owners.find(function(owner) {
      return owner.uId === uIdOfToken;
    })
  }) === undefined
    && channelData.find(function(channel) {
      return channel.members.allMembers.find(function(member) {
        return member.uId === uIdOfToken;
        })
      }) === undefined)
    || (dmData.find(function(dm) {
        return dm.owner === uIdOfToken;
      }) === undefined
    && dmData.find(function(dm) {
      return dm.members;
    }).members.find(function(member) {
      return member.uId === uIdOfToken;
    }) === undefined)) {

      return {error: 'error000'}
    }

  // return error if messageID is not valid within a channel or DM
  if (dmData.find(function(dmMessage) {
    return dmMessage.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }) === undefined
    && channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }) === undefined) {
      return {error: 'error01'}
    }

  // return error reactId !== 1
  if (reactId !== 1) {
    return {error: 'error11'}
  }

  let messageWithMessageId = 0;
  let hasUserReacted = false;
  let membersRemaining = 0;

  // locate messageId in channel messages 
  if (dmData.find(function(dmMessage) {
    return dmMessage.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }) === undefined) {

    messageWithMessageId = channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }).messages;

    // if a react from another user already exists
    if (messageWithMessageId.find(function(message) {
      return message.messageId === messageId;
    }).reacts.length !== 0) {
      // return error if react does not contain react from user
      for (let i = 0; i <  messageWithMessageId.find(function(dm) {
        return dm.messageId === messageId; 
      }).reacts[reactId - 1].uIds.length; i++) {
        

        if (messageWithMessageId.find(function(dm) {
          return dm.messageId === messageId; 
        }).reacts[reactId - 1].uIds.find(function (uId) {
          return uId === uIdOfToken;
        }) === undefined) {
          return {error: 'React does not exist for user'}
        }
        } 
      
      membersRemaining = messageWithMessageId.find(function(dmElement) {
        return dmElement.messageId === messageId;
      }).reacts[reactId - 1].uIds.filter(uId => uId !== uIdOfToken);
      

    }

    let messageWithReact = [
      {
        reactId: reactId,
        uIds: membersRemaining,
        isThisUserReacted: hasUserReacted
      }
    ]

    messageWithMessageId.find(function(message) {
      return message.messageId === messageId;
    }).reacts = messageWithReact;

      // or locate messageId in dm messages
    } else if (channelData.find(function(channel) {
        return channel.messages.find(function(message) {
          return message.messageId === messageId;
        })
      }) === undefined) {

        messageWithMessageId = dmData.find(function(dm) {
          return dm.messages.find(function(message) {
            return message.messageId === messageId;
          })
        }).messages;

        // if a react from another user already exists
        if (messageWithMessageId.find(function(message) {
          return message.messageId === messageId;
        }).reacts.length !== 0) {
          // return error if react does not contain react from user
          for (let i = 0; i <  messageWithMessageId.find(function(dm) {
            return dm.messageId === messageId; 
          }).reacts[reactId - 1].uIds.length; i++) {
            

            if (messageWithMessageId.find(function(dm) {
              return dm.messageId === messageId; 
            }).reacts[reactId - 1].uIds.find(function (uId) {
              return uId === uIdOfToken;
            }) === undefined) {
              return {error: 'React does not exist for user'}
            }
           } 
          
          membersRemaining = messageWithMessageId.find(function(dmElement) {
            return dmElement.messageId === messageId;
          }).reacts[reactId - 1].uIds.filter(uId => uId !== uIdOfToken);
          
          // console.log(membersRemaining);
          

          // uIdsReacted = messageWithMessageId.find(function(dm) {
          //   return dm.messageId === messageId; 
          // }).reacts[reactId - 1].uIds;
        }
      
        //uIdsReacted.push(membersRemaining);
        //console.log(uIdsReacted)
      
        let messageWithReact = [
          {
            reactId: reactId,
            uIds: membersRemaining,
            isThisUserReacted: hasUserReacted
          }
        ]

        messageWithMessageId.find(function(message) {
          return message.messageId === messageId;
        }).reacts = messageWithReact;

    }
    setData(data);

  return {}
}


function messagePinned(token, messageId) {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  const channelData = data.channels;

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    return {error: 'error00'}
  }
  
  const uIdOfToken = userData.find(function(user) {
    return user.token === token;
  }).uId

  // return error if token is not in channel or DM
  if ((channelData.find(function(channel) {
    return channel.members.owners.find(function(owner) {
      return owner.uId === uIdOfToken;
    })
  }) === undefined
    && channelData.find(function(channel) {
      return channel.members.allMembers.find(function(member) {
        return member.uId === uIdOfToken;
        })
      }) === undefined)
    || (dmData.find(function(dm) {
        return dm.owner === uIdOfToken;
      }) === undefined
    && dmData.find(function(dm) {
      return dm.members;
    }).members.find(function(member) {
      return member.uId === uIdOfToken;
    }) === undefined)) {

      return {error: 'error000'}
    }

  // return error if messageID is not valid within a channel or DM
  if (dmData.find(function(dmMessage) {
    return dmMessage.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }) === undefined
    && channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }) === undefined) {
      return {error: 'error01'}
    }

  let messageWithMessageId = 0;
  // locate messageId in channel messages 
  if (dmData.find(function(dmMessage) {
    return dmMessage.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }) === undefined) {

    messageWithMessageId = channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }).messages;

    // if message is already pinned, return error
    if (messageWithMessageId.find(function(message) {
      return message.messageId === messageId;
    }).isPinned === true) {

      return {error: 'Message already pinned'}
    }
    messageWithMessageId.find(function(message) {
    return message.messageId === messageId;
  }).isPinned = true;
      // or locate messageId in dm messages
  } else if (channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }) === undefined) {

      messageWithMessageId = dmData.find(function(dm) {
        return dm.messages.find(function(message) {
          return message.messageId === messageId;
        })
      }).messages;

      // if message is already pinned, return error
      if (messageWithMessageId.find(function(message) {
        return message.messageId === messageId;
      }).isPinned === true) {

        return {error: 'Message already pinned'}
      } 
      messageWithMessageId.find(function(message) {
    return message.messageId === messageId;
  }).isPinned = true;
    }

  // pin message, set isPinned to true
  // create new object property for isPinned in channel or DM
  // messageWithMessageIdInChannel.find(function(message) {
  //   return message.messageId === messageId;
  // }).isPinned = true;

  setData(data);

  return {}
}

//console.log(messagePinned('Online 0', 1))
//console.log(data.channels[0].messages)

function messageUnpinned(token, messageId) {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  const channelData = data.channels;

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    return {error: 'error00'}
  }
  
  const uIdOfToken = userData.find(function(user) {
    return user.token === token;
  }).uId

  // return error if token is not in channel or DM
  if ((channelData.find(function(channel) {
    return channel.members.owners.find(function(owner) {
      return owner.uId === uIdOfToken;
    })
  }) === undefined
    && channelData.find(function(channel) {
      return channel.members.allMembers.find(function(member) {
        return member.uId === uIdOfToken;
        })
      }) === undefined)
    || (dmData.find(function(dm) {
        return dm.owner === uIdOfToken;
      }) === undefined
    && dmData.find(function(dm) {
      return dm.members;
    }).members.find(function(member) {
      return member.uId === uIdOfToken;
    }) === undefined)) {

      return {error: 'error000'}
    }

  // return error if messageID is not valid within a channel or DM
  if (dmData.find(function(dmMessage) {
    return dmMessage.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }) === undefined
    && channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }) === undefined) {
      return {error: 'error01'}
    }

  let messageWithMessageId = 0;
  // locate messageId in channel messages 
  if (dmData.find(function(dmMessage) {
    return dmMessage.messages.find(function(message) {
      return message.messageId === messageId;
    })
  }) === undefined) {

    messageWithMessageId = channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }).messages;

    // if message is already pinned, return error
    if (messageWithMessageId.find(function(message) {
      return message.messageId === messageId;
    }).isPinned === false) {

      return {error: 'Message already unpinned'}
    }
    messageWithMessageId.find(function(message) {
    return message.messageId === messageId;
  }).isPinned = false;
      // or locate messageId in dm messages
  } else if (channelData.find(function(channel) {
      return channel.messages.find(function(message) {
        return message.messageId === messageId;
      })
    }) === undefined) {

      messageWithMessageId = dmData.find(function(dm) {
        return dm.messages.find(function(message) {
          return message.messageId === messageId;
        })
      }).messages;

      // if message is already pinned, return error
      if (messageWithMessageId.find(function(message) {
        return message.messageId === messageId;
      }).isPinned === false) {

        return {error: 'Message already unpinned'}
      } 
      messageWithMessageId.find(function(message) {
    return message.messageId === messageId;
  }).isPinned = false;
    }


  setData(data);

  return {}
}


function searchV1(token, queryStr) {
  // length of queryStr is less than 1 or over 1000 characters
  // otherwise user receive 400 Error
  if (queryStr.length < 1) {

    throw HTTPError(400, 'Query string is less than 1');
  } else if (queryStr.length > 1000) {
    throw HTTPError(400, 'Query string is over than 1000');
  } else if (!findToken(token)) {
    throw HTTPError(403, 'Unauthorised user');
  }
  const data = getData();
  let messages = [];
  const keywords = [queryStr];
  // return a collection of messages in all of the channels/DMs
  // that the user has joined that contain the query
  for (const channel of data.channels) {
    for (const channel_message of channel.messages) {
      if (keywords.some(keyword => channel_message.message.includes(keyword))) {
        messages.push({
          messageId: channel_message.messageId,
          uId: channel_message.uId,
          message: channel_message.message,
          timeSent: channel_message.timeSent
        });
      }
    }
  }

  for (const dm of data.dms) {
    for (const dm_message of dm.messages) {
      if (keywords.some(keyword => dm_message.message.includes(keyword))) {
        messages.push({
          messageId: dm_message.messageId,
          uId: dm_message.uId,
          message: dm_message.message,
          timeSent: dm_message.timeSent
        });
      }
    }
  }

  return { messages };
}




dmCreate('Online 0', [1])
dmSendV1('Online 0', 0, 'This is a new message')
messageSend('Online 0', 0, 'this is a message');
searchV1('Online 0', 'this is')
// messageSend('Online 1', 1, 'this is another message');
//console.log(messageReact('Online 0', data.channels[0].messages[0].messageId, 1));
// messageReact('Online 0', data.dms[0].messages[0].messageId, 1);
// messageReact('Online 1', data.dms[0].messages[0].messageId, 1);
// console.log(messageUnreact('Online 1', data.dms[0].messages[0].messageId, 1))
// console.log(messageUnreact('Online 0', data.dms[0].messages[0].messageId, 1))
//messageReact('Online 0', data.dms[0].messages[0].messageId, 1);
//messageReact('Online 1', data.dms[0].messages[0].messageId, 1);
// messageReact('Online 0', data.channels[0].messages[0].messageId, 1);
// messageReact('Online 1', data.channels[0].messages[0].messageId, 1);
//console.log(messageUnreact('Online 1', data.channels[0].messages[0].messageId, 1))
// console.log(messageUnreact('Online 0', data.channels[0].messages[0].messageId, 1))
// console.log(messageReact('Online 1', data.channels[0].messages[0].messageId, 1))
// messagePinned('Online 0',data.dms[0].messages[0].messageId)
// messageUnpinned('Online 0',data.dms[0].messages[0].messageId)
// console.log(data.dms[0].messages[0])
// //console.log(data.dms[0])
// console.log(data.channels[0].messages)
messagePinned('Online 0',data.channels[0].messages[0].messageId)
messageUnpinned('Online 0',data.channels[0].messages[0].messageId)
console.log(data.channels[0].messages[0])

// console.log(data.channels);
// console.log(data.dms[0]);
// console.log(messageReact('Online 1', 0, 1));
// //console.log(data.channels[0].messages[0].reacts);
// //console.log(data.channels[0].messages[1].reacts);
// console.log(messageUnreact('Online 0', 0, 1));
// console.log(messageUnreact('Online 1', 0, 1));
// console.log(data.channels[0].messages[0].reacts);
// console.log(messageReact('Online 0', 0, 1));
// console.log(messageReact('Online 1', 0, 1));
// console.log(data.channels[0].messages[0].reacts);

