import { createInjectionKey } from '../../utils'
import type { ElGridInjection } from './Grid.vue'

export const defaultSpan = 1
export const gridInjectionKey = createInjectionKey<ElGridInjection>('el-grid')
