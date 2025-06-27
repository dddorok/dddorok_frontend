import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.ENCRYPTION_KEY);

// 암호화
const encrypt = async (data: any) => {
  // const jwt = await new jose.EncryptJWT({ data })
  //   .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
  //   .setIssuedAt()
  //   .encrypt(secret);
  // return jwt;
  return JSON.stringify(data);
};

// 복호화
const decrypt = async <T>(jwt: string): Promise<T> => {
  return JSON.parse(jwt) as T;
};

export { encrypt, decrypt };
