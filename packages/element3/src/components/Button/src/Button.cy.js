import { mount } from '@cypress/vue'
import Button from './Button.vue'

describe('BaseButton', () => {
  it('takes in the default slot', () => {
    mount(Button, {
      props: {
        type: 'primary'
      },
      slots: {
        default: 'btn'
      }
    })

    cy.get('button').contains('btn').click()
  })
})
