import jwt from "jsonwebtoken";
import config from "../../config";
import { IJwtPayload } from "../User/User.interface";

const CreateAccessToken = async (payLoad: IJwtPayload) => {
  return jwt.sign(payLoad, config.jwt_access_token_secret as string, {
    expiresIn: config.jwt_access_token_expires_in,
  });
};

export default CreateAccessToken;
