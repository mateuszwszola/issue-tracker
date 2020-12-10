import { useApiUser } from 'contexts/api-user-context';
import { useState, useEffect } from 'react';

export function useIsAdmin() {
  const { user } = useApiUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(!!user?.is_admin);
  }, [user]);

  return {
    isAdmin
  };
}
