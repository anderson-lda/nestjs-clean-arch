export interface HashProvider {
  generateHash(payload: string): Promise<string>
  comparehash(payload: string, hash: string): Promise<boolean>
}
