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

export { users, addUser };
