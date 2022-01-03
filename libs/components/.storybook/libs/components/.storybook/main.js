"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const rootMain = require('../../../.storybook/main');
module.exports = Object.assign(Object.assign({}, rootMain), { core: Object.assign(Object.assign({}, rootMain.core), { builder: 'webpack5' }), stories: [
        ...rootMain.stories,
        '../src/lib/**/*.stories.mdx',
        '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
    ], addons: [...rootMain.addons, '@nrwl/react/plugins/storybook'], webpackFinal: (config, { configType }) => __awaiter(void 0, void 0, void 0, function* () {
        // apply any global webpack configs that might have been specified in .storybook/main.js
        if (rootMain.webpackFinal) {
            config = yield rootMain.webpackFinal(config, { configType });
        }
        // add your own webpack tweaks if needed
        return config;
    }) });
//# sourceMappingURL=main.js.map