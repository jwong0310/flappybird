
import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

export interface error {
    error: string
}

export interface messageSendV1 {
    messageId: number
}

export const messageReactV1 = {} as Record<string, never>;
export const messageUnreactV1 = {} as Record<string, never>;
export const messageEditV1 = {} as Record<string, never>;
export const messagePinnedV1 = {} as Record<string, never>;
export const messageUnpinnedV1 = {} as Record<string, never>;

function messageSend(token: string, channelId: number, message: string): messageSendV1 | error {
  const data = getData();
  const channelData = data.channels;
  const dmData = data.dms;
  const userData = data.users;
  // return error if channelId is invalid
  if (channelData.find(function(channelNum) {
    return channelNum.channelId === channelId;
  }) === undefined) {
    throw HTTPError(400, 'Invalid channelID.');
  }

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Token is Invalid.');
  }

  // return error if message.length is < 1 or > 1000ccharacters
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'Invalid message length.');
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

  // pushes new message objects into data.channel[channelId].messages
  let messageIDNum = channelData.find(function(channel) {
    return channel.channelId === channelId;
  }).messages.length;

  // checks if messageId already exists in dmMessage, if so increment messageId 
  // for channelMessage
  if (dmData.find(function(dm) {
    return dm.messages.find(function(message) {
      return message.messageId === messageIDNum;
    })
  }) !== undefined) {
    messageIDNum++;
  }

  // get timestamp of message
  const dateOfMessage = new Date();
  const getTime = dateOfMessage.getTime() / 1000;
  const messageTimeStampUTC = Math.floor(getTime);

  channelData[channelId].messages.push({
    messageId: messageIDNum,
    uId: uIdOfToken,
    message: message,
    timeSent: messageTimeStampUTC,
    reacts: [],
    isPinned: false
  });
  setData(data);
  return { messageId: messageIDNum };
}

function messageEdit(token: string, messageId: number, message: string): Record<string, never> | error {
  const data = getData();
  const channelData = data.channels;
  const userData = data.users;

  // return error if message.length is < 1 or > 1000ccharacters
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'Invalid message length.');
  }

  // return error if invalid token
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Token is invalid.');
  }

  // return error if messageId does not exist in message array
  if (channelData.find(function(channel) {
    return channel.messages.find(function(messageNum) {
      return messageNum.messageId === messageId;
    });
  }) === undefined) {
    throw HTTPError(400, 'Message does not exist.');
  }

  const authUserTokenUid = userData.find(function(user) {
    return user.token === token;
  }).uId;

  // return error if authUser does not belong in channel.owner
  if (channelData.find(function(channel) {
    return channel.members.owners.find(function(member) {
      return member.uId === authUserTokenUid;
    });
  }) === undefined) {
    throw HTTPError(403, 'User does not have owner permissions.');
  }

  // return error message uId does not match token requesting messageEdit
  if (channelData.find(function(channel) {
    return channel.messages.find(function(messageNum) {
      return messageNum.uId === authUserTokenUid;
    });
  }) === undefined) {
    throw HTTPError(403, 'Message was not sent by user.');
  }

  // replace current message with new message
  channelData.find(function(channel) {
    return channel.messages.find(function(message) {
      return message.messageId === messageId;
    });
  }).messages[messageId].message = message;

  setData(data);
  return {};
}

function messageRemove(token: string, messageId: number) {
  const data = getData();
  const channelData = data.channels;
  const userData = data.users;

  // return error if messageId does not exist in message array
  const channelIndex = channelData.findIndex(function(channel) {
    return channel.messages.findIndex(function(messageNum) {
      return messageNum.messageId === messageId;
    });
  });
  if (channelIndex === -1) {
    throw HTTPError(400, 'Message does not exist.');
  }

  const userIndex = userData.findIndex((user) => {
    return user.token === token;
  });
  // token does not exist
  if (userIndex === -1) {
    throw HTTPError(403, 'Token is invalid.');
  }

  const authUserId = userData[userIndex].uId;
  // if authorised token is not the one sending the message
  const authFind = channelData[channelIndex].messages.find((message) => {
    return message.uId === authUserId;
  });
  if (authFind === undefined) {
    throw HTTPError(403, 'Message was not sent by user.');
  }
  // authorised user does not have permissions in the channel/DM
  const authOwnerFind = channelData[channelIndex].members.owners.find((owner) => {
    return owner.uId = authUserId;
  });
  if (authOwnerFind === undefined) {
    throw HTTPError(403, 'User does not have owner permissions.');
  }

  const messageIndex = channelData[channelIndex].messages.findIndex((message) => {
    return message.uId === authUserId;
  });

  channelData[channelIndex].messages.splice(messageIndex, 1);
  setData(data);
  return {};
}



