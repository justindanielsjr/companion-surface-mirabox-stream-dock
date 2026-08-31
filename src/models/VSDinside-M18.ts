import type { StreamDockModelDefinition } from './list.js'
import { M18V3Definition } from './M18V3.js'

export const VSDinside_M18Definition: StreamDockModelDefinition = {
	...M18V3Definition,
	productName: 'VSDinside M18',
	usbIds: [{ vendorId: 0x5548, productIds: [0x1000] }],
}
