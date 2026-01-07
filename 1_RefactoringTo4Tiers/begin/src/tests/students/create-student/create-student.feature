Feature: Create Student
    As a school system administrator
    I want to add new students to the system
    So that I can manage student records

  Rule: A valid student must have a name

    Scenario: Create a new student with valid data
      When I create a new student with the name "John Doe"
      Then the student "John Doe" should be added to the system

    Scenario: Try to create a student without name
      When I try to create a student without a name
      Then the student should not be created
      And I should receive an invalid input error
