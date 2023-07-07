describe('Deleting an issue', () => {
  let getIssueDetailsModal;

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      // open first issue from the board
      cy.contains('This is an issue of type: Task.').click();
      getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    });
  });

  it('Test case deletes an issue and verifies its absence on the Jira board', () => {

    // assert that issue detail view modal is visible
    getIssueDetailsModal().within(() => {
      cy.contains('This is an issue of type: Task.')
      // click delete button
      cy.get('[data-testid="icon:trash"]').click();



    })
    // const for confirmation window
    const confirmationModal = cy.get('[data-testid="modal:confirm"]');
    confirmationModal.should('be.visible');
    confirmationModal.should('contain', 'Are you sure you want to delete this issue?');

    confirmationModal.within(() => {
      // confirm deletion
      cy.contains('Delete issue').trigger('mouseover')
        .trigger('click');

    })

    // deletion confirmation dialogue is not visible


    //issue is deleted and not displayed on the Jira board anymore.
  });
})


