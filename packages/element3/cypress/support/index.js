// import 'virtual:windi.css'
// import 'virtual:windi-devtools'
// import '../../src/index.css'
import '../../lib/theme-chalk/index.css'

beforeEach(() => {
  cy.viewport(600, 600, { log: false })
})

// Cypress.Commands.overwrite('submit', function (original, $form) {
//   const spy = cy.spy(() => {
//   })
//   if ($form) {
//     $form[0].submit = spy
//   }

//   return cy.wrap(original(...Array.from(arguments).slice(1)), { log: false }).wrap(spy, { log: false })
// })

// Cypress.Commands.add('vue', () => {
//   return cy.wrap(Cypress.vueWrapper)
// })
