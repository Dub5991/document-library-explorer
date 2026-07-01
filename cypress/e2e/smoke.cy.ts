// Smoke spec proving the Cypress e2e pipeline runs green.
describe('smoke', () => {
  it('loads the app', () => {
    cy.visit('/')
    cy.contains('Document Library Explorer')
  })
})
