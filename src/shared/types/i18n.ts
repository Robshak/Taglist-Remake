export type TDotPaths<T> = T extends string | number | boolean | null | undefined
  ? never
  : {
      [K in Extract<keyof T, string>]: T[K] extends Record<string, unknown>
        ? `${K}` | `${K}.${TDotPaths<T[K]>}`
        : `${K}`;
    }[Extract<keyof T, string>];
