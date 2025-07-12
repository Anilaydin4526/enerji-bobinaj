import { SignJWT, jwtVerify } from 'jose'
import { createHash, randomBytes } from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface JWTPayload {
  userId: number
  username: string
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET)
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(password + salt).digest('hex')
  return salt + ':' + hash
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':')
  const passwordHash = createHash('sha256').update(password + salt).digest('hex')
  return hash === passwordHash
} 