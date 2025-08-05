/**
 * @jest-environment jsdom
 */
import { api, studentsApi, coursesApi, professorsApi, enrollApi } from '@/lib/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Utility Functions', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('api function', () => {
    it('makes successful API calls', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await api('/test');

      expect(fetch).toHaveBeenCalledWith('/test', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockData);
    });

    it('passes options correctly', async () => {
      const mockData = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const options = {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
      };

      await api('/test', options);

      expect(fetch).toHaveBeenCalledWith('/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
      });
    });

    it('throws error when response is not ok', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(api('/test')).rejects.toThrow('HTTP 404');
    });

    it('throws error when response is 500', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api('/test')).rejects.toThrow('HTTP 500');
    });
  });

  describe('studentsApi', () => {
    it('getAll calls correct endpoint', async () => {
      const mockStudents = [{ id: 1, name: 'Student 1' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockStudents),
      });

      const result = await studentsApi.getAll();

      expect(fetch).toHaveBeenCalledWith('/api/students', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockStudents);
    });

    it('delete calls correct endpoint with DELETE method', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });

      await studentsApi.delete('123');

      expect(fetch).toHaveBeenCalledWith('/api/students/123', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });
    });
  });

  describe('coursesApi', () => {
    it('getAll calls correct endpoint', async () => {
      const mockCourses = [{ id: 1, title: 'Course 1' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCourses),
      });

      const result = await coursesApi.getAll();

      expect(fetch).toHaveBeenCalledWith('/api/courses', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockCourses);
    });

    it('delete calls correct endpoint with DELETE method', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });

      await coursesApi.delete('456');

      expect(fetch).toHaveBeenCalledWith('/api/courses/456', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });
    });

    it('create calls correct endpoint with POST method', async () => {
      const courseData = { title: 'New Course', description: 'Test' };
      const mockResponse = { id: 1, ...courseData };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await coursesApi.create(courseData);

      expect(fetch).toHaveBeenCalledWith('/api/courses', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(courseData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('professorsApi', () => {
    it('getAll calls correct endpoint', async () => {
      const mockProfessors = [{ id: 1, name: 'Professor 1' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProfessors),
      });

      const result = await professorsApi.getAll();

      expect(fetch).toHaveBeenCalledWith('/api/professors', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockProfessors);
    });
  });

  describe('enrollApi', () => {
    it('enroll calls correct endpoint with POST method', async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await enrollApi.enroll('student123', 'course456');

      expect(fetch).toHaveBeenCalledWith('/api/enroll', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ studentId: 'student123', courseId: 'course456' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error handling coverage', () => {
    it('handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api('/test')).rejects.toThrow('Network error');
    });

    it('handles fetch rejections in studentsApi', async () => {
      fetch.mockRejectedValueOnce(new Error('Server error'));

      await expect(studentsApi.getAll()).rejects.toThrow('Server error');
    });

    it('handles fetch rejections in coursesApi', async () => {
      fetch.mockRejectedValueOnce(new Error('Server error'));

      await expect(coursesApi.getAll()).rejects.toThrow('Server error');
    });

    it('handles fetch rejections in professorsApi', async () => {
      fetch.mockRejectedValueOnce(new Error('Server error'));

      await expect(professorsApi.getAll()).rejects.toThrow('Server error');
    });

    it('handles fetch rejections in enrollApi', async () => {
      fetch.mockRejectedValueOnce(new Error('Server error'));

      await expect(enrollApi.enroll('123', '456')).rejects.toThrow('Server error');
    });
  });
});
