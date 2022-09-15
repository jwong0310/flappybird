import { getData, setData, saveData } from './dataStore';
import validator from 'validator';
import HTTPError from 'http-errors';

export interface error {
  error: string;
}

export interface authRegister {
  token: string,
  authUserId: number
}

export interface authLogin {
  token: string,
  authUserId: number
}

export const authLogout = {} as Record<string, never>;

/* Registers a user by checking for valid names, password, email (using
 * the validator function), and returns an error if so. Otherwise it pushes
 * the data into dataStore.js, and returns the object containing those info.
 */
// Arguments:
// <name> (<data type>) - <description>
// email     (string) - registered user's email
// password  (string) - registered user's register and login password
// nameFirst (string) - user's first name
// nameLast  (string) - user's surname

// Return Values:
// Returns {error: 'error'} on invalid length of first name or surname
// Returns {error: 'error'} on invalid password length
// Returns {error: 'error'} on invalid email address
// Returns {error: 'error'} if email already exists
// Returns {authUserId: uId} on valid length of first name, surname, password
// and email does not exist in dataStore.

function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string): error | authRegister {
  
  if (nameFirst.length <= 0 || nameFirst.length >= 50) {
    throw HTTPError(400, 'Invalid name length.');
  }

  if (nameLast.length <= 0 || nameLast.length >= 50) {
    throw HTTPError(400, 'Invalid name length.');
  }
  if (password.length < 6) {
    throw HTTPError(400, 'Invalid password length.');
  }
  if (validator.isEmail(email) !== true) {
    throw HTTPError(400, 'Invalid email.');
  }
  const data = getData();

  // check for duplicate emails
  if (data.users.find((user) => user.email === email) !== undefined) {
    throw HTTPError(400, 'Email already exists!');
  }

  // Incrementation of AuthId
  const newUserId = Object.keys(data.users).length;

  // User Handle for new User Id,
  const combinedNameHandle = nameFirst.toLowerCase() + nameLast.toLowerCase();
  let newUserHandle = combinedNameHandle.replace(/[^a-z]/gi, '');

  // If the user handle exceeeds 20 characters
  if (newUserHandle.length > 20) {
    newUserHandle = newUserHandle.substring(0, 20);
  }

  // If the concatenated user handle is still taken
  if (data.users.find(function(element) {
    return element.handleStr === newUserHandle;
  }) !== undefined) {
    newUserHandle = newUserHandle + (newUserId - 1);
  }

  // Incrementation of Token for multiple users;
  const userToken = 'Online ' + Object.keys(data.users).length;
  data.users.push(
    {
      uId: newUserId,
      email: email,
      password: password,
      nameFirst: `${nameFirst}`,
      nameLast: `${nameLast}`,
      handleStr: newUserHandle,
      token: userToken
    }
  );
  const lastUserPos = data.users.length - 1;
  setData(data);
  return {
    token: userToken,
    authUserId: data.users[lastUserPos].uId
  };
}

/* Given a registered user's email and password, returns their `authUserId` value.
*/
// Arguments:
// <name> (<data type>) - <description>
// email     (string) - registered user's email
// password  (string) - registered user's register and login password

// Return Values:
// Returns {error: 'error'} if email does not belong to user
// Returns {error: 'error'} if password is incorrect

function authLoginV1(email: string, password: string): error | authLogin {
  const data = getData();

  // return error when user is trying to log into an empty database
  if (data.users.length === 0) {
    throw HTTPError(400, 'User does not exist!');
  }
  // check if email is in database
  let isValidEmail = false;
  for (let index = 0; index < data.users.length; index++) {
    if (data.users[index].email === email) {
      isValidEmail = true;
    }
  }
  if (isValidEmail === false) {
    throw HTTPError(400, 'Invalid email.');
  }

  // check for valid password
  let isValidPassword = false;
  for (let index = 0; index < data.users.length; index++) {
    if (data.users[index].password === password) {
      isValidPassword = true;
    }
  }
  if (isValidPassword === false) {
    throw HTTPError(400, 'Invalid password.');
  }

  // return authUserId if email and password matches registered user
  // email and password
  const regId = data.users.find((user) => user.email === email).uId;
  const tokenId = 'Online ' + regId;

  // re-assign token if user is logging back in
  Object.keys(data.users).forEach((key, index) => {
    if (data.users[index].email === email && data.users[index].token === null) {
      data.users[index].token = 'Online ' + data.users[index].uId;
    } else {
      data.users[index].token = tokenId;
    }
  });
  return {
    authUserId: regId,
    token: tokenId
  };
}

/* Given a registered user's token, return empty object.
*/
// Arguments:
// <name> (<data type>) - <description>
// token     (string) - indicates the online/offline status of user

// Return Values:
// Returns {error: 'error'} if token does not belong in dataStore
// Returns {              } if token exists in dataStore

function authLogoutV1(token: string): error | Record<string, never> {
  const data = getData();
  const userData = data.users;
  // if token does not exist in dataUsers, return error
  if (data.users.find(function(user) {
    return user.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Invalid token.');
  }

  // Invalidate user token to NULL
  (Object.keys(userData) as (keyof typeof userData)[]).forEach((key, index) => {
    if (userData[index].token === token) {
      userData[index].token = null;
    }
  });

  setData(data);
  return {};
}
export { authLoginV1, authRegisterV1, authLogoutV1 };
