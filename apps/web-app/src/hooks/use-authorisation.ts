import { useState } from 'react';
import { useEffect } from 'react';
import { currentUser } from '../aws/authenticate';
import Router from 'next/router';

export const useAuthorisation = (authorisedGroups?: ReadonlyArray<string>) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const user = await currentUser();
        const authorised =
          Boolean(user) &&
          (!authorisedGroups ||
            authorisedGroups?.length === 0 ||
            authorisedGroups?.some((group) =>
              user?.signInUserSession.accessToken.payload[
                'cognito:groups'
              ]?.includes(group)
            ));

        if (!authorised) {
          // eslint-disable-next-line fp/no-mutating-methods
          await Router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading };
};
