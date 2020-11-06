import MessageBox from './src/MessageBox.js'
import MessageBoxComponent from './src/MessageBox.vue'
export function useMsgbox() {
  return MessageBox
}

export function useAlert() {
  return MessageBox.alert
}
export function useConfirm() {
  return MessageBox.confirm
}
export function usePrompt() {
  return MessageBox.prompt
}

export default MessageBoxComponent
