/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import CourseList from '@/components/admin/CourseList';

describe('CourseList Component', () => {
  it('renders the course list header', () => {
    render(<CourseList />);
    
    expect(screen.getByText('Courses')).toBeTruthy();
  });

  it('shows loading state when loading is true', () => {
    render(<CourseList loading={true} />);
    
    expect(screen.getByText('Loading courses...')).toBeTruthy();
  });

  it('displays course count when courses are provided', () => {
    const mockCourses = [
      { _id: '1', title: 'React Basics' },
      { _id: '2', title: 'Node.js Advanced' }
    ];
    
    render(<CourseList courses={mockCourses} />);
    
    expect(screen.getByText('2 total')).toBeTruthy();
  });

  it('renders course titles when courses are provided', () => {
    const mockCourses = [
      { _id: '1', title: 'React Basics' },
      { _id: '2', title: 'Node.js Advanced' }
    ];
    
    render(<CourseList courses={mockCourses} />);
    
    expect(screen.getByText('React Basics')).toBeTruthy();
    expect(screen.getByText('Node.js Advanced')).toBeTruthy();
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    const mockCourses = [
      { _id: '1', title: 'React Basics' }
    ];
    
    render(<CourseList courses={mockCourses} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTitle('Delete Course');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1', 'Course');
  });
});
