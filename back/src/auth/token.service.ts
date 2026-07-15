import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  private readonly secret =
    process.env.JWT_SECRET ?? 'dev-only-secret-change-me';

  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresInSeconds = 60 * 60 * 24) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
    const signature = this.createSignature(
      `${encodedHeader}.${encodedPayload}`,
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verify(token: string): JwtPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException('Token inválido');
    }

    let header: { alg?: string; typ?: string };
    let payload: JwtPayload;
    try {
      header = JSON.parse(this.base64UrlDecode(encodedHeader)) as {
        alg?: string;
        typ?: string;
      };
      payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    if (header.alg !== 'HS256' || header.typ !== 'JWT') {
      throw new UnauthorizedException('Token inválido');
    }

    const expectedSignature = this.createSignature(
      `${encodedHeader}.${encodedPayload}`,
    );

    const providedSignature = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
      providedSignature.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(providedSignature, expectedSignatureBuffer)
    ) {
      throw new UnauthorizedException('Token inválido');
    }

    const now = Math.floor(Date.now() / 1000);

    if (payload.exp <= now) {
      throw new UnauthorizedException('Token expirado');
    }

    return payload;
  }

  private createSignature(input: string) {
    return createHmac('sha256', this.secret)
      .update(input)
      .digest('base64url');
  }

  private base64UrlEncode(input: string) {
    return Buffer.from(input).toString('base64url');
  }

  private base64UrlDecode(input: string) {
    return Buffer.from(input, 'base64url').toString('utf8');
  }
}
