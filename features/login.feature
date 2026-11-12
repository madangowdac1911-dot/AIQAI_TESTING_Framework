@regression @login
Feature: Customer Login
  As a registered ParaBank customer
  I want to log in to my account
  So that I can view my accounts overview

  Background:
    Given the user is on the ParaBank home page

  @smoke
  Scenario: Login with valid credentials
    When the user logs in with valid credentials
    Then the Accounts Overview page should be displayed
    And the welcome message should be visible

  @negative
  Scenario Outline: Login fails with invalid credentials - <case>
    When the user logs in with "<dataKey>" credentials from test data
    Then the invalid credentials error should be displayed

    Examples:
      | case           | dataKey       |
      | wrong password | wrongPassword |
      | unknown user   | unknownUser   |

  @negative
  Scenario: Login fails with empty credentials
    When the user logs in with username "" and password ""
    Then the login error message "Please enter a username and password." should be displayed
