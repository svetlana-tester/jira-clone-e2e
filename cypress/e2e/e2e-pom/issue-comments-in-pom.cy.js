import { fa } from 'faker/lib/locales';
import IssueModal from '../../pages/IssueModal';

const issueTitle = 'This is an issue of type: Task.'

describe('Issue comments creating, editing and deleting', () => {
  beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
          cy.visit(url + '/board');
          cy.contains(issueTitle).click();
      });
  });
  
  it('Should create, edit and delete a comment', () => {
    const addNewComment = 'A new test comment'
    const editNewComment = 'Changing a test comment'
    IssueModal.addComment(addNewComment);
    IssueModal.editComment(addNewComment, editNewComment);
    IssueModal.deleteComment();
    IssueModal.confirmEditedCommentDeletion(editNewComment);
})
})
