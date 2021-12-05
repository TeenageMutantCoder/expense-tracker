// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
// https://stackoverflow.com/questions/68481686/type-typeof-globalthis-has-no-index-signature
declare global {
  var mongoose: any;
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
    }
  }
}

export {};
