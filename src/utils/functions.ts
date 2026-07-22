export const generateUUID = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateTimestamp = () => {
  const now = new Date();
  const timestamp = now.getTime().toString(36);
  return timestamp;
};
export const generateUserId = () => {
  const uuid = generateUUID();
  const timestamp = generateTimestamp();
  const uuidWithTimestamp = uuid + timestamp;
  return uuidWithTimestamp.substring(0, 26);
};
