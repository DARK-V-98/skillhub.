'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot } from 'firebase/firestore';

export const useCollection = <T extends DocumentData>(query: Query<T> | null) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (querySnapshot: QuerySnapshot<T>) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error(err);
      }
    );

    return () => unsubscribe();
  // Using JSON.stringify on the query is a common way to memoize it, but it can be brittle.
  // For 'in'/'array-contains-any' queries, where the array can change, this is necessary to trigger refetch.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query?._query)]);

  return { data, loading, error };
};
