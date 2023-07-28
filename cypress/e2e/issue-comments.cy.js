const faker = require("faker");

describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should create a comment successfully', () => {
        const comment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });


    it('Should add, edit and delete a comment', () => {
      const randomComment = faker.lorem.sentence();
      const editComment = faker.lorem.word();
      // add comment; assert that comment is added and visible
      getIssueDetailsModal().within(() => {
      cy.contains('Add a comment...').click();
      cy.get('textarea[placeholder="Add a comment..."]').type(randomComment);
      cy.contains('button', 'Save').click().should('not.exist');
      cy.get('[data-testid="issue-comment"]').should('contain', randomComment);
      // edit comment; assert that updated comment is visible
      cy.contains('div', 'Edit').eq(0).click().should('not.exist');
      cy.get('textarea').contains(randomComment).clear().type(editComment);
      cy.contains('button', 'Save').click().should('not.exist');
      cy.get('[data-testid="issue-comment"]').should('contain', editComment);
      // remove comment; assert that comment is removed
      cy.contains('div', 'Delete').eq(0).click();
    });
      cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete comment').click().should('not.exist');
      getIssueDetailsModal().should('not.contain', editComment);
    });
});
