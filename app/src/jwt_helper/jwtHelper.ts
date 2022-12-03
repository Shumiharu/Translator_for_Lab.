import jsonwebtoken  from 'jsonwebtoken'

const secret = "dzzv8280"

export const createToken = () => {
  const token = jsonwebtoken.sign({ foo: "bar" }, secret, {
    expiresIn: "30d",
  });
  return token;
 }

export const verifyToken = (token: string) => {
  try {
    const decoded = jsonwebtoken.verify(token, secret);
    return decoded;
  } catch (error) {
    console.log(error);
  }
}