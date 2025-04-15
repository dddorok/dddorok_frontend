import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.ENCRYPTION_KEY);

// 암호화
const encrypt = async (data: any) => {
  const jwt = await new jose.EncryptJWT({ data })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .encrypt(secret);
  return jwt;
};

// 복호화
const decrypt = async <T>(jwt: string): Promise<T> => {
  const { payload } = await jose.jwtDecrypt(jwt, secret);
  return payload.data as T;
};

export { encrypt, decrypt };
