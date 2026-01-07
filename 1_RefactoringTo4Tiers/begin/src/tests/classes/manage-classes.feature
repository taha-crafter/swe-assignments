Feature: Manage Classes
    As a teacher
    I want to create and view classes
    So that I can organize my courses

  Scenario: Successfully create a class
    When I create a class named "Biology 101"
    Then the class should be successfully created
    And the class should have the name "Biology 101"

  Scenario: Error when creating class without a name
    When I try to create a class without a name
    Then I should receive a validation error

  Scenario: View assignments for a class
    Given a class named "Chemistry 202" exists
    And the class has assignments "Midterm" and "Final"
    When I request the assignments for that class
    Then I should receive 2 assignments
    And the assignments should include "Midterm" and "Final"
