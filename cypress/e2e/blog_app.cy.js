describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      'username': 'squarebob117',
      'password': 'supersecret',
      'name': 'Spongebob'
    })
    cy.visit('http://localhost:3003')
  })

  it('login form is shown', function() {
    cy.contains('log in to application')
    cy.get('#div-login-username')
    cy.get('#div-login-password')
    cy.get('#button-login')
  })

  describe('Login', function() {
    it('succeeds with right credentials', function() {
      cy.contains('username')
        .find('input')
        .type('squarebob117')
      cy.contains('password')
        .find('input')
        .type('supersecret')
      cy.contains('login')
        .click()
      cy.contains('Spongebob logged in')
    })

    it('fails with wrong crendetials', function() {
      cy.contains('username')
        .find('input')
        .type('squarebob117')
      cy.contains('password')
        .find('input')
        .type('password1234')
      cy.contains('login')
        .click()
      cy.get('.errorMessage')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html')
        .should('not.contain', 'Spongebob logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'squarebob117', password: 'supersecret' })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title-input').type('Testing with Cypress')
      cy.get('#blog-author-input').type('Anonymous')
      cy.get('#blog-url-input').type('http://cypress.com')
      cy.contains('create').click()

      cy.contains('blog Testing with Cypress created.')
      cy.contains('Testing with Cypress Anonymous')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Testing', author: 'Anon', url: 'http://notreal.cs' })
      })

      it('it can be liked', function() {
        cy.contains('Testing Anon').parent().as('test1')
        cy.get('@test1').contains('more').click()
        cy.get('@test1')
          .should('contain', '0')
          .and('not.contain', '1')
        cy.get('@test1').contains('like').click()
        cy.get('@test1')
          .should('contain', '1')
          .and('not.contain', '0')
      })

      it('it can be deleted', function() {
        cy.on('window:confirm', function(str) {
          expect(str).to.eq('Delete blog Testing by Anon?')
        })
        cy.contains('Testing Anon').parent().as('test1')
        cy.get('@test1').contains('more').click()
        cy.get('@test1').contains('delete').click()
        cy.get('html')
          .should('contain', 'Testing by Anon deleted')
          .and('not.contain', 'Testing Anon')
      })

      it('it can only be deleted by it\'s creator', function() {
        cy.request('POST', 'http://localhost:3003/api/users', {
          'username': 'patrick',
          'password': 'patrick',
          'name': 'patrick'
        })
        cy.login({ username: 'patrick', password: 'patrick' })
        cy.contains('Testing Anon').parent().as('test1')
        cy.get('@test1').contains('more').click()
        cy.get('@test1').should('not.contain', 'delete')
      })
    })

    describe('and multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'No likes', author: 'Anon', url:'http://notreal.cs' })
        cy.createBlog({ title: 'One like', author: 'Anon', url:'http://notreal.cs' })
        cy.createBlog({ title: 'Two likes', author: 'Anon', url:'http://notreal.cs' })
      })

      it('blogs will be in descending order by likes', function() {
        cy.contains('Two likes Anon').parent().as('two')
        cy.get('@two').contains('button', 'more').click()
        cy.get('@two').contains('button', 'like').click()
        cy.get('@two').should('contain', '1')
        cy.get('@two').contains('button', 'like').click()
        cy.get('@two').should('contain', '2')

        cy.contains('One like Anon').parent().as('one')
        cy.get('@one').contains('button', 'more').click()
        cy.get('@one').contains('button', 'like').click()
        cy.get('@one').should('contain', '1')

        cy.contains('No likes Anon').parent().as('zero')
        cy.get('@zero').contains('button', 'more').click()
        cy.get('@zero').should('contain', '0')

        cy.get('.blog').eq(0).should('contain', 'Two likes Anon')
        cy.get('.blog').eq(1).should('contain', 'One like Anon')
        cy.get('.blog').eq(2).should('contain', 'No likes Anon')
      })
    })
  })
})
