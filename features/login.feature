#Feature: Login Page Validation

#Scenario: Verify login page loads successfully
 #         Given user navigates to application URL
  #        Then login page should be displayed



Feature: Login Page Validation

  As a user
  I want to access and view the login page
  So that I can authenticate into the application

  Background:
    Given user navigates to application URL

  # Navigation Validation

  Scenario: Verify login page loads successfully
    Then login page should be displayed

  # TS01 – Validate login page UI elements are displayed correctly

  Scenario: Verify OrangeHRM logo is displayed at the top center of the page
    Then the OrangeHRM logo should be visible
    And the logo should be aligned at the top center of the page

  Scenario: Verify "Login" heading text is displayed correctly
    Then the "Login" heading should be visible
    And the heading text should be correctly spelled

  Scenario: Verify Username label and icon are displayed correctly
    Then the "Username" label should be visible
    And the username icon should be displayed next to the label

  Scenario: Verify Password label and icon are displayed correctly
    Then the "Password" label should be visible
    And the password icon should be displayed next to the label

  Scenario: Verify Login button is displayed with correct text and color
    Then the Login button should be visible
    And the button text should be "Login"
    And the button color should match the design specification

  Scenario: Verify grey information box displays default credentials correctly
    Then the grey information box should be visible
    And it should display "Username : Admin"
    And it should display "Password : admin123"

  Scenario: Verify "OrangeHRM OS 5.8" version text is displayed
    Then the version text "OrangeHRM OS 5.8" should be visible on the page

  Scenario: Verify copyright text is displayed correctly
    Then the copyright text should be visible
    And it should display "© 2005 - 2026"
    And it should display "All rights reserved."

  Scenario: Verify social media icons are displayed
    Then the LinkedIn icon should be visible
    And the Facebook icon should be visible
    And the Twitter icon should be visible
    And the YouTube icon should be visible



