/**
 * This is an example file and approach for POM in Cypress
 */
import { fa } from "faker/lib/locales";
import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //open issue detail modal with title from line 16  
      cy.contains(issueTitle).click();
    });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = 'This is an issue of type: Task.';

  it('Should delete issue successfully', () => {
    // steps to delete issue
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.validateIssueVisibilityState(issueTitle, false);
    //IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    //IssueModal.checkIssueVisibilityOnBoard(issueTitle,false)
    //IssueModal.checkIssueOnBoard(issueTitle, 'not.exist');

  });

  it('Should cancel deletion process successfully', () => {
    // steps to start deletion proces but cancel it
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.validateIssueVisibilityState(issueTitle, true);
    
    
    //IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
    //IssueModal.checkIssueVisibilityOnBoard(issueTitle,true);
    //IssueModal.checkIssueOnBoard(issueTitle, 'be.visible');





    




  });
});
