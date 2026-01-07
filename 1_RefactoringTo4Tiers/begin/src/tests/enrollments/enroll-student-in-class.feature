Feature: Enroll Student in Class
    As a school registrar
    I want to enroll a student in a class
    So that they can participate in the course and receive grades

  Scenario: Successfully enroll a student in a class
    Given a student named "Alice" exists
    And a class named "Biology 101" exists
    When I enroll the student in the class
    Then the student should be successfully enrolled
    And the enrollment should be recorded in the system

  Scenario: Error when student is already enrolled
    Given a student named "Bob" is already enrolled in "Math 202"
    When I try to enroll the student in the class again
    Then I should receive an "already enrolled" error

  Scenario: Error when student does not exist
    Given a class named "History 303" exists
    When I try to enroll a non-existent student in the class
    Then I should receive a student not found error

  Scenario: Error when class does not exist
    Given a student named "Charlie" exists
    When I try to enroll the student in a non-existent class
    Then I should receive a class not found error
