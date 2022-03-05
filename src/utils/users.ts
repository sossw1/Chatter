interface IUser {
  id: number;
  username: string;
  room: string;
}

const users: IUser[] = [];

const addUser = ({ id, username, room }: IUser) => {
  if (!username || !room) {
    return {
      error: 'Username and room are required'
    };
  }

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: 'Username is already in use'
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const getUser = (id: number) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room: string) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

const removeUser = (id: number) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export { users, addUser, removeUser, getUser, getUsersInRoom };
