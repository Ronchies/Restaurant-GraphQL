import jwt from "jsonwebtoken";

const generateToken = async (user) => {
  const { username, user_type } = user;

  const accessToken = jwt.sign(
    {
      username: username,
      user_type: user_type,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  return accessToken;
};

export default generateToken;