import { __awaiter } from "tslib";
import React from 'react';
import ReactDom from 'react-dom';
export const useAxe = () => {
    React.useEffect(() => {
        if (process.env['NODE_ENV'] !== 'production') {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                const { default: axe } = yield import('@axe-core/react');
                axe(React, ReactDom, 1000);
            }))();
        }
    }, []);
};
//# sourceMappingURL=use-axe.js.map