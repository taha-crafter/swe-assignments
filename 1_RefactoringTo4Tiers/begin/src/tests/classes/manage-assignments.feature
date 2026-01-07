Feature: Manage Assignments
    As a teacher
    I want to create and view assignments
    So that I can give students work to complete

  Scenario: Successfully create an assignment
    Given a class named "Math 101" exists
    When I create an assignment "Homework 1" for that class
    Then the assignment should be successfully created
    And the assignment should have the title "Homework 1"

  Scenario: Error when creating assignment without required fields
    When I try to create an assignment without a class ID
    Then I should receive a validation error

  Scenario: View a specific assignment by ID
    Given a class named "Physics 201" exists
    And an assignment "Lab Report" exists for that class
    When I request the assignment by its ID
    Then I should receive the assignment details
    And the title should be "Lab Report"

  Scenario: Error when assignment does not exist
    When I request an assignment with a non-existent ID
    Then I should receive an assignment not found error
