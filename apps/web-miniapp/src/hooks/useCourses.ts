"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { CourseDto } from '@neuro-academy/types';

export const useCourses = () => {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get<CourseDto[]>('/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return { courses, loading, error };
};
