// Smoke spec proving the app loads and the offline document table renders real data.
describe('smoke', () => {
  it('loads the app and the document table', () => {
    cy.visit('/')
    cy.contains('Document Library Explorer')
    cy.contains(/Showing \d+ of \d+ documents/)
    cy.get('table tbody tr').should('have.length.greaterThan', 0)
  })
})
