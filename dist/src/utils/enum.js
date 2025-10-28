"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginType = exports.Gender = exports.Species = exports.PlaceType = exports.MediaType = exports.likeType = void 0;
var likeType;
(function (likeType) {
    likeType["Post"] = "0";
    likeType["Comment"] = "1";
})(likeType || (exports.likeType = likeType = {}));
var MediaType;
(function (MediaType) {
    MediaType["NONE"] = "0";
    MediaType["IMAGE"] = "1";
    MediaType["VIDEO"] = "2";
    MediaType["PDF"] = "3";
})(MediaType || (exports.MediaType = MediaType = {}));
var PlaceType;
(function (PlaceType) {
    PlaceType["HOSPITAL"] = "0";
    PlaceType["PETSHOP"] = "1";
})(PlaceType || (exports.PlaceType = PlaceType = {}));
var Species;
(function (Species) {
    Species["Cat"] = "0";
    Species["Dog"] = "1";
})(Species || (exports.Species = Species = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "0";
    Gender["Female"] = "1";
    Gender["Other"] = "2";
})(Gender || (exports.Gender = Gender = {}));
var loginType;
(function (loginType) {
    loginType["email"] = "0";
    loginType["mobile-number"] = "1";
    loginType["google"] = "2";
    loginType["facebook"] = "3";
    loginType["twitter"] = "4";
    loginType["apple"] = "5";
})(loginType || (exports.loginType = loginType = {}));
//# sourceMappingURL=enum.js.map