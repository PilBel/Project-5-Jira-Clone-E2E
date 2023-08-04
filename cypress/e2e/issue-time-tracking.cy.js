
describe('Issue create estimated time tracking', () => {

    const issueTitle = 'Time tracking 1'
    const issueDescription = 'Time tracking issue created'
    const issueEstimatedTime = '10h estimated'
    const updatedEstimatedTime = '20h estimated'
    const estimatedHours = '10'
    const updatedEstimatedHours = '20'
    const timeSpentHours = '2'
    const timeRemainingHours = '5'


    beforeEach(() => {

        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
            cy.get('[data-testid="modal:issue-create"]').within(() => {


                cy.get('[data-testid="select:type"]').click();
                cy.wait(5000);
                cy.get('[data-testid="select-option:Story"]').trigger('click');
                cy.get('.ql-editor').type(issueDescription);
                cy.get('input[name="title"]').type(issueTitle);
                cy.get('[data-testid="select:userIds"]').click();
                cy.get('[data-testid="select-option:Baby Yoda"]').click();
                cy.get('button[type="submit"]').click();
                cy.get('[data-testid="modal:issue-create"]').should('not.exist');
                
            });
        })
    });


    it('Should add, edit and delete time estimation', () => {
        // Add the time estimation
        cy.get('[data-testid="list-issue"]');
        cy.contains(issueTitle).click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.contains('No time logged').should('be.visible');
        cy.contains('Original Estimate (hours)').next().click();
        cy.get('input[placeholder="Number"]').type(estimatedHours);
        cy.contains(issueEstimatedTime).should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="modal:issue-details"]').should('not.exist');


        cy.contains(issueTitle).click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.contains(issueEstimatedTime).should('be.visible');

        cy.contains('Original Estimate (hours)').next().within(() => {
            cy.get('[placeholder="Number"]').click().should('have.value', estimatedHours);
        })

        // Edit the time estimation
        cy.contains('Original Estimate (hours)').next().click();
        cy.get('input[placeholder="Number"]').clear().type(updatedEstimatedHours);
        cy.contains(updatedEstimatedTime).should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="modal:issue-details"]').should('not.exist')
        cy.wait(1000);

        cy.contains(issueTitle).click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.contains(updatedEstimatedTime).should('be.visible');

        cy.contains('Original Estimate (hours)').next().within(() => {
            cy.get('[placeholder="Number"]').click().should('have.value', updatedEstimatedHours);
        })

        //Delete the time estimation
        cy.contains('Original Estimate (hours)').next().click();
        cy.get('input[placeholder="Number"]').clear();
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="modal:issue-details"]').should('not.exist');
        cy.wait(1000);

        cy.contains(issueTitle).click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.contains('Original Estimate (hours)').next().within(() => {
            cy.get('[placeholder="Number"]').should('be.visible');
        });
    });

    it('Should test the time logging functionality', () => {

        cy.get('[data-testid="list-issue"]');
        cy.contains(issueTitle).click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible');
        cy.get('input[placeholder="Number"]').eq(1).type(timeSpentHours)
        cy.get('input[placeholder="Number"]').eq(2).type(timeRemainingHours);
        cy.get('[data-testid="modal:tracking"]').contains('Done').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');

        cy.contains('Time Tracking').next().click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible');
        cy.contains('Time spent (hours)').next().click().clear();
        cy.contains('Time remaining (hours)').next().click().clear();
        cy.get('[data-testid="modal:tracking"]').contains('Done').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.contains('No time logged').should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click();

    });
});

