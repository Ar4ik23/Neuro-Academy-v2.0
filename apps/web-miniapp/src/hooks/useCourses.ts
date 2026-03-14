import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { CourseDto, CourseDetailDto } from '@neuro-academy/types';

export const useCourses = () => {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<CourseDto[]>('/courses');
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refresh: fetchCourses };
};

export const useCourseDetail = (id: string) => {
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await apiClient.get<CourseDetailDto>(`/courses/${id}`);
      setCourse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refresh: fetchCourse };
};
