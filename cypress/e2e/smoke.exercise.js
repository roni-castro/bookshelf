import {buildUser} from '../support/generate'

describe('smoke', () => {
  it('should allow a typical user flow', () => {
    const user = buildUser()
    const bookNameRegex = /Harry Potter and the Chamber of Secrets/i
    cy.visit('/')
    cy.findByRole('button', {name: /register/i}).click()
    cy.findByRole('dialog', {name: /registration form/i}).within(() => {
      cy.findByRole('textbox', {name: /username/i}).type(user.username)
      cy.findByLabelText(/password/i).type(user.password)
      cy.findByRole('button', {name: /register/i}).click()
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /discover/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findByRole('searchbox', {name: /search/i}).type('harry potter{enter}')
      cy.findByRole('listitem', {name: bookNameRegex}).within(() => {
        cy.findByRole('link', {name: bookNameRegex}).click()
      })

      cy.findByRole('button', {name: /add to list/i}).click()
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /reading list/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1)
      cy.findByRole('link', {name: bookNameRegex}).click()
    })

    cy.findByRole('textbox', {name: /notes/i}).type('my notes')
    cy.findByLabelText(/loading/i).should('exist')
    cy.findByLabelText(/loading/i).should('not.exist')

    cy.findByRole('button', {name: /mark as read/i}).click()

    cy.findByRole('radio', {name: /4 stars/i}).click({force: true})

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /finished books/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1)
      cy.findByRole('radio', {name: /4 stars/i}).should('be.checked')
      cy.findByRole('link', {name: bookNameRegex}).click()
    })

    cy.findByRole('button', {name: /remove from list/i}).click()
    cy.findByRole('textbox', {name: /notes/i}).should('not.exist')
    cy.findByRole('radio', {name: /4 stars/i}).should('not.exist')

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /finished books/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 0)
    })
  })
})
