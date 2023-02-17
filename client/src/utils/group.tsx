import { IMessageDoc } from '../types/Rooms';

const groupMessagesByUsername = (messages: IMessageDoc[]) => {
  const groupedMessages: IMessageDoc[][] = [];
  if (messages.length === 0) return groupedMessages;
  let currentGroup = [messages[0]];
  let currentUsername = messages[0].username;
  for (let i = 1; i < messages.length; i++) {
    const currentMessage = messages[i];
    if (currentMessage.username === currentUsername) {
      currentGroup.push(currentMessage);
    } else {
      groupedMessages.push(currentGroup);
      currentGroup = [currentMessage];
      currentUsername = currentMessage.username;
    }
  }
  groupedMessages.push(currentGroup);
  return groupedMessages;
};

export { groupMessagesByUsername };
