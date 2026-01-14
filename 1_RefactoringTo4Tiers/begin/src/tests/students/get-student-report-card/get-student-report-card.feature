Feature: Get Student Report Card
    As a student
    I want to view my submitted assignments and grades
    So that I can track my academic progress

  Scenario: Successfully retrieve submitted assignments
    Given a student named "Alice" exists
    And the student has the following assignments:
      | Title        | Status      | Grade |
      | Lab Report 1 | submitted   | A     |
      | Midterm      | submitted   | null  |
      | Homework 1   | NOT_STARTED | null  |
    When I request all submitted assignments for the student
    Then the response should contain 2 assignments
    And the assignments should be "Lab Report 1" and "Midterm"
    And "Homework 1" should NOT be in the list

  Scenario: Successfully retrieve graded assignments (Report Card)
    Given a student named "Bob" exists
    And the student has the following assignments:
      | Title        | Status    | Grade |
      | Lab Report 1 | submitted | A     |
      | Midterm      | submitted | null  |
      | Quiz 1       | submitted | B     |
    When I request the report card for the student
    Then the response should contain 2 graded assignments
    And the grades should be "A" and "B"
    And the "Midterm" should NOT be in the report card

  Scenario: Error when student does not exist
    When I request the report card for a non-existent student ID
    Then I should receive a student not found error
