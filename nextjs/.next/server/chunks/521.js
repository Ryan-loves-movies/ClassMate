"use strict";
exports.id = 521;
exports.ids = [521];
exports.modules = {

/***/ 7292:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ek": () => (/* binding */ regUsername),
/* harmony export */   "ku": () => (/* binding */ regEmail),
/* harmony export */   "nw": () => (/* binding */ regPassword)
/* harmony export */ });
const regUsername = /^[a-z][^\W_]{7,14}$/i;
const regPassword = /^(?=[^a-z]*[a-z])(?=\D*\d)[^:&.~\s]{5,20}$/;
const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
function isValidUsername(username) {
    return regUsername.test(username);
}
function isValidPassword(password) {
    return regPassword.test(password);
}
function isValidEmail(email) {
    return regEmail.test(email);
}
function validateUser(username, password, email) {
    if (!isValidUsername(username)) {
        console.log("Invalid username.");
        return false;
    }
    if (!isValidPassword(password)) {
        console.log("Invalid password.");
        return false;
    }
    if (!isValidEmail(email)) {
        console.log("Invalid email address.");
        return false;
    }
    console.log("User is valid.");
    return true;
}

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (validateUser)));


/***/ }),

/***/ 2964:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Error)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function Error({ message  }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "rounded  border border-red-600 bg-red-50 p-1 text-red-600",
        children: message
    });
}


/***/ }),

/***/ 2940:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ LoginField)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function LeftField({ icon  }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "flex -mr-px justify-center w-15 p-4",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
            className: "flex items-center leading-normal bg-white rounded rounded-r-none text-xl px-3 whitespace-no-wrap text-gray-600",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("i", {
                className: icon
            })
        })
    });
}
function RightField({ icon  }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "flex -mr-px",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
            className: "flex items-center leading-normal bg-white rounded rounded-l-none border-0 px-3 whitespace-no-wrap text-gray-600",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("i", {
                className: icon
            })
        })
    });
}
function LoginField({ children , leftIcon , rightIcon =""  }) {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "flex flex-wrap items-stretch w-full relative h-15 bg-white items-center rounded mb-4",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(LeftField, {
                icon: leftIcon
            }),
            children,
            !!rightIcon && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(RightField, {
                icon: rightIcon
            })
        ]
    });
}


/***/ })

};
;