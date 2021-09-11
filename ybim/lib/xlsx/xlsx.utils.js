var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var xlsxUtils = {
    Binary: {
        fixdata: function fixdata(data) {
            //文件流转BinaryString
            var o = "",
                l = 0,
                w = 10240;
            for (; l < data.byteLength / w; ++l) {
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            }o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        },
        s2ab: function s2ab(s) {
            //字符串转字符流
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }return buf;
        }
    },
    _wb: null,
    _rABS: true,
    /**
     * @desc  导入根据文件
     * @param {File} f 文件
     * @param {Function} c 回调
     * @return {Object} 回调值
     */
    imports: function _import(f, c) {
        this.wb = null;
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            xlsxUtils._wb = xlsxUtils._rABS ? XLSX.read(btoa(xlsxUtils.Binary.fixdata(data)), { type: 'base64', cellStyles: true }) : XLSX.read(data, { type: 'binary', cellStyles: true });
            // console.log(xlsxUtils._wb);
            if (typeof c == "function") {
                c(xlsxUtils._wb);
            }
        };
        if (xlsxUtils._rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
        }
    },

    /**
     * @desc  根据表Sheet名获取数据
     * @param {String} name
     * @return {Object}
     */
    getSheetByName: function getSheetByName(name) {
        //
        return XLSX.utils.sheet_to_json(xlsxUtils._wb.Sheets[name]);
    },

    /**
     * @desc  根据表Sheet索引获取数据
     * @param {Number} index
     * @return {Object}
     */
    getSheetByIndex: function getSheetByIndex() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        return xlsxUtils.getSheetByName(xlsxUtils._wb.SheetNames[index]);
    },

    /**
     * @desc  根据表Sheet名获取表头
     * @param {String} name
     * @return {Object}
     */
    getSheetHeaderByName: function getSheetHeaderByName(name) {
        var header = [];
        var data = xlsxUtils._wb.Sheets[name];
        if (Object.keys(data).length > 0) {
            var pattern = /^[A-Z]+1$/;
            for (var key in data) {
                if (pattern.test(key)) {
                    header.push(data[key]["w"]);
                }
            }
        }
        return header;
    },

    /**
     * @desc  根据表Sheet名获取模板
     * @param {String} name
     * @return {Object}
     */
    getSheetTemplateByName: function getSheetTemplateByName(name) {
        var template = {};
        var data = xlsxUtils._wb.Sheets[name];
        if (Object.keys(data).length > 0) {
            var header = {};
            var pattern = /^[A-Z]+1$/;
            for (var key in data) {
                if (pattern.test(key)) {
                    header[key] = data[key];
                } else if (key.indexOf('!margins') != -1) {
                    template.margins = data[key];
                } else if (key.indexOf('!merges') != -1) {
                    template.merges = data[key];
                } else if (key.indexOf('!rows') != -1) {
                    template.rows = data[key];
                }
            }
            template.header = header;
        }
        return template;
    },

    /**
     * @desc 导出
     * @param {Array} data 数据{title1:dataList,title2:dataList....}
     * @param {String} type
     * @return {Blob}
     */
    _export: function _export(data, type) {
        var tmpWB = null;
        for (var title in data) {
            var tmpdata = xlsxUtils.format2Sheet(data[title]);
            tmpWB = xlsxUtils.format2WB(tmpdata, title, tmpWB);
        }
        return xlsxUtils.format2Blob(tmpWB, type);
    },

    /**
     * 从数据数组或对象中根据key生成相同key值的对象
     * @param {Object|Array} data
     * @return {Object}
     */
    readDataHead: function readDataHead(data) {
        var o = {},
            d = Array.isArray(data) ? Object.keys(data[0]) : data;var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = d[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var i = _step.value;
                o[i] = i;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return o;
    },

    /**
     * @desc 格式化数据为Sheet格式
     * @param {Array} json 数据
     * @param {Number} n 列偏移
     * @param {Number} r 行偏移
     * @param {Array} keyMap 对象键数组
     * @param {Function|Boolean} t 数据
     */
    format2Sheet: function format2Sheet(json, column, row, keyMap, t, s) {
        keyMap = keyMap || Object.keys(json[0]);
        //var types = (t == undefined ? ((v) => ({ "number": "n", undefined: "s", "boolean": "b", "error": "e", "string": "s", "date": "d" })[typeof v]) : t);
        var types = t;
        if (typeof types == "undefined") {
            types = function types(v) {
                var type = Object.prototype.toString.call(v);
                if(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v)){
                	type = "[object Number]";
                }
                switch (type) {
                    case "[object Number]":
                        return "n";
                        break;
                    case "[object String]":
                        return "s";
                        break;
                    case "[object Boolean]":
                        return "b";
                        break;
                    case "[object Error]":
                        return "e";
                        break;
                    case "[object Null]":
                        return "s";
                        break;
                    case "[object Date]":
                        return "d";
                        break;
                    default:
                        return "s";
                        break;
                }
            };
        }

        var formats = s;
        if (typeof formats == "undefined") {
            formats = function formats(v) {
                if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) != undefined) {
                    return {
                        "numFmt": "General",
                        "font": {
                            "sz": "11",
                            "color": {
                                "theme": "1",
                                "rgb": "FFFFFF"
                            },
                            "name": "Arial"
                        },
                        "border": {
            				"left": {
            					"style": "thin",
            					"color": {
            						"auto": "1"
            					}
            				},
            				"right": {
            					"style": "thin",
            					"color": {
            						"auto": "1"
            					}
            				},
            				"top": {
            					"style": "thin",
            					"color": {
            						"auto": "1"
            					}
            				},
            				"bottom": {
            					"style": "thin",
            					"color": {
            						"auto": "1"
            					}
            				}
            			},
                        "alignment": {
                            "vertical": "center",
                            "horizontal": "center",
                            "wrapText":"1"
                        }
                    };
                } else {
                    return "";
                }
            };
        }

        //var format = (s == undefined ? ((v) => ({ "number": "n", undefined: "s", "boolean": "b", "error": "e", "string": "s", "date": "d" })[typeof v]) : s);
        column = column || 0;
        row = row || 0;
        var tmpdata = {}; //用来保存转换好的json
        var t1 = json.map(function (v, i) {
            return keyMap.map(function (k, j) {
                return Object.assign({}, {
                    v: v[k],
                    position: (j + column > 25 ? xlsxUtils.getCharCol(j + column) : String.fromCharCode(65 + (j + column))) + (i + 1 + row)
                });
            });
        }).reduce(function (prev, next) {
            return prev.concat(next);
        }).forEach(function (v, i) {
            return tmpdata[v.position] = {
                v: (v.v==undefined?'':v.v),
                t: types ? types(v.v) : "s",
                s: formats ? formats(v.v) : ""
            };
        });
        return tmpdata;
    },

    /**
     * @desc 格式化数据为Sheet格式
     * @param {Array} sheetData
     * @param {String} title
     * @param {Object} wb
     * @param {Object} ref
     */
    format2WB: function format2WB(sheetData, title, wb, ref) {
        title = title || "mySheet";
        var outputPos = Object.keys(sheetData);
        if (!wb) wb = { Sheets: {}, SheetNames: [] };
        wb.SheetNames.push(title);
        wb.Sheets[title] = Object.assign({}, sheetData, {
            '!ref': ref || outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
        });
        return wb;
    },

    /**
     * @desc 将xlsx Workbook 转为blob
     * @param {Array} wb
     * @param {String} type 类型
     */
    format2Blob: function format2Blob(wb, type) {
        return new Blob([xlsxUtils.Binary.s2ab(XLSX.write(wb, { bookType: type == undefined ? 'xlsx' : type, bookSST: false, type: 'binary' //这里的数据是用来定义导出的格式类型
        }))], { type: "" });
    },

    /**
     * @desc 匹配单元格对应的标识
     * @param {Number} n
     */
    getCharCol: function getCharCol(n) {
        var temCol = '',
            s = '',
            m = 0;
        while (n >= 0) {
            m = n % 26 + 1;
            s = String.fromCharCode(m + 64) + s;
            n = (n - m) / 26;
        }
        return s;
    },

    /**
     * 对象键值倒转
     */
    reverse: function reverse(obj) {
        var o = new Object();
        for (var k in obj) {
            o[obj[k]] = k;
        }
        return o;
    },

    /**
     * 深拷贝
     */
    deepCopy: function (_deepCopy) {
        function deepCopy() {
            return _deepCopy.apply(this, arguments);
        }

        deepCopy.toString = function () {
            return _deepCopy.toString();
        };

        return deepCopy;
    }(function () {
        var temp = obj.constructor === Array ? [] : {};
        for (var val in obj) {
            temp[val] = _typeof(obj[val]) == 'object' ? deepCopy(obj[val]) : obj[val];
        }
        return temp;
    }),

    /**
     * 拷贝JSON格式
     */
    copyJson: function copyJson(o) {
        return JSON.parse(JSON.stringify(o));
    }
};
