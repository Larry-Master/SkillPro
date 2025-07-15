/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import EnrollPage, { getServerSideProps } from '../../pages/enroll';

describe('EnrollPage component', () => {
  const mockCourses = [
    { _id: '1', title: 'Math 101' },
    { _id: '2', title: 'History 202' },
  ];

  beforeAll(() => {
    // Mock window.alert so it doesn't actually pop up
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<EnrollPage courses={mockCourses} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls alert with course title on enroll button click', () => {
    render(<EnrollPage courses={mockCourses} />);
    const firstCourse = screen.getByText('Math 101');
    const enrollButton = firstCourse.parentElement.querySelector('button');
    fireEvent.click(enrollButton);
    expect(window.alert).toHaveBeenCalledWith('You have enrolled in Math 101!');
  });
});

describe('getServerSideProps', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { _id: '1', title: 'Math 101' },
            { _id: '2', title: 'History 202' },
          ]),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches courses and returns as props', async () => {
    const context = {
      req: { headers: { host: 'localhost:3000' } },
    };

    const result = await getServerSideProps(context);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/courses');
    expect(result).toEqual({
      props: {
        courses: [
          { _id: '1', title: 'Math 101' },
          { _id: '2', title: 'History 202' },
        ],
      },
    });
  });
  it('uses https in production for getServerSideProps', async () => {
    process.env.NODE_ENV = 'production'; // Simulate production

    const context = {
      req: { headers: { host: 'example.com' } },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ _id: '3', title: 'Physics 303' }]),
      })
    );

    const result = await getServerSideProps(context);

    expect(fetch).toHaveBeenCalledWith('https://example.com/api/courses');
    expect(result).toEqual({
      props: {
        courses: [{ _id: '3', title: 'Physics 303' }],
      },
    });

    process.env.NODE_ENV = 'test'; // Reset for safety
  });
});
