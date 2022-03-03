import { Location } from '../index';

const generateMessage = (text: string) => {
  return {
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (location: Location) => {
  return {
    url: `http://google.com/maps?q=${location.latitude},${location.longitude}`,
    createdAt: new Date().getTime()
  };
};

export { generateMessage, generateLocationMessage };
