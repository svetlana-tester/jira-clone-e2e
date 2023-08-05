import { faker } from '@faker-js/faker';
const fakerTitle = faker.lorem.word();
const fakerDescription = faker.lorem.sentence();

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', 'https://jira.ivorreic.com/project')
      .then((url) => {
        //System will already open issue creating modal in beforeEach block
        cy.visit(url + '/board?modal-issue-create=true');
      });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // checking task optio

      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');

      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        //Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]').should('have.length', '5').first().find('p').contains('TEST_TITLE');
        //Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
        cy.get('[data-testid="icon:story"]').should('be.visible');
      });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });

  it('Test 1 - Should create a Bug and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //open issue type dropdown and choose Bug
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').trigger('click');

      //Type value to description input field
      cy.get('.ql-editor').type('My bug description');

      //Type value to title input field
      cy.get('input[name="title"]').type('Bug');

      //Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        //Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]').should('have.length', '5').first().find('p').contains('Bug');
        //Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
        cy.get('[data-testid="icon:story"]').should('be.visible');
      });
  });

  it('Test 2 - Asserts that the task with the random data is created and visible on the board', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Checking that Task option is selected
      cy.get('div[data-testid="select:type"]')
        .should('have.text', 'Task')
        .then(() => {});
      // Description faker
      cy.get('.ql-editor').type(fakerDescription);

      // Title faker
      cy.get('input[name="title"]').type(fakerTitle);

      //Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select Low priority
      cy.get('div[data-testid="select:priority"]').click();
      cy.get('.sc-iqzUVk.cUBVJX').contains('Low').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        //Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]').should('have.length', '5').first().find('p').contains(fakerTitle);
        cy.get('[data-testid="icon:task"]').should('be.visible');
      });
  });

  it.only('Verify app removes unnecessary spaces on the board view', () => {
    // define issue title as a variable with multiple spaces between words
    const issueTitle = '   Short summary   ';
    // trim extra spaces
    const trimmedTitle = issueTitle.trim();
    //create issue with title 'short summary'
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('input[name="title"]').type(issueTitle);
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('button[type="submit"]').click();
    });
    cy.wait(3000);
    cy.get('[data-testid="board-list:backlog"]').first().should('contain', trimmedTitle)
  });
});
