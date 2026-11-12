@regression @register
Feature: Customer Registration
  As a new ParaBank customer
  I want to register an online account
  So that I can access banking services

  Background:
    Given the user is on the ParaBank home page

  @smoke
  Scenario: Register a new customer with valid details
    When the user opens the registration page
    And the user registers with valid customer details from "users.json"
    Then the account should be created successfully
    And the welcome heading should show the new username
