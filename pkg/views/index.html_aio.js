/**
 * file: mod.js
 * ver: 1.0.11
 * update: 2015/05/14
 *
 * https://github.com/fex-team/mod
 */
var require, define;

(function(global) {
    if (require) return; // 避免重复加载而导致已定义模块丢失

    var head = document.getElementsByTagName('head')[0],
        loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        scriptsMap = {},
        resMap = {},
        pkgMap = {};

    function createScript(url, onerror) {
        if (url in scriptsMap) return;
        scriptsMap[url] = true;

        var script = document.createElement('script');
        if (onerror) {
            var tid = setTimeout(onerror, require.timeout);

            script.onerror = function() {
                clearTimeout(tid);
                onerror();
            };

            function onload() {
                clearTimeout(tid);
            }

            if ('onload' in script) {
                script.onload = onload;
            } else {
                script.onreadystatechange = function() {
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        onload();
                    }
                }
            }
        }
        script.type = 'text/javascript';
        script.src = url;
        head.appendChild(script);
        return script;
    }

    function loadScript(id, callback, onerror) {
        var queue = loadingMap[id] || (loadingMap[id] = []);
        queue.push(callback);

        //
        // resource map query
        //
        var res = resMap[id] || resMap[id + '.js'] || {};
        var pkg = res.pkg;
        var url;

        if (pkg) {
            url = pkgMap[pkg].url;
        } else {
            url = res.url || id;
        }

        createScript(url, onerror && function() {
            onerror(id);
        });
    }

    define = function(id, factory) {
        if(typeof id !== 'string') {
            return;
        }
        id = id.replace(/\.js$/i, '');
        factoryMap[id] = factory;

        var queue = loadingMap[id];
        if (queue) {
            for (var i = 0, n = queue.length; i < n; i++) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    require = function(id) {

        // compatible with require([dep, dep2...]) syntax.
        if (id && id.splice) {
            return require.async.apply(this, arguments);
        }

        id = require.alias(id);

        var mod = modulesMap[id];
        if (mod) {
            return mod.exports;
        }

        //
        // init module
        //
        var factory = factoryMap[id];
        if (!factory) {
            throw '[ModJS] Cannot find module `' + id + '`';
        }

        mod = modulesMap[id] = {
            exports: {}
        };

        //
        // factory: function OR value
        //
        var ret = (typeof factory == 'function') ? factory.apply(mod, [require, mod.exports, mod]) : factory;

        if (ret) {
            mod.exports = ret;
        }
        return mod.exports;
    };

    require.async = function(names, onload, onerror) {
        if (typeof names == 'string') {
            names = [names];
        }

        var needMap = {};
        var needNum = 0;

        function findNeed(depArr) {
            for (var i = 0, n = depArr.length; i < n; i++) {
                //
                // skip loading or loaded
                //
                var dep = require.alias(depArr[i]);

                if (dep in factoryMap) {
                    // check whether loaded resource's deps is loaded or not
                    var child = resMap[dep] || resMap[dep + '.js'];
                    if (child && 'deps' in child) {
                        findNeed(child.deps);
                    }
                    continue;
                }

                if (dep in needMap) {
                    continue;
                }

                needMap[dep] = true;
                needNum++;
                loadScript(dep, updateNeed, onerror);

                var child = resMap[dep] || resMap[dep + '.js'];
                if (child && 'deps' in child) {
                    findNeed(child.deps);
                }
            }
        }

        function updateNeed() {
            if (0 == needNum--) {
                var args = [];
                for (var i = 0, n = names.length; i < n; i++) {
                    args[i] = require(names[i]);
                }

                onload && onload.apply(global, args);
            }
        }

        findNeed(names);
        updateNeed();
    };

    require.resourceMap = function(obj) {
        var k, col;

        // merge `res` & `pkg` fields
        col = obj.res;
        for (k in col) {
            if (col.hasOwnProperty(k)) {
                resMap[k] = col[k];
            }
        }

        col = obj.pkg;
        for (k in col) {
            if (col.hasOwnProperty(k)) {
                pkgMap[k] = col[k];
            }
        }
    };

    require.loadJs = function(url) {
        createScript(url);
    };

    require.loadCss = function(cfg) {
        if (cfg.content) {
            var sty = document.createElement('style');
            sty.type = 'text/css';

            if (sty.styleSheet) { // IE
                sty.styleSheet.cssText = cfg.content;
            } else {
                sty.innerHTML = cfg.content;
            }
            head.appendChild(sty);
        } else if (cfg.url) {
            var link = document.createElement('link');
            link.href = cfg.url;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        }
    };


    require.alias = function(id) {
        return id.replace(/\.js$/i, '');
    };

    require.timeout = 5000;

})(this);

;(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    
    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem(){
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));
(function(win, lib){
    var doc = win.document;
    var docEl = doc.documentElement;
    var gridEl = doc.querySelector('meta[name="grid"]');
    var styleEl;
    var flexible = lib.flexible || (lib.flexible = {});

    function makeGrid(params) {
        var designWidth = parseFloat(params.designWidth);
        var designUnit = parseFloat(params.designUnit);
        var columnCount = parseFloat(params.columnCount);
        var columnXUnit = parseFloat(params.columnXUnit);
        var gutterXUnit = parseFloat(params.gutterXUnit);
        var edgeXUnit = parseFloat(params.edgeXUnit);
        var className = params.className || 'grid';

        if (!(params.designWidth && params.designUnit && params.columnCount && params.columnXUnit && params.gutterXUnit && params.edgeXUnit)) {
            throw new Error('参数错误');
        }

        lib.flexible.gridParams = params;

        var ratio = designUnit / designWidth * 10;
        var columnWidth = columnXUnit * ratio;
        var gutterWidth = gutterXUnit * ratio;
        var edgeWidth = edgeXUnit * ratio;

        var cssText = [
            '.' + className + ' {',
                'box-sizing:content-box;',
                'padding-left: ' + edgeWidth + 'rem;',
                'padding-right: ' + edgeWidth + 'rem;',
                'margin-left: -' + gutterWidth + 'rem;',
            '}',

            '.' + className + ':before,',
            '.' + className + ':after{',
                'content: " ";',
                'display: table;',
            '}',

            '.' + className + ':after {',
              'clear: both;',
            '}',

            '.' + className + ' [class^="col-"] {',
                'margin-left: ' + gutterWidth + 'rem;',
                'float: left;',
            '}'
        ];

        for (var i = 1; i <= columnCount; i++) {
            var width = columnWidth * i + gutterWidth * (i - 1);
            cssText.push('.' + className + ' .col-' + i + ' {width: ' + width + 'rem;}');
        }

        if (styleEl && styleEl.parentNode) {
            styleEl.parentNode.removeChild(styleEl);
        }
        styleEl = doc.createElement('style');
        styleEl.innerHTML = cssText.join('');
        var el = doc.querySelector('head') || docEl.firstElementChild || docEl;
        el.appendChild(styleEl);
    }

    var gridMode = {
        '750-12': {designWidth:750,designUnit:6,columnCount:12,columnXUnit:7,gutterXUnit:3,edgeXUnit:4},
        '750-6': {designWidth:750,designUnit:6,columnCount:6,columnXUnit:17,gutterXUnit:3,edgeXUnit:4},
        '640-12': {designWidth:640,designUnit:4,columnCount:12,columnXUnit:11,gutterXUnit:2,edgeXUnit:3},
        '640-6': {designWidth:640,designUnit:4,columnCount:6,columnXUnit:24,gutterXUnit:2,edgeXUnit:3}
    }
    function makeGridMode(modeName) {
        var mode = gridMode[modeName];
        if (mode) {
            makeGrid(mode);
        } else {
            throw new Error('不支持这个预设模式');
        }
    }

    if (gridEl) {
        var content = gridEl.getAttribute('content');
        if (content) {
            var reg = /([^=]+)=([\d\.\-]+)/g;
            var matched;
            var params = {};
            while (!!(matched = reg.exec(content))) {
                params[matched[1]] = matched[2];
            }

            if (params.modeName){
                makeGridMode(params.modeName);
            } else {
                makeGrid(params);
            }
        }
    }

    flexible.makeGrid = makeGrid;
    flexible.makeGridMode = makeGridMode;

})(window, window['lib'] || (window['lib'] = {}));
