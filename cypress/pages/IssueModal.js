class IssueModal {
  constructor() {
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = '.ql-editor';
    this.assignee = '[data-testid="select:userIds"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.deleteButton = '[data-testid="icon:trash"]';
    this.deleteButtonName = 'Delete issue';
    this.cancelDeletionButtonName = 'Cancel';
    this.confirmationPopup = '[data-testid="modal:confirm"]';
    this.closeDetailModalButton = '[data-testid="icon:close"]';
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  selectIssueType(issueType) {
    cy.get(this.issueType).click('bottomRight');
    cy.get(`[data-testid="select-option:${issueType}"]`).trigger('mouseover').trigger('click');
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click('bottomRight');
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).debounced('type', title);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.selectIssueType(issueDetails.type);
      this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
  }

  ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
    cy.get(this.issueModal).should('not.exist');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get(this.backlogList)
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get(this.issuesList)
          .should('have.length', expectedAmountIssues)
          .first()
          .find('p')
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should('be.visible');
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    cy.contains(issueTitle).should('be.visible');
  }

  checkIssueVisibilityOnBoard(issueTitle, isVisible) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    //One option
    // let visibilityCheck;
    // isVisible ? visibilityCheck = 'be.visible' : visibilityCheck = 'not.exist';
    // cy.contains(issueTitle).should(visibilityCheck);

    //Other option
    if (isVisible) cy.contains(issueTitle).should('be.visible');
    else cy.contains(issueTitle).should('not.exist');
  }

  validateIssueVisibilityState(issueTitle, isVisible = true) {
    // Valeria's feedback comment
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    if (isVisible) cy.contains(issueTitle).should('be.visible');
    else cy.contains(issueTitle).should('not.exist');
  }

  checkIssueOnBoard(issueTitleName, check) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    cy.contains(issueTitleName).should(check);
  }

  ensureIssueIsNotVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    cy.contains(issueTitle).should('not.exist');
  }

  clickDeleteButton() {
    cy.get(this.deleteButton).click();
    cy.get(this.confirmationPopup).should('be.visible');
  }

  confirmDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.deleteButtonName).click();
    });
    cy.get(this.confirmationPopup).should('not.exist');
    cy.get(this.backlogList).should('be.visible');
  }

  cancelDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.cancelDeletionButtonName).click();
    });
    cy.get(this.confirmationPopup).should('not.exist');
    cy.get(this.issueDetailModal).should('be.visible');
  }

  closeDetailModal() {
    cy.get(this.issueDetailModal).get(this.closeDetailModalButton).first().click();
    cy.get(this.issueDetailModal).should('not.exist');
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should('not.exist');
    cy.reload();
    cy.contains(issueTitle).should('be.visible');
  }

  addComment(addNewComment) {
    this.getIssueDetailModal().within(() => {
      cy.contains('Add a comment...').click();
      cy.get('textarea[placeholder="Add a comment..."]').type(addNewComment);
      cy.contains('button', 'Save').click().should('not.exist');
      cy.get('[data-testid="issue-comment"]').should('contain', addNewComment);
    });
  }

  editComment(addNewComment, editNewComment) {
    this.getIssueDetailModal().within(() => {
      cy.contains('div', 'Edit').eq(0).click().should('not.exist');
      cy.get('textarea').contains(addNewComment).clear().type(editNewComment);
      cy.contains('button', 'Save').click().should('not.exist');
      cy.get('[data-testid="issue-comment"]').should('contain', editNewComment);
    });
  }

  deleteComment() {
    this.getIssueDetailModal().within(() => {
      cy.contains('Delete').click();
    });
  }

  confirmEditedCommentDeletion(editNewComment) {
    cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete comment')
          .click().should('not.exist');
      this.getIssueDetailModal().contains(editNewComment).should('not.exist');
  }
}

export default new IssueModal();
