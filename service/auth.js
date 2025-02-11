const jwt = require("jsonwebtoken");
const Secret = "S3CR3TK3Y";

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role:user.role,
    },
    Secret
  );
}
function getUser(token) {
  if (!token) return null;
  try{
      return jwt.verify(token, Secret);
  }
  catch(error){
    return null;
  }
}

module.exports = { setUser, getUser };
