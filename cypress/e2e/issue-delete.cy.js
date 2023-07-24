describe('Issue deletion suite', () => {
  let confirmationModal;
  let firtsIssueTitle;

  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.get('[data-testid="board-list:backlog"]').should('be.visible');
        cy.get('[data-testid="list-issue"]')
          .first()
          .click()
          .then(($title) => {
            firtsIssueTitle = $title.text();
          });

        // issue detail modal is visible
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
      });
    // click 'delete' button
    cy.get('[data-testid="icon:trash"]').click();
    confirmationModal = cy.get('[data-testid="modal:confirm"]');
    confirmationModal.should('be.visible').and('contain', 'Are you sure you want to delete this issue?');
  });

  it('Test 1: deletes first issue from the board', () => {
    confirmationModal.within(() => {
      // confirm deletion
      cy.contains('button', 'Delete issue').click();
    });

    // confirmation pop-up is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    // issue has been deleted from the board
    cy.reload();
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .within(() => {
        cy.get('[data-testid="list-issue"]').should('not.contain', firtsIssueTitle);
      });
  });

  it('Test 2: cancels issue deletion', () => {
    confirmationModal.within(() => {
      // cancel the deletion
      cy.contains('button', 'Cancel').click();
    });

    // confirmation pop-up not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="modal:issue-details"]').should('not.exist');
    cy.reload();

    // issue is still displayed on the board
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .within(() => {
        cy.get('[data-testid="list-issue"]').should('contain', firtsIssueTitle);
      });
  });
});
