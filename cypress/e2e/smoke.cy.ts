// Smoke spec proving the app loads and the offline data contract is wired end-to-end.
describe('smoke', () => {
  it('loads the app and the offline document count', () => {
    cy.visit('/')
    cy.contains('Document Library Explorer')
    cy.contains(/\d+ documents loaded/)
  })
})
