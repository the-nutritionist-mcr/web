"use strict";
(() => {
var exports = {};
exports.id = 405;
exports.ids = [405];
exports.modules = {

/***/ 4347:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getStaticProps": () => (/* binding */ getStaticProps),
/* harmony export */   "getStaticPaths": () => (/* binding */ getStaticPaths),
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps),
/* harmony export */   "unstable_getStaticParams": () => (/* binding */ unstable_getStaticParams),
/* harmony export */   "unstable_getStaticProps": () => (/* binding */ unstable_getStaticProps),
/* harmony export */   "unstable_getStaticPaths": () => (/* binding */ unstable_getStaticPaths),
/* harmony export */   "unstable_getServerProps": () => (/* binding */ unstable_getServerProps),
/* harmony export */   "config": () => (/* binding */ config),
/* harmony export */   "_app": () => (/* binding */ _app),
/* harmony export */   "renderReqToHTML": () => (/* binding */ renderReqToHTML),
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var next_dist_server_node_polyfill_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(855);
/* harmony import */ var next_dist_server_node_polyfill_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_node_polyfill_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(91264);
/* harmony import */ var private_dot_next_build_manifest_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(98991);
/* harmony import */ var private_dot_next_react_loadable_manifest_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(74317);
/* harmony import */ var next_dist_build_webpack_loaders_next_serverless_loader_page_handler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(57194);

      
      
      
      

      
      const { processEnv } = __webpack_require__(50782)
      processEnv([])
    
      
      const runtimeConfig = {}
      ;

      const documentModule = __webpack_require__(45785)

      const appMod = __webpack_require__(68646)
      let App = appMod.default || appMod.then && appMod.then(mod => mod.default);

      const compMod = __webpack_require__(10194)

      const Component = compMod.default || compMod.then && compMod.then(mod => mod.default)
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component);
      const getStaticProps = compMod['getStaticProp' + 's'] || compMod.then && compMod.then(mod => mod['getStaticProp' + 's'])
      const getStaticPaths = compMod['getStaticPath' + 's'] || compMod.then && compMod.then(mod => mod['getStaticPath' + 's'])
      const getServerSideProps = compMod['getServerSideProp' + 's'] || compMod.then && compMod.then(mod => mod['getServerSideProp' + 's'])

      // kept for detecting legacy exports
      const unstable_getStaticParams = compMod['unstable_getStaticParam' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticParam' + 's'])
      const unstable_getStaticProps = compMod['unstable_getStaticProp' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticProp' + 's'])
      const unstable_getStaticPaths = compMod['unstable_getStaticPath' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticPath' + 's'])
      const unstable_getServerProps = compMod['unstable_getServerProp' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getServerProp' + 's'])

      let config = compMod['confi' + 'g'] || (compMod.then && compMod.then(mod => mod['confi' + 'g'])) || {}
      const _app = App

      const combinedRewrites = Array.isArray(private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites */ .Dg)
        ? private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites */ .Dg
        : []

      if (!Array.isArray(private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites */ .Dg)) {
        combinedRewrites.push(...private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites.beforeFiles */ .Dg.beforeFiles)
        combinedRewrites.push(...private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites.afterFiles */ .Dg.afterFiles)
        combinedRewrites.push(...private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites.fallback */ .Dg.fallback)
      }

      const { renderReqToHTML, render } = (0,next_dist_build_webpack_loaders_next_serverless_loader_page_handler__WEBPACK_IMPORTED_MODULE_4__/* .getPageHandler */ .u)({
        pageModule: compMod,
        pageComponent: Component,
        pageConfig: config,
        appModule: App,
        documentModule: documentModule,
        errorModule: __webpack_require__(72918),
        notFoundModule: __webpack_require__(33137),
        pageGetStaticProps: getStaticProps,
        pageGetStaticPaths: getStaticPaths,
        pageGetServerSideProps: getServerSideProps,

        assetPrefix: "",
        canonicalBase: "",
        generateEtags: true,
        poweredByHeader: true,

        runtimeConfig,
        buildManifest: private_dot_next_build_manifest_json__WEBPACK_IMPORTED_MODULE_2__,
        reactLoadableManifest: private_dot_next_react_loadable_manifest_json__WEBPACK_IMPORTED_MODULE_3__,

        rewrites: combinedRewrites,
        i18n: undefined,
        page: "/",
        buildId: "tnm-web-build",
        escapedBuildId: "tnm\-web\-build",
        basePath: "",
        pageIsDynamic: false,
        encodedPreviewProps: {previewModeId:"496b6e7d337f54eab76ea50b79c502ee",previewModeSigningKey:"6eed0a3ebd9571325f31337f99c2a98f2451cf00d9e3428ffff3d58c57b02b8f",previewModeEncryptionKey:"908f5bf7cca1ee23a68859c7977c67e5be39d37369ca5859b62ecf6bf3adf111"}
      })
      
    

/***/ }),

/***/ 10194:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17213);
/* harmony import */ var _tnmw_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40988);
/* harmony import */ var _emotion_styled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(45736);



const StyledDiv = _emotion_styled__WEBPACK_IMPORTED_MODULE_1__["default"].div`
  padding: 1rem;
`;
const IndexPage = ()=>{
    return(/*#__PURE__*/ (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__/* .jsxs */ .BX)(_tnmw_components__WEBPACK_IMPORTED_MODULE_0__/* .Layout */ .Ar, {
        children: [
            /*#__PURE__*/ _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__/* .jsx */ .tZ(_tnmw_components__WEBPACK_IMPORTED_MODULE_0__/* .Hero */ .VM, {
                children: /*#__PURE__*/ _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__/* .jsx */ .tZ("h1", {
                    children: "Hi people"
                })
            }),
            /*#__PURE__*/ (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__/* .jsxs */ .BX)(StyledDiv, {
                children: [
                    /*#__PURE__*/ _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__/* .jsx */ .tZ(_tnmw_components__WEBPACK_IMPORTED_MODULE_0__/* .ParagraphText */ .qm, {
                        children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt egestas sagittis. Vestibulum vel orci odio. Etiam non vestibulum lectus, sit amet porttitor enim. Ut ullamcorper neque nec urna efficitur, at mattis mi pharetra. Suspendisse risus urna, tincidunt ac erat sed, efficitur feugiat mi. Cras faucibus varius mollis. Donec ultricies molestie sodales. Cras vulputate sagittis varius. Morbi nec malesuada risus, lobortis venenatis elit. Etiam imperdiet vehicula justo, et pretium dui finibus eget."
                    }),
                    /*#__PURE__*/ _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__/* .jsx */ .tZ(_tnmw_components__WEBPACK_IMPORTED_MODULE_0__/* .ParagraphText */ .qm, {
                        children: "Praesent finibus turpis ante, vel venenatis leo finibus a. Donec gravida, odio sit amet consequat iaculis, risus neque iaculis urna, eget lobortis risus est vitae odio. Vestibulum porta dolor semper vulputate lacinia. Maecenas et cursus tortor. Morbi tincidunt, lorem sed sagittis congue, purus libero auctor erat, maximus auctor mauris turpis eu lacus. Nunc rutrum ut mi nec eleifend. Vestibulum sit amet nisl massa. In tristique eget elit eget semper. Etiam vehicula volutpat dolor."
                    }),
                    /*#__PURE__*/ _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__/* .jsx */ .tZ(_tnmw_components__WEBPACK_IMPORTED_MODULE_0__/* .ParagraphText */ .qm, {
                        children: "Aliquam pellentesque justo quis lacus sagittis maximus. Donec porta, risus vel luctus vehicula, ipsum augue imperdiet odio, vel lobortis sem odio vitae velit. Nulla porta, augue eu dignissim blandit, ligula erat faucibus ante, nec aliquam tortor quam nec ligula. Aliquam at posuere purus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod venenatis libero, quis sodales orci tempor id. Praesent malesuada, ipsum fermentum suscipit interdum, magna ipsum convallis velit, at placerat elit ligula vel eros. Donec finibus, lacus id suscipit tincidunt, purus elit tempus lacus, vel scelerisque magna odio vel metus. Nam felis leo, varius sit amet enim vitae, tempor luctus nibh. Vivamus aliquam nisl ante. Aenean iaculis nulla ligula, vel volutpat lectus aliquam vitae. Ut ornare vitae diam sed fermentum. Fusce pharetra iaculis semper. Fusce fringilla augue et arcu gravida lacinia. Ut consectetur leo id sagittis mattis."
                    }),
                    /*#__PURE__*/ _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__/* .jsx */ .tZ(_tnmw_components__WEBPACK_IMPORTED_MODULE_0__/* .ParagraphText */ .qm, {
                        children: "Sed aliquet posuere lectus vel vehicula. Cras ut commodo eros. In luctus augue dui, vitae iaculis nunc mollis vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent faucibus magna a congue porta. Mauris ut tellus egestas, semper nisi vel, posuere nisl. Nulla vitae felis et elit porttitor dignissim. Praesent fringilla velit in lacus ultrices, et tristique orci blandit. Etiam aliquam mollis enim, et tristique ipsum molestie vel. In auctor lobortis massa, lobortis sollicitudin velit volutpat at. Vivamus purus sapien, convallis sit amet varius non, tempor quis lacus. Praesent sit amet tortor a eros condimentum accumsan in quis arcu. Aliquam et blandit nulla. Mauris sit amet porta tortor. Suspendisse nec suscipit mauris."
                    })
                ]
            })
        ]
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IndexPage);


/***/ }),

/***/ 1014:
/***/ ((module) => {

module.exports = require("critters");

/***/ }),

/***/ 2186:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@ampproject/toolbox-optimizer");

/***/ }),

/***/ 14300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 32081:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 82361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 57147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 13685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 85158:
/***/ ((module) => {

module.exports = require("http2");

/***/ }),

/***/ 95687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 71017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 77282:
/***/ ((module) => {

module.exports = require("process");

/***/ }),

/***/ 85477:
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ 63477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 12781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 71576:
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ 57310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 73837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 59796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [665,456], () => (__webpack_exec__(4347)));
module.exports = __webpack_exports__;

})();