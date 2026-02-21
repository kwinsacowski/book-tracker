declare module 'passport-jwt' {
  import type { Request } from 'express';

  export type JwtFromRequestFunction = (req: Request) => string | null;

  export interface StrategyOptions {
    jwtFromRequest: JwtFromRequestFunction;
    secretOrKey: string;
    ignoreExpiration?: boolean;
  }

  export class Strategy {
    constructor(
      options: StrategyOptions,
      verify?: (...args: unknown[]) => unknown,
    );
  }

  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken: () => JwtFromRequestFunction;
  };
}
