/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import EnrollPage from "@/pages/enroll";

// Mock fetch for tests
global.fetch = jest.fn();


// Mock courses data for testing
const mockCourses = [
  { _id: "1", title: "Math 101" },
  { _id: "2", title: "History 202" },
];

const mockCoursesWithEnrollment = [
  { _id: "1", title: "Math 101", enrolledStudents: ["student1", "student2"] },
  { _id: "2", title: "History 202", enrolledStudents: [] },
  { _id: "3", title: "Science 101" }, // No enrolledStudents property
];

describe("EnrollPage component", () => {
  beforeEach(() => {
    // Mock window.alert
    window.alert = jest.fn();
    
    // Mock fetch to return courses
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockCourses),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays correct message when enroll button is clicked", async () => {
    render(<EnrollPage />);
    
    // Wait for the component to finish loading
    await screen.findByText("Math 101");
    
    // Use aria-label to precisely select the enroll button for "Math 101"
    fireEvent.click(screen.getByLabelText("Enroll in Math 101"));
    expect(window.alert).toHaveBeenCalledWith("You have enrolled in Math 101!");
  });

  it("displays empty state when no courses are available", async () => {
    // Mock fetch to return empty courses array
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    render(<EnrollPage />);
    
    // Wait for the empty state to appear
    await screen.findByText("No courses available");
    
    // Check that all empty state elements are present
    expect(screen.getByText("No courses available")).toBeTruthy();
    expect(screen.getByText("Check back soon for new learning opportunities!")).toBeTruthy();
  });

  it("displays enrolled students count correctly", async () => {
    // Mock fetch to return courses with different enrollment scenarios
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockCoursesWithEnrollment),
    });

    render(<EnrollPage />);
    
    // Wait for courses to load
    await screen.findByText("Math 101");
    
    // Check that enrolled student counts are displayed correctly
    expect(screen.getByText("2 enrolled")).toBeTruthy(); // Math 101 with 2 students
    expect(screen.getAllByText("0 enrolled")).toHaveLength(2); // History 202 with empty array and Science 101 with undefined
  });
});
