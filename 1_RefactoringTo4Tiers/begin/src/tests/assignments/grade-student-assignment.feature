Feature: Grade Student Assignment
    As a teacher
    I want to grade a student's submitted assignment
    So that they can receive feedback and academic credit

  Scenario: Successfully grade a submitted assignment
    Given a student named "Alice" exists
    And an assignment "Lab Report 1" is assigned and submitted by the student
    When I grade the assignment with "A"
    Then the grading should be successful
    And the assignment should have the grade "A" in the system
    And the status should be "submitted"

  Scenario: Error when grading with missing information
    Given a student named "Bob" exists
    And an assignment "Final Exam" is assigned and submitted by the student
    When I try to grade the assignment without providing a grade
    Then I should receive a validation error
