import { formatImageUrl } from '@/api/axiosInstance';

/**
 * Backend `photo` may come as:
 * - full URL (http/https)
 * - relative path like `/media/...`
 * - sometimes without leading slash (e.g. `media/...`)
 *
 * This helper normalizes it so `Avatar` / `Image` can display properly.
 * It delegates to the centralized `formatImageUrl` from axiosInstance
 * which dynamically resolves the correct backend base URL.
 */
export const getDriverPhotoUrl = (photo?: string | null): string => {
  return formatImageUrl(photo) || '';
};
