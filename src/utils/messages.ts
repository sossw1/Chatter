import { Location } from '../index';

const generateMessage = (username: string, text: string) => {
  return {
    username,
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (username: string, location: Location) => {
  return {
    username,
    url: `http://google.com/maps?q=${location.latitude},${location.longitude}`,
    createdAt: new Date().getTime()
  };
};

export { generateMessage, generateLocationMessage };
