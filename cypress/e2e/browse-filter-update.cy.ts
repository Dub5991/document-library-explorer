// End-to-end: browse the catalog, filter it, open a document, update its status.
describe('document library', () => {
  it('browses, filters, opens a document, and updates its status', () => {
    cy.visit('/')

    cy.contains('Document Library Explorer')
    cy.contains(/Showing \d+ of \d+ documents/)
    cy.get('table tbody tr').should('have.length.greaterThan', 0)

    // Filtering by search narrows the visible set.
    cy.get('input[type="text"]').first().type('Vendor Contract')
    cy.contains(/Showing \d+ of \d+ documents/)

    // Opening the first result shows the detail dialog.
    cy.get('table tbody tr').first().find('button').click()
    cy.get('[role="dialog"]').should('be.visible')

    // Updating status writes through Redux and confirms via the live region.
    cy.get('[role="dialog"] select').select('approved')
    cy.get('[role="status"]').should(
      'contain.text',
      'Status updated to Approved',
    )

    // Escape closes the dialog.
    cy.get('body').type('{esc}')
    cy.get('[role="dialog"]').should('not.exist')
  })
})
