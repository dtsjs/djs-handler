"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.fixCommand = function (command) {
        var cmd = command;
        cmd.name.replace(/\s/g, '-');
        cmd.name = cmd.name.toLowerCase();
        if (cmd.options) {
            var options_1 = [];
            Object.keys(cmd.options).forEach(function (key) {
                var type;
                if (key === 'string')
                    type = 3;
                else if (key === 'user')
                    type = 6;
                else if (key === 'channel')
                    type = 7;
                else if (key === 'role')
                    type = 8;
                else if (key === 'boolean')
                    type = 5;
                else if (key === 'integer')
                    type = 4;
                if (key === 'string') {
                    cmd.options[key].forEach(function (option) {
                        if (option.choices) {
                            option.choices.push(__assign(__assign({}, option.choices), { name: option.name.replace(/\s/g, '-') }));
                        }
                    });
                }
                cmd.options[key].forEach(function (option) {
                    options_1.push(__assign(__assign({}, option), { type: type }));
                });
            });
            cmd.options = options_1;
            cmd.options.sort(function (a, b) {
                if (a.required && !b.required)
                    return -1;
                if (!a.required && b.required)
                    return 1;
                return 0;
            });
        }
        return cmd;
    };
    return Utils;
}());
exports.default = Utils;
