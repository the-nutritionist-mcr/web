import React from 'react';
import ReactDom from 'react-dom';

export const useAxe = () => {
  React.useEffect(() => {
    if (process.env['NODE_ENV'] !== 'production') {
      (async () => {
        const { default: axe } = await import('@axe-core/react');
        axe(React, ReactDom, 1000);
      })();
    }
  }, []);
};
