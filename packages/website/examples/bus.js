import mitt from 'mitt'
const emitter = mitt()

emitter.$on = emitter.on
emitter.$emit = emitter.emit
emitter.$off = emitter.off
export default emitter
