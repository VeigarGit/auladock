import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

@Injectable()
export class PasswordService {
  hash(password: string) {
    const salt = randomBytes(16).toString('base64url');
    const hash = scryptSync(password, salt, 64).toString('base64url');
    return `${salt}.${hash}`;
  }

  verify(password: string, storedHash: string) {
    const [salt, hash] = storedHash.split('.');

    if (!salt || !hash) {
      return false;
    }

    const hashedBuffer = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(hash, 'base64url');

    return (
      hashedBuffer.length === storedBuffer.length &&
      timingSafeEqual(hashedBuffer, storedBuffer)
    );
  }
}