function messageReact(token: string, messageId: number, reactId: number): Record<string, never> | error {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  const channelData = data.channels;

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Token is invalid.');
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
    && (dmData.find(function(dm) {
        return dm.owner === uIdOfToken;
      }) === undefined
    && dmData.find(function(dm) {
      return dm.members.find(function(member) {
        return member.uId === uIdOfToken;
      });
    }) === undefined)) {

      throw HTTPError(403, 'User is not in Channel or DM.');
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
      throw HTTPError(400, 'MessageID is invalid.');
    }

  // return error reactId !== 1
  if (reactId !== 1) {
    throw HTTPError(400, 'reactID is invalid.');
  }

  let messageWithMessageId = [];
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
        throw HTTPError(400, 'User has already reacted.');
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
              throw HTTPError(400, 'User has already reacted.');
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


function messageUnreact(token: string, messageId: number, reactId: number): Record<string, never> | error {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  const channelData = data.channels;

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Token is invalid.');
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
    && (dmData.find(function(dm) {
        return dm.owner === uIdOfToken;
      }) === undefined
    && dmData.find(function(dm) {
        return dm.members.find(function(member) {
          return member.uId === uIdOfToken;
      })
    }) === undefined)) {

      throw HTTPError(403, 'User is not in Channel or DM.');
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
      throw HTTPError(400, 'messageID is invalid.');
    }

  // return error reactId !== 1
  if (reactId !== 1) {
    throw HTTPError(400, 'ReactID is invalid.');
  }

  let messageWithMessageId = [];
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
          throw HTTPError(400, 'React does not exist.');
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
              throw HTTPError(400, 'React does not exist.');
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

    }
    setData(data);

  return {}
}

function messagePinned(token: string, messageId: number): Record<string, never> | error {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  const channelData = data.channels;

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Token is invalid.');
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
    && (dmData.find(function(dm) {
        return dm.owner === uIdOfToken;
      }) === undefined
    && dmData.find(function(dm) {
      return dm.members.find(function(member) {
        return member.uId === uIdOfToken;
      })
    }) === undefined)) {

      throw HTTPError(403, 'User is not in Channel or DM.');
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
      throw HTTPError(400, 'Message Id is invalid');
    }

  let messageWithMessageId = [];
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

      throw HTTPError(400, 'Message is already pinned.');
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

        throw HTTPError(400, 'Message is already pinned.');
      } 
      messageWithMessageId.find(function(message) {
    return message.messageId === messageId;
  }).isPinned = true;
    }

  setData(data);

  return {}
}

function messageUnpinned(token: string, messageId: number): Record<string, never> | error {
  const data = getData();
  const userData = data.users;
  const dmData = data.dms;
  const channelData = data.channels;

  // return error if token is invalid
  if (userData.find(function(user) {
    return user.token === token;
  }) === undefined) {
    throw HTTPError(403, 'Token is invalid.');
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
    && (dmData.find(function(dm) {
        return dm.owner === uIdOfToken;
      }) === undefined
    && dmData.find(function(dm) {
      return dm.members.find(function(member) {
        return member.uId === uIdOfToken;
      })
    }) === undefined)) {

      throw HTTPError(403, 'User is not in Channel or DM.');
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
      throw HTTPError(400, 'Message Id is invalid');
    }

  let messageWithMessageId = [];
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

      throw HTTPError(400, 'Message is already unpinned.');
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

        throw HTTPError(400, 'Message is already unpinned.');
      } 
      messageWithMessageId.find(function(message) {
    return message.messageId === messageId;
  }).isPinned = false;
    }


  setData(data);

  return {}
}

export { messageSend, messageEdit, messageRemove, 
        messageReact, messageUnreact, messagePinned,
        messageUnpinned };
