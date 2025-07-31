/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import EnrollPage from "@/pages/enroll";

// Mock courses data for testing
const mockCourses = [
  { _id: "1", title: "Math 101" },
  { _id: "2", title: "History 202" },
];

describe("EnrollPage component", () => {
  beforeEach(() => {
    // Mock window.alert
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays correct message when enroll button is clicked", () => {
    render(<EnrollPage courses={mockCourses} />);
    // Use aria-label (in the enroll react component) to precisely select the enroll button for "Math 101"
    fireEvent.click(screen.getByLabelText("Enroll in Math 101"));
    expect(window.alert).toHaveBeenCalledWith("You have enrolled in Math 101!");
  });
});

describe("getServerSideProps", () => {
  it("fetches courses with http in development", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockCourses),
    });
    global.fetch = fetchMock(mockCourses);

    const result = await getServerSideProps({
      req: { headers: { host: "localhost:3000" } },
    });

    expect(result).toEqual({
      props: { courses: mockCourses },
    });
  });

  it("fetches courses with https in production", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockCourses),
    });
    global.fetch = fetchMock(mockCourses);

    const result = await getServerSideProps({
      req: { headers: { host: "skillpro.com" } },
    });

    expect(result).toEqual({
      props: { courses: mockCourses },
    });
  });
});
