import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface AvailabilityData {
  product_id: number;
  size: string;
  booked_dates: string[];
  available_sizes: string[];
}

export const useAvailability = (productId?: number, size?: string) => {
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!productId || !size) {
      setAvailability(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/rental_bookings/availability`, {
        params: { product_id: productId, size }
      });
      setAvailability(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  }, [productId, size]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return { availability, loading, error, refetch: fetchAvailability };
};
