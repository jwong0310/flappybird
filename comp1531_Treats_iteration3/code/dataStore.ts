import fs from 'fs';

// YOU SHOULD MODIFY THIS OBJECT BELOW

export interface User {
  uId: number,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
  token: string;
}

export interface Message {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number;
  reacts: {
    reactId: number,
    uIds: number[],
    isThisUserReacted: boolean
  }[],
  isPinned: boolean
}

export interface Channel {
  channelId: number,
  name: string,
  isPublic: boolean,
  members: {
    owners: { uId: number }[],
    allMembers: { uId: number }[]
  },
  messages: Message[];
}

export interface Dm {
  dmId: number,
  name: string[],
  owner: number,
  members: User[],
  messages: Message[],
}

export interface DataStore {
  users: User[],
  channels: Channel[],
  dms: Dm[],
}

let data: DataStore = {
  users: [/*
    {
      'uId': 0,
      'email': 'john.doe@example.com',
      'password': 'password',
      'nameFirst': 'John',
      'nameLast': 'Doe',
      'handleStr': 'johndoe',
    },
    {
      'uId': 1,
      'email': 'jane.doe@example.com',
      'password': 'password',
      'nameFirst': 'Jane',
      'nameLast': 'Doe',
      'handleStr': 'janedoe',
    },
  */],
  channels: [/*
    {
      channelId: 0,
      name: 'Netflix-sub',
      isPublic: true,
      members: {
        owners: [
          {
            uId: 0,
          },
        ],
        allMembers: [
          {
            uId: 0
          },
          {
            uId: 1,
          },

        ],
      },
      // Most recent message has messageId = 0, second-most recent
      // message has messageId = 1, etc...
      // Least recent message has highest messageId and can be accessed
      // by datastore.messages[-1]
      messages: [
        {
          messageId: 0,
          uId: 0,
          message: 'this is a message',
          timeSent: 1658809485, // exact timestamp UTC converted from
          // Tue, 26 Jul 2022 04:24:45 GMT
        },
      ]
    },
    {
      channelId: 1,
      name: 'Crunchies',
      isPublic: false,
      members: {
        owners: [
          {
            uId: 0,
          }
        ],
        allMembers: [
          {
            uId: 0,
          }
        ],
      },
      messages: [
        {
          messageId: 0,
          uId: 0,     // refers to which user is the author of the message
          message: 'this is a message',
          timeSent: 1658809485, // exact timestamp UTC converted from
          // Tue, 26 Jul 2022 04:24:45 GMT
        },
      ],
    },
  */],
  dms: [/*
    {
      'dmId': 0,
      'owner': 'Jacky Wong',
      'members': [
        {
          'uId': 1,
          'handleStr': 'jamiewong',
          'token': 'Online 0'
        }
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

// Use getData() to get the current dataStore
export const getData = (): DataStore => {
  return data;
};

// Use setData(newData) to change data store in memory to newData
export const setData = (newData: DataStore) => {
  data = newData;
};

// Use loadData(nameOfFile) to load the dataStore from treats_saveFile.json
// Returns data loaded from treats_saveFile.json
export const loadData = (): DataStore => {
  const filename = 'treats_saveFile.json';
  try {
    const treatsData = JSON.parse(String(fs.readFileSync(filename, { flag: 'r' })));
    data.users = treatsData.users;
    data.channels = treatsData.channels;
    data.dms = treatsData.dms;
    return treatsData;
  } catch (err) {
    throw new Error('no state of treats has been saved; treats_saveFile.json does not exist');
  }
};

// Use saveData() to save current data store in a file with name treats_saveFile.json
export const saveData = () => {
  const filename = 'treats_saveFile.json';
  fs.writeFileSync(filename, JSON.stringify(data), { flag: 'w' });
};
