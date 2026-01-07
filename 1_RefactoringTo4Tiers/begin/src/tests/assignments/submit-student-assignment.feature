Feature: Submit Student Assignment
    As a student
    I want to submit an assignment for a class
    So that my work can be graded

  Scenario: Successfully submit an existing assignment
    Given a student named "Alice" exists
    And a class named "Biology 101" exists
    And the student is enrolled in the class
    And an assignment "Lab Report 1" is assigned to the student
    When I submit that assignment
    Then the submission should be successful
    And the assignment status should be "submitted" in the system

  Scenario: Error when submitting a non-existent assignment record
    When I try to submit an assignment with a non-existent ID
    Then I should receive an assignment not found error
