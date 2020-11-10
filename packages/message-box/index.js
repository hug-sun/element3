import MessageBox from './src/MessageBox.js'
import MessageBoxComponent from './src/MessageBox.vue'

export function useMsgbox() {
  return {
    $msgbox: MessageBox,
    $alert: MessageBox.alert,
    $confirm: MessageBox.confirm,
    $prompt: MessageBox.prompt
  }
}

export default MessageBoxComponent
