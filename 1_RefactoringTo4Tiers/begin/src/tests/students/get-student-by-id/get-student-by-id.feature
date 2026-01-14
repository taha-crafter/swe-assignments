Feature: Get Student By ID
    As a school system administrator
    I want to be able to retrieve a specific student by their ID
    So that I can view their individual profile and academic record

  Scenario: Retrieve an existing student successfully
    Given a student named "John Doe" exists in the system
    When I request the student by their ID
    Then I should receive a successful response for "John Doe"
    And the response should include the full profile information

  Scenario: Error when student does not exist
    Given no student exists with the ID "00000000-0000-4000-a000-000000000000"
    When I request a student with that ID
    Then I should receive a not found error

  Scenario: Error when ID format is invalid
    When I request a student with an invalid ID "not-a-uuid"
    Then I should receive an invalid input error
