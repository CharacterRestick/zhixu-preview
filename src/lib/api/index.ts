import { httpApi } from './http'
import { mockApi } from './mock'

export const isMock = import.meta.env.VITE_USE_MOCK !== 'false'

/**
 * 前端只认这个 api 对象。
 * 预览：VITE_USE_MOCK=true，走 mock.ts。
 * 接后端：VITE_USE_MOCK=false + VITE_API_BASE_URL，走 http.ts。
 */
export const api: typeof mockApi = isMock
  ? mockApi
  : (httpApi as unknown as typeof mockApi)
