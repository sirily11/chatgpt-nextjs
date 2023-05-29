export type KvStoreType = 'registration' | 'authentication' | 'authenticated';

/**
 * Get KV key for a given type and user ID
 * @param type KV key type
 * @param userId User ID
 * @returns
 */
export function getKey(type: KvStoreType, userId: string) {
  return `chatgpt:${type}:${userId}`;
}
