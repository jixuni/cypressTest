context('Testing search features', () => {
  beforeEach(() => {
    cy.visit('https://checkout.broadway.com/');
  });

  const testObj = {
    testArr: [
      'Hamilton',
      'Mean Girls',
      'Frozen',
      'Pretty Woman',
      'To Kill a Mockingbird',
      'The Lion King'
    ],
    viewPorts: ['macbook-15', 'ipad-2', 'iphone-6', 'iphone-3', [2560, 1440]]
  };

  // Check server question
  it('Initial server request', () => {
    cy.request('https://checkout.broadway.com/').should(response => {
      expect(response.status).to.eq(200);
    });
  });
  // Mobile test
  testObj.viewPorts.forEach(view => {
    it(`Search on different ${view} size`, () => {
      if (Cypress._.isArray(view)) {
        cy.viewport(view[0], view[1]);
      } else {
        cy.viewport(view);
      }
      cy.get('input[type="text"]').should('be.visible');
    });
  });

  // Check if application is showing any data
  it('Should have more contain at least 1 data(shows)', () => {
    cy.get('.col-lg-8 > :nth-child(1) > ').should('have.length.greaterThan', 0);
  });

  // Loops through the array and test value of value should equal the input query
  it('Check search response', () => {
    testObj.testArr.forEach(element => {
      cy.get('input[type="text"]')
        .type(element)
        .should('have.value', element)
        .clear();
    });
  });

  // Test to see if search result is shown for input
  it('Check if Search returns anything', () => {
    cy.get('input[type="text"]').type('Hamilton');

    cy.get('.ShowsItem__body__1HGdC > .lh-sm').should($div => {
      const text = $div.text();

      expect(text).to.include('Hamilton');
    });
  });

  // Iterate over the array and and check if clear button is working
  it('Check if clear button works', () => {
    testObj.testArr.forEach(element => {
      cy.get('input[type="text"]')
        .type(element)
        .then(() => {
          cy.get('.SearchInput__close-icon__2NWnG')
            .click()
            .should('have.value', '');
        });
    });
  });
});
