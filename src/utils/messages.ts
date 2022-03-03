const generateMessage = (text: string) => {
  return {
    text,
    createdAt: new Date().toLocaleTimeString()
  };
};

export { generateMessage };
