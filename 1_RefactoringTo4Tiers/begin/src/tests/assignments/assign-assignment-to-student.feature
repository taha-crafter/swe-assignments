Feature: Assign Assignment to Student
    As a Teacher
    I want to assign an assignment to a student
    So that they can start working on it

  Scenario: Successfully assign an assignment to a student
    Given a student named "Alice" exists
    And a class named "Biology 101" exists
    And the student is enrolled in the class
    And an assignment "Lab Report 1" exists for the class
    When I assign the assignment to the student
    Then the assignment should be successfully assigned
    And the assignment record should exist in the system for that student

  Scenario: Error when assignment does not exist
    Given a student named "Bob" exists
    When I try to assign a non-existent assignment
    Then I should receive an assignment not found error
