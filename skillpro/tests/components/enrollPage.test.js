/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import EnrollPage, { getServerSideProps } from '../../pages/enroll';

const mockCourses = [
  { _id: '1', title: 'Math 101' },
  { _id: '2', title: 'History 202' },
];

describe('EnrollPage component', () => {
  beforeEach(() => {
    // Mock window.alert
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<EnrollPage courses={mockCourses} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('alerts correct message on enroll button click', () => {
    render(<EnrollPage courses={mockCourses} />);
    // Use aria-label (in the enroll react component) to precisely select the enroll button for "Math 101"
    fireEvent.click(screen.getByLabelText('Enroll in Math 101'));
    expect(window.alert).toHaveBeenCalledWith('You have enrolled in Math 101!');
  });
});

describe('getServerSideProps', () => {
  afterEach(() => {
    jest.clearAllMocks();
    // Reset NODE_ENV after each test
    process.env.NODE_ENV = 'test';
  });

  // Helper to mock global.fetch returning JSON data
  const fetchMock = (data) =>
    jest.fn().mockResolvedValue({ json: () => Promise.resolve(data) });

  it('fetches courses with http in development', async () => {
    global.fetch = fetchMock(mockCourses);

    const result = await getServerSideProps({
      req: { headers: { host: 'localhost:3000' } },
    });

    // Expect http protocol during development environment
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/courses');
    expect(result).toEqual({ props: { courses: mockCourses } });
  });

  it('fetches courses with https in production', async () => {
    process.env.NODE_ENV = 'production'; // Simulate production environment
    const prodCourses = [{ _id: '3', title: 'Physics 303' }];
    global.fetch = fetchMock(prodCourses);

    const result = await getServerSideProps({
      req: { headers: { host: 'example.com' } },
    });

    // Expect https protocol in production
    expect(fetch).toHaveBeenCalledWith('https://example.com/api/courses');
    expect(result).toEqual({ props: { courses: prodCourses } });
  });
});
