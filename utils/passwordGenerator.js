const generatePassword = (name, email, phone) => {
  const namePart = name.substring(0, 3);
  const emailPart = email.split('@')[0].substring(0, 3);
  const phonePart = phone.substring(phone.length - 4);
  const randomNum = Math.floor(Math.random() * 100);
  
  return `${namePart}${emailPart}${phonePart}${randomNum}`;
};

module.exports = { generatePassword }; 