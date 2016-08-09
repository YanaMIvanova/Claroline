import form from '../Form/room.js'

export default class ChatConfigureCtrl {
  constructor (chat, $uibModalInstance) {
    this.chat = chat
    this.form = form
    this.$uibModalInstance = $uibModalInstance
  }

  onSubmit (form) {
    console.log(this.chat)  
    if (form.$valid) this.$uibModalInstance.close(this.chat)
  }
}
