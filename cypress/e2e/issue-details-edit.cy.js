describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]').trigger('mouseover').trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]').clear().type(title).blur();

      cy.get('.ql-snow').click().should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save').click().should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

  it('Should check dropdown priority', () => {
    const expectedLength = 5;
    let priorityOptionsArray = [];

    // Include the initially selected option into the array
    cy.get('[data-testid="select:priority"]')
      .invoke('text')
      .then((initiallySelectedOption) => {
        priorityOptionsArray.push(initiallySelectedOption);
        cy.log(`Added value: ${initiallySelectedOption}, Array length: ${priorityOptionsArray.length}`);
      });
    // open priority list
    cy.contains('Priority').next().click();
    // Access the list of all priority options
    cy.get('[data-testid^="select-option:"]').then((options) => {
      Array.from(options).forEach((option) => {
        // Get the text value of the current option and push it into the array
        const optionText = option.innerText;
        priorityOptionsArray.push(optionText);
        cy.log(`Added value: ${optionText}, Array length: ${priorityOptionsArray.length}`);
      });

      // Assert that the created array has the same length as the expected number of elements
      cy.wrap(priorityOptionsArray).should('have.length', expectedLength);
    });
  });

  const reporterName = 'Baby Yoda';

  it('Reporter name should only have characters', () => {
    cy.get('[data-testid="select:reporter"]')
      .invoke('text')
      .then((reporterName) => {
        const regex = /^[A-Za-z ]*$/;
        cy.wrap(reporterName).should('match', regex);
      });
  });
});
