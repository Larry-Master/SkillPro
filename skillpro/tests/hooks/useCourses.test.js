/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useCourses } from '@/hooks/useCourses';

// Mock fetch globally
global.fetch = jest.fn();

describe('useCourses Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('successfully fetches courses', async () => {
    const mockCourses = [
      { _id: '1', title: 'Math 101' },
      { _id: '2', title: 'History 202' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockCourses),
    });

    const { result } = renderHook(() => useCourses());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.courses).toEqual([]);

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.courses).toEqual(mockCourses);
  });

  it('handles fetch errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCourses());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.courses).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('provides deleteCourse function', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce([]),
    });

    const { result } = renderHook(() => useCourses());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(typeof result.current.deleteCourse).toBe('function');
  });

  it('successfully deletes a course', async () => {
    const mockCourses = [
      { _id: '1', title: 'Math 101' },
      { _id: '2', title: 'History 202' }
    ];

    // Mock initial fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockCourses),
    });

    const { result } = renderHook(() => useCourses());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Mock delete API call
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ success: true }),
    });

    let deleteResult;
    await act(async () => {
      deleteResult = await result.current.deleteCourse('1');
    });

    expect(deleteResult).toBe(true);
    expect(result.current.courses).toEqual([{ _id: '2', title: 'History 202' }]);
  });

  it('handles delete course errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockCourses = [
      { _id: '1', title: 'Math 101' },
      { _id: '2', title: 'History 202' }
    ];

    // Mock initial fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockCourses),
    });

    const { result } = renderHook(() => useCourses());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Mock delete API call failure
    fetch.mockRejectedValueOnce(new Error('Delete failed'));

    let deleteResult;
    await act(async () => {
      deleteResult = await result.current.deleteCourse('1');
    });

    expect(deleteResult).toBe(false);
    expect(result.current.courses).toEqual(mockCourses); // Should remain unchanged
    expect(consoleSpy).toHaveBeenCalledWith('Delete failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
