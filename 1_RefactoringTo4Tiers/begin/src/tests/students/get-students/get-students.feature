Feature: Get Students
    As a school system administrator
    I want to be able to retrieve a list of all students
    So that I can see who is currently enrolled in the school

  Scenario: Retrieve all students successfully in alphabetical order
    Given the following students exist in the system:
      | name    |
      | Charlie |
      | Alice   |
    When I request a list of all students
    Then I should receive a successful response containing 2 students
    And the students should be returned in alphabetical order: "Alice", "Charlie"
    And each student should include their full profile information
