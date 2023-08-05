const taskDescription = 'TASK TEST DESCRIPTION';
const taskTitle = 'TASK TEST TITLE';
function openTask(title) {
  cy.contains(title).click();
  cy.get('[data-testid="modal:issue-details"]').should('be.visible');
}
function addEstimation(value) {
  cy.get('input[placeholder="Number"]').type(`${value}{enter}`);
  cy.wait(3000);
}
function closeAndReopenIssue() {
  cy.get('[data-testid="icon:close"]').first().click();
  openTask(taskTitle);
}
function createTask(taskDescription, taskTitle) {
  cy.get('.ql-editor').type(taskDescription);
  cy.get('input[name="title"]').type(taskTitle);
  cy.get('[data-testid="select:userIds"]').click();
  cy.get('[data-testid="select-option:Lord Gaben"]').click();
  cy.get('button[type="submit"]').click();
}

describe('Issue time estimation and time logging functionalities', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', 'https://jira.ivorreic.com/project')
      .then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
      });
    createTask(taskDescription, taskTitle);
  });

  it('Should add, update, and remove estimation', () => {
    openTask(taskTitle);
    // add estimation
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .should('contain', 'No time logged')
      .and('not.contain', 'h estimated');
    addEstimation(10);
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .within(() => {
        cy.contains('10h estimated').should('be.visible');
      });
    closeAndReopenIssue();
    // assertions
    cy.get('input[placeholder="Number"]').should('be.visible').should('have.value', '10');
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .within(() => {
        cy.contains('10h estimated').should('be.visible');
      });
    // update estimation
    cy.get('input[placeholder="Number"]').clear().type('20{enter}');
    cy.wait(3000);
    closeAndReopenIssue();
    // assertions
    cy.get('input[placeholder="Number"]').should('be.visible').should('have.value', '20');
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .within(() => {
        cy.contains('20h estimated').should('be.visible');
      });
    // remove estimation
    cy.get('input[placeholder="Number"]').clear().type('{enter}');
    cy.wait(3000);
    closeAndReopenIssue();
    // assetions
    cy.get('input[placeholder="Number"]').should('be.visible').should('have.value', '');
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .within(() => {
        cy.contains('20h estimated').should('not.exist');
      });
  });

  it('Should log time and remove logged time', () => {
    openTask(taskTitle);
    addEstimation(10);
    // log time
    cy.get('[data-testid="icon:stopwatch"]').click();
    cy.get('[data-testid="modal:tracking"]').should('be.visible');
    cy.get('input[placeholder="Number"]').eq(1).clear().type('2{enter}');
    cy.get('input[placeholder="Number"]').eq(2).clear().type('5{enter}');
    cy.contains('button', 'Done').click();
    // assertions
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .within(() => {
        cy.contains('2h logged').should('be.visible');
        cy.contains('5h remaining').should('be.visible');
      });
    cy.contains('No time logged').should('not.exist');
    // remove logged time
    cy.get('[data-testid="icon:stopwatch"]').click();
    cy.get('[data-testid="modal:tracking"]').should('be.visible');
    cy.get('input[placeholder="Number"]').eq(1).clear().type('{enter}');
    cy.get('input[placeholder="Number"]').eq(2).clear().type('{enter}');
    cy.contains('button', 'Done').click();
    cy.wait(3000);
    // assertions
    cy.get('input[placeholder="Number"]').should('have.value', '10');
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .within(() => {
        cy.contains('2h logged').should('not.exist');
        cy.contains('5h remaining').should('not.exist');
        cy.contains('No time logged').should('be.visible');
        cy.contains('10h estimated').should('be.visible');
      });
  });
});
