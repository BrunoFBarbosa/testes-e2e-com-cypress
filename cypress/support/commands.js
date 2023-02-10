Cypress.Commands.add('login', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD'),
  { cacheSession = true } = {}
) => {
  const login = () => {
    cy.visit('/login')
    cy.get('#email').type(username)
    cy.get('#password').type(password, { log: false })
    cy.contains('button', 'Login').click()
    cy.contains('h1', 'Your Notes', {timeout: 10000}).should('be.visible')
  }

  if (cacheSession) {
    cy.session([username, password], login)
  } else {
    login()
  }
})

const attachFileHandler = () => cy.get('#file').attachFile('example.json')

Cypress.Commands.add('createNote', (description, attachFile = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(description)

  if (attachFile) {
    attachFileHandler
  }

  cy.contains('button', 'Create').click()

})

Cypress.Commands.add('editNote', (noteDescription, updatedNoteDescription, attachFile = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')
  cy.contains('.list-group-item', noteDescription)
    .should('be.visible')
    .click()

  cy.wait('@getNote')
  cy.get('#content')
    .clear()
    .type(updatedNoteDescription)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Save').click()
  cy.contains('.list-group-item', noteDescription).should('not.exist')
  cy.contains('.list-group-item', updatedNoteDescription).should('be.visible')
})

Cypress.Commands.add('deleteNote', note => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()

  cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})