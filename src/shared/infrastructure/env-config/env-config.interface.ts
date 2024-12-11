export interface EnvConfig {
  getAppPort(): number
  getNodeEnv(): string
  getJWTSecret(): string
  getJWTExpiresInSeconds(): number
}
