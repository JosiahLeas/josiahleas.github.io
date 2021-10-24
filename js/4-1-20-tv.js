'use strict';
(function () {
    if (window.TradingView && window.TradingView.host && !window.TradingView.reoloadTvjs) {
        return;
    }
    var COLORS = {};
    /** @type {string} */
    COLORS["color-brand"] = "#2196f3";
    /** @type {string} */
    COLORS["color-gull-gray"] = "#9db2bd";
    /** @type {string} */
    COLORS["color-scooter"] = "#38acdb";
    /** @type {string} */
    COLORS["color-curious-blue"] = "#299dcd";
    var $ = {
        host: window.location.host.match(/tradingview\.com|pyrrosinvestment\.com/i) == null ? "https://s.tradingview.com" : "https://www.tradingview.com",
        ideasHost: "https://www.tradingview.com",
        chatHost: "https://www.tradingview.com",
        embedStylesForCopyright: function () {
            /** @type {!Element} */
            var fontEl = document.createElement("style");
            /** @type {string} */
            fontEl.innerHTML = ".tradingview-widget-copyright {font-size: 13px !important; line-height: 32px !important; text-align: center !important; vertical-align: middle !important; font-family: 'Trebuchet MS', Arial, sans-serif !important; color: " + COLORS["color-gull-gray"] + " !important;} .tradingview-widget-copyright .blue-text {color: " + COLORS["color-brand"] + " !important;} .tradingview-widget-copyright a {text-decoration: none !important; color: " + COLORS["color-gull-gray"] + " !important;} .tradingview-widget-copyright a:visited {color: " +
                COLORS["color-gull-gray"] + " !important;} .tradingview-widget-copyright a:hover .blue-text {color: " + COLORS["color-scooter"] + " !important;} .tradingview-widget-copyright a:active .blue-text {color: " + COLORS["color-curious-blue"] + " !important;} .tradingview-widget-copyright a:visited .blue-text {color: " + COLORS["color-brand"] + " !important;}";
            return fontEl;
        },
        embedStylesForFullHeight: function (type, group_index, container_id) {
            var IMG_HEIGHT = group_index ? "calc(" + type + " - 32px)" : type;
            /** @type {(Element|null)} */
            var parent = document.querySelector("#" + container_id);
            /** @type {(Element|null)} */
            var dropdown = parent.parentElement;
            dropdown.style.height = IMG_HEIGHT;
            /** @type {string} */
            parent.style.height = "100%";
        },
        gId: function () {
            return "tradingview_" + ((1 + Math.random()) * 1048576 | 0).toString(16).substring(1);
        },
        isPersentHeight: function (aRoundNumber) {
            return aRoundNumber === "%";
        },
        getSuffix: function (type) {
            var unitM = type.toString().match(/(%|px|em|ex)/);
            return unitM ? unitM[0] : "px";
        },
        hasCopyright: function (targetId) {
            /** @type {(Element|null)} */
            var container = document.getElementById(targetId);
            /** @type {(Element|null)} */
            var metabar = container && container.parentElement;
            if (metabar) {
                return !!metabar.querySelector(".tradingview-widget-copyright");
            }
            return false;
        },
        calculateWidgetHeight: function (url, handler) {
            /** @type {number} */
            var strIm = parseInt(url);
            var i = this.getSuffix(url);
            var expression = this.isPersentHeight(i);
            var group_index = handler && this.hasCopyright(handler);
            if (expression && handler) {
                this.embedStylesForFullHeight(strIm + i, group_index, handler);
                if (group_index) {
                    return 100 + i;
                }
            }
            if (group_index) {
                return "calc(" + strIm + i + " - 32px)";
            }
            return strIm + i;
        },
        onready: function (f) {
            if (window.addEventListener) {
                window.addEventListener("DOMContentLoaded", f, false);
            } else {
                window.attachEvent("onload", f);
            }
        },
        css: function (css) {
            /** @type {!Element} */
            var detectBlock = document.getElementsByTagName("head")[0];
            /** @type {!Element} */
            var style = document.createElement("style");
            var textNode;
            /** @type {string} */
            style.type = "text/css";
            if (style.styleSheet) {
                /** @type {string} */
                style.styleSheet.cssText = css;
            } else {
                /** @type {!Text} */
                textNode = document.createTextNode(css);
                style.appendChild(textNode);
            }
            detectBlock.appendChild(style);
        },
        bindEvent: function (obj, type, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(type, fn, false);
            } else {
                if (obj.attachEvent) {
                    obj.attachEvent("on" + type, fn);
                }
            }
        },
        unbindEvent: function (target, type, fn) {
            if (target.removeEventListener) {
                target.removeEventListener(type, fn, false);
            } else {
                if (target.detachEvent) {
                    target.detachEvent("on" + type, fn);
                }
            }
        },
        cloneSimpleObject: function (object) {
            if (null == object || "object" != typeof object) {
                return object;
            }
            var clone = object.constructor();
            var name;
            for (name in object) {
                if (object.hasOwnProperty(name)) {
                    clone[name] = object[name];
                }
            }
            return clone;
        },
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },
        isMobileDevice: function () {
            var isMobile = {
                Android: /Android/i.test(navigator.userAgent),
                BlackBerry: /BlackBerry/i.test(navigator.userAgent),
                iOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
                Opera: /Opera Mini/i.test(navigator.userAgent)
            };
            /** @type {boolean} */
            isMobile.any = isMobile.Android || isMobile.BlackBerry || isMobile.iOS || isMobile.Opera;
            return isMobile;
        }(),
        generateUtmForUrlParams: function (a) {
            return "utm_source=" + encodeURI(window.location.hostname) + "&utm_medium=" + ($.hasCopyright(a.container) ? "widget_new" : "widget") + (a.type ? "&utm_campaign=" + a.type : "") + (a.type && a.type === "chart" ? "&utm_term=" + encodeURIComponent(a.symbol) : "");
        },
        WidgetAbstract: function () {
        },
        MiniWidget: function (options) {
            this.id = $.gId();
            this.options = {
                whitelabel: options.whitelabel || "",
                width: $.WidgetAbstract.prototype.fixSize(options.width) || 300,
                height: $.WidgetAbstract.prototype.fixSize(options.height) || 400,
                symbols: options.symbols,
                tabs: options.tabs || "",
                symbols_description: options.symbols_description || "",
                customer: options.customer || "",
                container: options.container_id || "",
                greyText: options.greyText || "",
                large_chart_url: options.large_chart_url || "",
                large_chart_target: options.large_chart_target || "",
                gridLineColor: options.gridLineColor || "",
                fontColor: options.fontColor || "",
                underLineColor: options.underLineColor || "",
                trendLineColor: options.trendLineColor || "",
                timeAxisBackgroundColor: options.timeAxisBackgroundColor || "",
                activeTickerBackgroundColor: options.activeTickerBackgroundColor || "",
                noGraph: options.noGraph || false,
                locale: options.locale,
                styleTickerActiveBg: options.styleTickerActiveBg || "",
                styleTabActiveBorderColor: options.styleTabActiveBorderColor || "",
                styleTickerBodyFontSize: options.styleTickerBodyFontSize || "",
                styleTickerBodyFontWeight: options.styleTickerBodyFontWeight || "",
                styleTickerHeadFontSize: options.styleTickerHeadFontSize || "",
                styleTickerHeadFontWeight: options.styleTickerHeadFontWeight || "",
                styleTickerChangeDownColor: options.styleTickerChangeDownColor || "",
                styleTickerChangeUpColor: options.styleTickerChangeUpColor || "",
                styleTickerLastDownBg: options.styleTickerLastDownBg || "",
                styleTickerLastUpBg: options.styleTickerLastUpBg || "",
                styleTickerSymbolColor: options.styleTickerSymbolColor || "",
                styleTickerSymbolHoverTextDecoration: options.styleTickerSymbolHoverTextDecoration || "",
                styleTickerActiveSymbolTextDecoration: options.styleTickerActiveSymbolTextDecoration || "",
                styleTabsActiveBorderColor: options.styleTabsActiveBorderColor || "",
                styleTabsNoBorder: options.styleTabsNoBorder || "",
                styleWidgetNoBorder: options.styleWidgetNoBorder || ""
            };
            this.createWidget();
        },
        MediumWidget: function (options) {
            this.id = $.gId();
            var typeVal = $.calculateWidgetHeight(options.height || 400, options.container_id);
            this.options = {
                container: options.container_id || "",
                width: $.WidgetAbstract.prototype.fixSize(options.width) || "",
                height: $.WidgetAbstract.prototype.fixSize(typeVal) || "",
                symbols: options.symbols,
                greyText: options.greyText || "",
                symbols_description: options.symbols_description || "",
                large_chart_url: options.large_chart_url || "",
                customer: options.customer || "",
                gridLineColor: options.gridLineColor || "",
                fontColor: options.fontColor || "",
                underLineColor: options.underLineColor || "",
                trendLineColor: options.trendLineColor || "",
                timeAxisBackgroundColor: options.timeAxisBackgroundColor || "",
                chartOnly: !!options.chartOnly,
                locale: options.locale,
                whitelabel: !!options.whitelabel || "",
                colorTheme: options.colorTheme,
                isTransparent: options.isTransparent
            };
            this.createWidget();
        },
        widget: function (config) {
            this.id = config.id || $.gId();
            var defaults = $.getUrlParams();
            var drawChartSymbol = config.tvwidgetsymbol || defaults.tvwidgetsymbol || defaults.symbol || config.symbol || "NASDAQ:AAPL";
            var s = config.logo || "";
            if (s.src) {
                s = s.src;
            }
            if (s) {
                s.replace(".png", "");
            }
            var dxdydust = $.calculateWidgetHeight(config.height || 500, config.container_id);
            this.options = {
                whitelabel: config.whitelabel || "",
                width: config.width || 800,
                height: dxdydust,
                symbol: drawChartSymbol,
                interval: config.interval || "1",
                range: config.range || "",
                timezone: config.timezone || "",
                autosize: config.autosize,
                hide_top_toolbar: config.hide_top_toolbar,
                hide_side_toolbar: config.hide_side_toolbar,
                hide_legend: config.hide_legend,
                allow_symbol_change: config.allow_symbol_change,
                save_image: config.save_image !== undefined ? config.save_image : true,
                container: config.container_id || "",
                toolbar_bg: config.toolbar_bg || "f4f7f9",
                watchlist: config.watchlist || [],
                editablewatchlist: !!config.editablewatchlist,
                studies: config.studies || [],
                theme: config.theme || "",
                style: config.style || "",
                extended_hours: config.extended_hours === undefined ? undefined : +config.extended_hours,
                details: !!config.details,
                news: !!config.news,
                calendar: !!config.calendar,
                hotlist: !!config.hotlist,
                hideideas: !!config.hideideas,
                hideideasbutton: !!config.hideideasbutton,
                widgetbar_width: +config.widgetbar_width || undefined,
                withdateranges: config.withdateranges || "",
                customer: config.customer || s || "",
                venue: config.venue,
                symbology: config.symbology,
                logo: s,
                show_popup_button: !!config.show_popup_button,
                popup_height: config.popup_height || "",
                popup_width: config.popup_width || "",
                studies_overrides: config.studies_overrides,
                overrides: config.overrides,
                enabled_features: config.enabled_features,
                disabled_features: config.disabled_features,
                publish_source: config.publish_source || "",
                enable_publishing: config.enable_publishing,
                whotrades: config.whotrades || undefined,
                locale: config.locale,
                referral_id: config.referral_id,
                no_referral_id: config.no_referral_id,
                ref_landing_page: config.ref_landing_page,
                fundamental: config.fundamental,
                percentage: config.percentage,
                hidevolume: config.hidevolume,
                padding: config.padding,
                greyText: config.greyText || "",
                horztouchdrag: config.horztouchdrag,
                verttouchdrag: config.verttouchdrag
            };
            if (config.cme) {
                /** @type {string} */
                this.options.customer = "cme";
            }
            if (config.news && config.news.length) {
                /** @type {!Array} */
                this.options.news_vendors = [];
                /** @type {number} */
                var i = 0;
                for (; i < config.news.length; i++) {
                    switch (config.news[i]) {
                        case "headlines":
                        case "stocktwits":
                            this.options.news_vendors.push(config.news[i]);
                    }
                }
                if (!this.options.news_vendors) {
                    delete this.options.news_vendors;
                }
            }
            if (isFinite(config.widgetbar_width) && config.widgetbar_width > 0) {
                this.options.widgetbar_width = config.widgetbar_width;
            }
            /** @type {!Array} */
            this._ready_handlers = [];
            this.create();
        },
        chart: function (options) {
            this.id = $.gId();
            this.options = {
                width: options.width || 640,
                height: options.height || 500,
                container: options.container_id || "",
                realtime: options.realtime,
                chart: options.chart,
                locale: options.locale,
                type: "chart",
                autosize: options.autosize,
                mobileStatic: options.mobileStatic
            };
            /** @type {!Array} */
            this._ready_handlers = [];
            this.create();
        },
        stream: function (options) {
            this.id = $.gId();
            this.options = {
                width: options.width || 640,
                height: options.height || 500,
                container: options.container_id || "",
                stream: options.stream,
                locale: options.locale,
                autosize: options.autosize
            };
            this.create();
        },
        EventsWidget: function (data) {
            this.id = $.gId();
            this.options = {
                container: data.container_id || "",
                width: data.width || 486,
                height: data.height || 670,
                currency: data.currencyFilter || "",
                importance: data.importanceFilter || "",
                type: "economic-calendar"
            };
            this.createWidget(data);
        },
        IdeasStreamWidget: function (options) {
            this.id = $.gId();
            this.options = {
                container: options.container_id || "",
                width: options.width || 486,
                height: options.height || 670,
                symbol: options.symbol || "",
                username: options.username || "",
                mode: options.mode || "",
                publishSource: options.publishSource || "",
                sort: options.sort || "trending",
                stream: options.stream,
                interval: options.interval,
                time: options.time,
                waitSymbol: options.waitSymbol,
                hideDescription: options.hideDescription,
                startingCount: options.startingCount,
                bgColor: options.bgColor || "",
                headerColor: options.headerColor || "",
                borderColor: options.borderColor || "",
                locale: options.locale,
                type: "ideas-stream"
            };
            /** @type {!Array} */
            this._ready_handlers = [];
            this.createWidget(options);
        },
        IdeaWidget: function (data) {
            this.id = $.gId();
            this.options = {
                container: data.container_id || "",
                width: data.width || 486,
                height: data.height || 670,
                idea: data.idea || "",
                chartUrl: data.chartUrl || "",
                whotrades: data.whotrades || undefined,
                locale: data.locale,
                type: "idea"
            };
            this.createWidget(data);
        },
        ChatWidgetEmbed: function (data) {
            this.id = $.gId();
            this.options = {
                container: data.container_id || "",
                width: data.width || 400,
                height: data.height || 500,
                room: data.room || "",
                whotrades: data.whotrades || undefined,
                locale: data.locale,
                type: "chat-embed"
            };
            this.createWidget(data);
        },
        UserInfoWidget: function (data) {
            this.options = {
                container: data.container_id || "",
                width: data.width || 1040,
                height: data.height || 340,
                username: data.username || "",
                locale: data.locale,
                type: "user-info"
            };
            this.createWidget(data);
        },
        QuotesProvider: function (params) {
            /**
             * @param {!Object} data
             * @return {undefined}
             */
            function handler(data) {
                var i = data.symbol;
                var callback = data.success;
                var value = data.error;
                if (!i || !(callback && value)) {
                    return;
                }
                that.post(element.contentWindow, "resolveSymbol", {
                    symbol: i
                });
                if (callback) {
                    that.on("success" + i, function (identifierPositions) {
                        callback(identifierPositions);
                    });
                }
                if (value) {
                    that.on("error" + i, function (custBidObj) {
                        value(custBidObj);
                    });
                }
            }
            var x = $.gId();
            params = {
                container: params.container_id,
                symbols: params.symbols || [],
                type: "quotes-provider"
            };
            /** @type {string} */
            var widget_url = $.host + "/embed-quotes-provider/?" + $.generateUtmForUrlParams(params);
            /** @type {string} */
            var fromPointsXMax = "<iframe" + ' id="' + x + '"' + ' src="' + widget_url + '"' + ' width="0" height="0"' + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
            var element;
            var that;
            callback(fromPointsXMax, params.container);
            /** @type {(Element|null)} */
            element = document.getElementById(x);
            that = $.postMessageWrapper(element.contentWindow, x);
            $.bindEvent(element, "load", function () {
                params.symbols.forEach(handler);
            });
        }
    };
    /**
     * @return {undefined}
     */
    $.DependenciesManager = function () {
    };
    $.DependenciesManager.prototype.scripts = {};
    /**
     * @param {?} name
     * @return {undefined}
     */
    $.DependenciesManager.prototype._loaded = function (name) {
        var i;
        for (i in this.scripts[name].callbacks) {
            this.scripts[name].callbacks[i]();
        }
        /** @type {boolean} */
        this.scripts[name].status = true;
        this.scripts[name].callbacks = {};
    };
    /**
     * @param {!Array} data
     * @param {string} id
     * @param {!Function} code
     * @return {undefined}
     */
    $.DependenciesManager.prototype.depends = function (data, id, code) {
        /** @type {number} */
        var i = 0;
        for (; i < data.length; i++) {
            if (this.scripts[data[i]] && this.scripts[data[i]].status === true) {
                code();
            } else {
                if (this.scripts[data[i]] && this.scripts[data[i]].status === false) {
                    /** @type {!Function} */
                    this.scripts[data[i]].callbacks[id] = code;
                } else {
                    this.scripts[data[i]] = {
                        status: false,
                        script: document.createElement("script"),
                        callbacks: {}
                    };
                    /** @type {!Function} */
                    this.scripts[data[i]].callbacks[id] = code;
                    this.scripts[data[i]].script.onload = this._loaded.bind(this, data[i]);
                    this.scripts[data[i]].script.src = $.host + data[i];
                    document.body.appendChild(this.scripts[data[i]].script);
                }
            }
        }
    };
    $.dependenciesManager = new $.DependenciesManager;
    $.WidgetAbstract.prototype = {
        fixSize: function (val) {
            return /^[0-9]+(\.|,[0-9])*$/.test(val) ? val + "px" : val;
        },
        width: function () {
            if (this.options.autosize) {
                return "100%";
            }
            return $.WidgetAbstract.prototype.fixSize(this.options.width);
        },
        height: function () {
            if (this.options.autosize) {
                return "100%";
            }
            return $.WidgetAbstract.prototype.fixSize(this.options.height);
        },
        addWrapperFrame: function (formatters, initialValue, value) {
            var height = $.WidgetAbstract.prototype.height.call(this);
            var width = $.WidgetAbstract.prototype.width.call(this);
            value = value || "transparent";
            return '<div id="' + this.id + '-wrapper" style="' + "position: relative;" + "box-sizing: content-box;" + "width: " + width + ";" + "height: " + height + ";" + "margin: 0 auto !important;" + "padding: 0 !important;" + "font-family:Arial,sans-serif;" + '">' + '<div style="' + "width: " + width + ";" + "height: " + height + ";" + "background: " + value + ";" + "padding: 0 !important;" + '">' + formatters + "</div>" + (initialValue || "") + "</div>";
        },
        addFooterLogo: function (event, anchor) {
            var greyText = (anchor || {}).greyText || "powered by";
            var linkText = (anchor || {}).linkText || "tradingview.com";
            var href = (anchor || {}).href || "https://www.tradingview.com/";
            return $.WidgetAbstract.prototype.addWrapperFrame.call(this, event, '<div style="' + "position:absolute;" + "display: block;" + "box-sizing: content-box;" + "height: 24px;" + "width: " + $.WidgetAbstract.prototype.width.call(this) + ";" + "bottom: 0;" + "left: 0;" + "margin: 0;" + "padding: 0;" + "font-family: Arial,sans-serif;" + '">' + '<div style="' + "display: block;" + "margin: 0 1px 1px 1px;" + "line-height: 7px;" + "box-sizing: content-box;" + "height: 11px;" + "padding: 6px 10px;" +
                "text-align: right;" + "background: #fff;" + '">' + "<a" + ' href="' + href + "?" + $.generateUtmForUrlParams(this.options) + '"' + ' target="_blank"' + ' style="' + "color: #0099d4;" + "text-decoration: none;" + "font-size: 11px;" + '"' + ">" + '<span style="' + "color: #b4b4b4;" + "font-size: 11px;" + '">' + greyText + "</span> " + linkText + "</a>" + "</div>" + "</div>", "#fff");
        }
    };
    $.UserInfoWidget.prototype = {
        createWidget: function () {
            var transition = this.widgetCode();
            callback(transition, this.options.container);
        },
        widgetCode: function () {
            var query = $.createUrlParams({
                username: this.options.username,
                locale: this.options.locale
            });
            /** @type {string} */
            this.options.type = "user-info";
            /** @type {string} */
            var url = "&" + $.generateUtmForUrlParams(this.options, {
                type: "UserInfoWidget"
            });
            /** @type {string} */
            var pathOfFile = $.ideasHost + "/user-info-widget/?" + query + url;
            return "<iframe" + ' src="' + pathOfFile + '"' + (this.options.width ? ' width="' + this.options.width + '"' : "") + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
        }
    };
    $.ChatWidgetEmbed.prototype = {
        createWidget: function () {
            var result = this.widgetCode();
            result = $.WidgetAbstract.prototype.addFooterLogo.call(this, result);
            callback(result, this.options.container);
        },
        widgetCode: function () {
            /** @type {string} */
            var url = this.options.room ? "#" + encodeURIComponent(this.options.room) : "";
            /** @type {string} */
            var query = "&" + $.createUrlParams({
                whotrades: this.options.whotrades,
                locale: this.options.locale
            });
            var params = $.generateUtmForUrlParams(this.options, {
                type: "UserInfoWidget"
            });
            /** @type {string} */
            var pathOfFile = $.chatHost + "/chatwidgetembed/?" + params + query + url;
            return "<iframe" + ' src="' + pathOfFile + '"' + (this.options.width ? ' width="' + this.options.width + '"' : "") + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
        }
    };
    $.IdeaWidget.prototype = {
        createWidget: function () {
            var transition = this.widgetCode();
            callback(transition, this.options.container);
            var currentUser = this;
            /** @type {(Element|null)} */
            var frame = document.getElementById(this.id);
            this.postMessage = $.postMessageWrapper(frame.contentWindow, this.id);
            this.postMessage.on("resize", function (data) {
                if (data.id === currentUser.id) {
                    /** @type {string} */
                    frame.style.height = data.height + "px";
                }
            }, true);
        },
        widgetCode: function () {
            var query = $.createUrlParams({
                id: this.id,
                width: this.options.width,
                height: this.options.height,
                idea: this.options.idea,
                chart_url: this.options.chartUrl,
                whotrades: this.options.whotrades,
                locale: this.options.locale
            });
            /** @type {string} */
            this.options.type = "idea";
            /** @type {string} */
            var url = "&" + $.generateUtmForUrlParams(this.options);
            /** @type {string} */
            var pathOfFile = $.ideasHost + "/idea-popup/?" + query + url;
            return '<iframe id="' + this.id + '"' + ' src="' + pathOfFile + '"' + ' width="' + this.options.width + '"' + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
        },
        getSymbol: function (name) {
            this.postMessage.on("symbolInfo", name);
        }
    };
    $.EventsWidget.prototype = {
        createWidget: function () {
            var transition = this.widgetCode();
            callback(transition, this.options.container);
        },
        widgetCode: function () {
            var query = $.createUrlParams({
                currency: this.options.currency,
                importance: this.options.importance
            });
            /** @type {string} */
            this.options.type = "events";
            /** @type {string} */
            var url = "&" + $.generateUtmForUrlParams(this.options);
            /** @type {string} */
            var pathOfFile = $.host + "/eventswidgetembed/?" + query + url;
            return '<iframe src="' + pathOfFile + '"' + ' width="' + this.options.width + '"' + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" scrolling="no"></iframe>';
        }
    };
    $.IdeasStreamWidget.prototype = {
        createWidget: function () {
            var transition = this.widgetCode();
            callback(transition, this.options.container);
            var self = this;
            /** @type {(Element|null)} */
            var el = document.getElementById(this.id);
            this.postMessage = $.postMessageWrapper(el.contentWindow, this.id);
            $.bindEvent(el, "load", function () {
                /** @type {boolean} */
                self._ready = true;
                var i = self._ready_handlers.length;
                for (; i--;) {
                    self._ready_handlers[i].call(self);
                }
            });
            self.postMessage.on("resize", function (current) {
                if (current.id === self.id) {
                    /** @type {number} */
                    var maxPrimaryDepth = 450;
                    /** @type {number} */
                    var bg_h = Math.max(current.height, maxPrimaryDepth);
                    /** @type {string} */
                    el.style.height = bg_h + "px";
                }
            }, true);
        },
        widgetCode: function () {
            var options = this.options;
            var query = $.createUrlParams({
                id: this.id,
                width: options.width,
                height: options.height,
                symbol: options.symbol,
                username: options.username,
                mode: options.mode,
                publish_source: options.publishSource,
                sort: options.sort,
                stream: options.stream,
                interval: options.interval,
                time: options.time,
                wait_symbol: options.waitSymbol,
                hide_desc: options.hideDescription,
                s_count: options.startingCount,
                bg_color: options.bgColor,
                h_color: options.headerColor,
                borderColor: options.borderColor,
                locale: options.locale
            });
            /** @type {string} */
            var localizedPath = $.generateUtmForUrlParams(this.options) + "&";
            /** @type {string} */
            var dm = $.host + "/ideaswidgetembed/?" + localizedPath + query;
            return '<iframe id="' + this.id + '"' + ' src="' + dm + '"' + ' width="' + options.width + '"' + (options.height ? ' height="' + options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
        },
        setSymbol: function (settings) {
            /** @type {(Element|null)} */
            var d = document.getElementById(this.id);
            this.postMessage.post(d.contentWindow, "setSymbol", settings);
        },
        ready: function (fn) {
            if (this._ready) {
                fn.call(this);
            } else {
                this._ready_handlers.push(fn);
            }
        }
    };
    $.MiniWidget.prototype = {
        createWidget: function () {
            var result = this.widgetCode();
            var o = this.options;
            if (!o.noLogoOverlay && !o.whitelabel) {
                var greyText = this.options.greyText || "Quotes by";
                result = $.WidgetAbstract.prototype.addFooterLogo.call(this, result, {
                    greyText: greyText,
                    linkText: "TradingView"
                });
            }
            callback(result, o.container);
        },
        widgetCode: function () {
            /** @type {string} */
            var result = "";
            /** @type {string} */
            var targetForm = "";
            /** @type {string} */
            var alternativeForms = "";
            /** @type {string} */
            var url = "/miniwidgetembed/";
            /** @type {string} */
            var type = this.options.width ? "&width=" + encodeURIComponent(this.options.width) : "";
            /** @type {string} */
            var date = this.options.height ? "&height=" + encodeURIComponent(this.options.height) : "";
            /** @type {string} */
            var fileName = this.options.noGraph ? "&noGraph=" + encodeURIComponent(this.options.noGraph) : "";
            /** @type {string} */
            var lineNumber = this.options.locale ? "&locale=" + encodeURIComponent(this.options.locale) : "";
            /** @type {string} */
            var columnNumber = this.options.whitelabel ? "&whitelabel=1" : "";
            /** @type {string} */
            this.options.type = "market-overview";
            /** @type {string} */
            var baseName = "&" + $.generateUtmForUrlParams(this.options);
            /** @type {!Array} */
            var options = ["large_chart_url", "large_chart_target", "gridLineColor", "fontColor", "underLineColor", "trendLineColor", "activeTickerBackgroundColor", "timeAxisBackgroundColor", "locale", "styleTickerActiveBg", "styleTabActiveBorderColor", "styleTickerBodyFontSize", "styleTickerBodyFontWeight", "styleTickerHeadFontSize", "styleTickerHeadFontWeight", "styleTickerChangeDownColor", "styleTickerChangeUpColor", "styleTickerLastDownBg", "styleTickerLastUpBg", "styleTickerSymbolColor", "styleTickerSymbolHoverTextDecoration",
                "styleTickerActiveSymbolTextDecoration", "styleTabsActiveBorderColor", "styleTabsNoBorder", "styleWidgetNoBorder"];
            /** @type {string} */
            var key = "";
            /** @type {number} */
            var i = options.length - 1;
            for (; i >= 0; i--) {
                var prop = options[i];
                var val = this.options[prop];
                /** @type {string} */
                key = key + (val ? "&" + prop + "=" + encodeURIComponent(val) : "");
            }
            /**
             * @param {!NodeList} structure
             * @return {?}
             */
            var wrap = function (structure) {
                /** @type {!Array} */
                var userpass = [];
                /** @type {number} */
                var i = 0;
                for (; i < structure.length; i++) {
                    var value = structure[i];
                    if ($.isArray(value)) {
                        /** @type {string} */
                        var uriValue = encodeURIComponent(value[0]);
                        /** @type {string} */
                        var form = encodeURIComponent(value[1]);
                        userpass.push(uriValue);
                        /** @type {string} */
                        alternativeForms = alternativeForms + ("&" + uriValue + "=" + form);
                    } else {
                        if (typeof value === "string") {
                            userpass.push(encodeURIComponent(value));
                        }
                    }
                }
                return userpass.join(",");
            };
            if (this.options.tabs) {
                /** @type {number} */
                i = 0;
                var patchLen = this.options.tabs.length;
                for (; i < patchLen; i++) {
                    var key = this.options.tabs[i];
                    if (this.options.symbols[key]) {
                        /** @type {string} */
                        result = result + ((result ? "&" : "") + encodeURIComponent(key) + "=" + wrap(this.options.symbols[key]));
                    }
                }
                /** @type {string} */
                targetForm = "&tabs=" + encodeURIComponent(this.options.tabs.join(","));
            } else {
                if (this.options.symbols) {
                    /** @type {string} */
                    result = "symbols=" + wrap(this.options.symbols);
                }
            }
            if (this.options.symbols_description) {
                var p;
                for (p in this.options.symbols_description) {
                    alternativeForms = alternativeForms + ("&" + encodeURIComponent(p) + "=" + encodeURIComponent(this.options.symbols_description[p]));
                }
            }
            if (this.options.customer) {
                /** @type {string} */
                url = "/" + this.options.customer + url;
            }
            /** @type {string} */
            var middlePathName = $.host + url + "?" + result + targetForm + alternativeForms + key + type + date + fileName + lineNumber + columnNumber + baseName;
            return '<iframe id="' + this.id + '"' + ' src="' + middlePathName + '"' + ' width="' + this.options.width + '"' + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0"' + ' allowTransparency="true"' + ' scrolling="no"' + ' style="margin: 0 !important; padding: 0 !important;"' + "></iframe>";
        },
        remove: function () {
            /** @type {(Element|null)} */
            var gobel = document.getElementById("tradingview_widget");
            gobel.parentNode.removeChild(gobel);
        }
    };
    $.MediumWidget.prototype = {
        createWidget: function () {
            var transition = this.widgetCode();
            callback(transition, this.options.container);
        },
        widgetCode: function () {
            /**
             * @param {!NodeList} params
             * @return {?}
             */
            function toQueryString(params) {
                /** @type {!Array} */
                var userpass = [];
                /** @type {number} */
                var i = 0;
                for (; i < params.length; i++) {
                    var value = params[i];
                    if ($.isArray(value)) {
                        /** @type {string} */
                        var uriValue = encodeURIComponent(value[0]);
                        /** @type {string} */
                        var torrentURL = encodeURIComponent(value[1]);
                        userpass.push(uriValue);
                        if (value.length === 2) {
                            /** @type {string} */
                            modifier = modifier + ("&" + uriValue + "=" + torrentURL);
                        }
                    } else {
                        if (typeof value === "string") {
                            userpass.push(encodeURIComponent(value));
                        }
                    }
                }
                return userpass.join(",");
            }
            /** @type {string} */
            var modifier = "";
            /** @type {string} */
            var modifierDelimiter = "symbols=" + toQueryString(this.options.symbols);
            /** @type {string} */
            var escapedEmail = "&width=" + encodeURIComponent(this.options.width);
            /** @type {string} */
            var sitesowners = "&height=" + encodeURIComponent(this.options.height);
            /** @type {string} */
            var indexjsonListnodeId = "&colorTheme=" + encodeURIComponent(this.options.colorTheme);
            /** @type {string} */
            this.options.type = "symbol-overview";
            /** @type {string} */
            var _ = "&" + $.generateUtmForUrlParams(this.options);
            /** @type {!Array} */
            var cssKeys = ["gridLineColor", "fontColor", "underLineColor", "trendLineColor", "activeTickerBackgroundColor", "timeAxisBackgroundColor", "locale"];
            /** @type {string} */
            var key = "";
            /** @type {number} */
            var i = cssKeys.length - 1;
            for (; i >= 0; i--) {
                var prop = cssKeys[i];
                var val = this.options[prop];
                /** @type {string} */
                key = key + (val ? "&" + prop + "=" + encodeURIComponent(val) : "");
            }
            /** @type {string} */
            var shorts = this.options.chartOnly ? "&chartOnly=1" : "";
            /** @type {string} */
            var gzipStr = this.options.whitelabel ? "&whitelabel=1" : "";
            /** @type {string} */
            var parentId = this.options.isTransparent ? "&isTransparent=1" : "";
            /** @type {string} */
            var url = "/mediumwidgetembed/";
            if (this.options.customer) {
                /** @type {string} */
                url = "/" + this.options.customer + url;
            }
            /** @type {string} */
            var nav_item_id_prefix = $.host + url + "?" + modifierDelimiter + modifier + key + shorts + gzipStr + escapedEmail + sitesowners + indexjsonListnodeId + parentId + _;
            return '<iframe id="' + this.id + '"' + ' src="' + nav_item_id_prefix + '"' + ' style="' + "margin: 0 !important; " + "padding: 0 !important; " + (this.options.width ? "width: " + this.options.width + "; " : "") + (this.options.height ? "height: " + this.options.height + ";" : "") + '"' + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
        },
        remove: function () {
            /** @type {(Element|null)} */
            var gobel = document.getElementById("tradingview_widget");
            gobel.parentNode.removeChild(gobel);
        }
    };
    $.widget.prototype = {
        create: function () {
            /** @type {string} */
            this.options.type = this.options.fundamental ? "fundamental" : "chart";
            var result = this.render();
            var self = this;
            if (!this.options.noLogoOverlay) {
                result = $.WidgetAbstract.prototype.addWrapperFrame.call(this, result);
            }
            callback(result, this.options.container);
            /** @type {(Element|null)} */
            var container = document.getElementById("tradingview-copyright");
            if (container && container.parentElement) {
                container.parentElement.removeChild(container);
            }
            /** @type {(Element|null)} */
            this.iframe = document.getElementById(this.id);
            this.postMessage = $.postMessageWrapper(this.iframe.contentWindow, this.id);
            $.bindEvent(this.iframe, "load", function () {
                self.postMessage.get("widgetReady", {}, function () {
                    var i;
                    /** @type {boolean} */
                    self._ready = true;
                    i = self._ready_handlers.length;
                    for (; i--;) {
                        self._ready_handlers[i].call(self);
                    }
                });
            });
            self.postMessage.on("logoCreated", function (options) {
                if (options.left && options.bottom && options.width && options.height && options.href) {
                    if (self._logoOverlay) {
                        self._logoOverlay.parentNode.removeChild(self._logoOverlay);
                        delete self._logoOverlay;
                    }
                    /** @type {!Element} */
                    var el = document.createElement("a");
                    if (options.text) {
                        el.innerHTML = options.text;
                        /** @type {string} */
                        el.style.color = "transparent";
                    }
                    /** @type {string} */
                    el.style.position = "absolute";
                    /** @type {string} */
                    el.style.display = "inline-block";
                    el.style.left = options.left;
                    el.style.bottom = options.bottom;
                    el.style.width = options.width;
                    el.style.height = options.height;
                    /** @type {string} */
                    el.style.backgroundColor = "transparent";
                    /** @type {string} */
                    el.style.pointerEvents = "none";
                    el.href = options.href;
                    el.setAttribute("target", "_blank");
                    /** @type {!Element} */
                    self._logoOverlay = el;
                    document.getElementById(self.id + "-wrapper").appendChild(el);
                }
            });
            self.postMessage.on("setLogoOverlayVisibility", function (options) {
                if (self._logoOverlay && options && typeof options.visible == "boolean") {
                    /** @type {string} */
                    self._logoOverlay.style.display = options.visible ? "inline-block" : "none";
                }
            });
            self.postMessage.on("openChartInPopup", function (thisClass) {
                var data = $.cloneSimpleObject(self.options);
                /** @type {!Array} */
                var VALID_TYPES = ["symbol", "interval"];
                /** @type {number} */
                var type = VALID_TYPES.length - 1;
                for (; type >= 0; type--) {
                    var name = VALID_TYPES[type];
                    var val = thisClass[name];
                    if (val) {
                        data[name] = val;
                    }
                }
                /** @type {boolean} */
                data.show_popup_button = false;
                var width = self.options.popup_width || 900;
                var height = self.options.popup_height || 600;
                /** @type {number} */
                var left = (screen.width - width) / 2;
                /** @type {number} */
                var top = (screen.height - height) / 2;
                /** @type {(Window|null)} */
                var win = window.open(self.generateUrl(data), "_blank", "resizable=yes, top=" + top + ", left=" + left + ", width=" + width + ", height=" + height);
                if (win) {
                    /** @type {null} */
                    win.opener = null;
                }
            });
        },
        ready: function (fn) {
            if (this._ready) {
                fn.call(this);
            } else {
                this._ready_handlers.push(fn);
            }
        },
        render: function () {
            var path = this.generateUrl();
            return "<iframe" + ' id="' + this.id + '"' + ' src="' + path + '"' + ' style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;"' + ' frameborder="0" allowTransparency="true" scrolling="no" allowfullscreen></iframe>';
        },
        generateUrl: function (options) {
            /**
             * @param {string} text
             * @param {string} value
             * @return {?}
             */
            function slugify(text, value) {
                value = value || text;
                return options[text] === undefined ? "" : "&" + encodeURIComponent(value) + "=" + (options[text] ? "1" : "0");
            }
            /**
             * @param {string} name
             * @param {string} _
             * @param {string} id
             * @return {?}
             */
            function resolve(name, _, id) {
                id = id || name;
                return options[name] ? "&" + id + "=" + _ : "";
            }
            /**
             * @param {string} context
             * @param {?} value
             * @param {!Array} err
             * @return {?}
             */
            function done(context, value, err) {
                err = err || {};
                return "&" + context + "=" + (options[context] ? encodeURIComponent(JSON.stringify(value)) : encodeURIComponent(JSON.stringify(err)));
            }
            /**
             * @return {?}
             */
            function map() {
                if (!options.studies || !$.isArray(options.studies)) {
                    return "";
                }
                if (typeof options.studies[0] === "string") {
                    return resolve("studies", encodeURIComponent(options.studies.join("\u001f")));
                }
                return done("studies", options.studies);
            }
            options = options || this.options;
            var projectsshow;
            if (options.customer === "cme") {
                /** @type {string} */
                projectsshow = "/cmewidgetembed/";
            } else {
                if (options.customer) {
                    /** @type {string} */
                    projectsshow = "/" + options.customer + "/widgetembed/";
                } else {
                    /** @type {string} */
                    projectsshow = "/widgetembed/";
                }
            }
            /** @type {string} */
            var host = options.enable_publishing ? $.ideasHost : $.host;
            /** @type {string} */
            var OCurl = host + projectsshow + "?frameElementId=" + this.id + "&symbol=" + encodeURIComponent(options.symbol) + "&interval=" + encodeURIComponent(options.interval) + (options.range ? "&range=" + encodeURIComponent(options.range) : "") + (options.whitelabel ? "&whitelabel=1" : "") + (options.hide_top_toolbar ? "&hidetoptoolbar=1" : "") + (options.hide_legend ? "&hidelegend=1" : "") + slugify("hide_side_toolbar", "hidesidetoolbar") + slugify("allow_symbol_change", "symboledit") + slugify("save_image",
                "saveimage") + "&toolbarbg=" + options.toolbar_bg.replace("#", "") + (options.watchlist && options.watchlist.length && options.watchlist.join ? "&watchlist=" + encodeURIComponent(options.watchlist.join("\u001f")) : "") + resolve("editablewatchlist", "1") + resolve("details", "1") + resolve("calendar", "1") + resolve("hotlist", "1") + resolve("news", "1") + map() + (options.news_vendors ? "&newsvendors=" + encodeURIComponent(options.news_vendors.join("\u001f")) : "") + slugify("horztouchdrag") +
                slugify("verttouchdrag") + resolve("widgetbar_width", options.widgetbar_width, "widgetbarwidth") + resolve("hideideas", "1") + resolve("theme", encodeURIComponent(options.theme)) + resolve("style", encodeURIComponent(options.style)) + (options.extended_hours === undefined ? "" : "&extended_hours=" + options.extended_hours) + resolve("timezone", encodeURIComponent(options.timezone)) + resolve("hideideasbutton", "1") + resolve("withdateranges", "1") + resolve("hidevolume", "1") + (options.padding ===
                    undefined ? "" : "&padding=" + options.padding) + resolve("show_popup_button", "1", "showpopupbutton") + done("studies_overrides", options.studies_overrides, {}) + done("overrides", options.overrides, {}) + done("enabled_features", options.enabled_features, []) + done("disabled_features", options.disabled_features, []) + (options.show_popup_button ? "&showpopupbutton=1" : "") + (options.publish_source ? "&publishsource=" + encodeURIComponent(options.publish_source) : "") + (options.enable_publishing ?
                        "&enablepublishing=" + encodeURIComponent(options.enable_publishing) : "") + (options.venue ? "&venue=" + encodeURIComponent(options.venue) : "") + (options.symbology ? "&symbology=" + encodeURIComponent(options.symbology) : "") + (options.whotrades ? "&whotrades=" + encodeURIComponent(options.whotrades) : "") + (options.locale ? "&locale=" + options.locale : "") + (options.referral_id ? "&referral_id=" + options.referral_id : "") + (options.no_referral_id ? "&no_referral_id=1" : "") + (options.ref_landing_page ?
                            "&ref_landing_page=" + options.ref_landing_page : "") + (options.fundamental ? "&fundamental=" + encodeURIComponent(options.fundamental) : "") + (options.percentage ? "&percentage=" + encodeURIComponent(options.percentage) : "") + "&utm_source=" + encodeURI(window.location.hostname) + "&utm_medium=" + ($.hasCopyright(options.container) ? "widget_new" : "widget") + (options.type ? "&utm_campaign=" + options.type : "") + (options.type && options.type === "chart" ? "&utm_term=" + encodeURIComponent(options.symbol) :
                                "");
            return OCurl;
        },
        image: function (callback) {
            this.postMessage.get("imageURL", {}, function (value) {
                /** @type {string} */
                var link = $.host + "/x/" + value + "/";
                callback(link);
            });
        },
        subscribeToQuote: function (callback) {
            /** @type {(Element|null)} */
            var d = document.getElementById(this.id);
            this.postMessage.post(d.contentWindow, "quoteSubscribe");
            this.postMessage.on("quoteUpdate", callback);
        },
        getSymbolInfo: function (type) {
            this.postMessage.get("symbolInfo", {}, type);
        },
        remove: function () {
            /** @type {(Element|null)} */
            var inp = document.getElementById(this.id);
            inp.parentNode.removeChild(inp);
        },
        reload: function () {
            /** @type {(Element|null)} */
            var node = document.getElementById(this.id);
            /** @type {(Node|null)} */
            var message = node.parentNode;
            message.removeChild(node);
            message.innerHTML = this.render();
        }
    };
    $.chart.prototype = {
        create: function () {
            this.isMobile = $.isMobileDevice.any;
            var result = this.render();
            var me = this;
            var element;
            if (!$.chartCssAttached) {
                $.css(this.renderCss());
                /** @type {boolean} */
                $.chartCssAttached = true;
            }
            callback(result, this.options.container);
            /** @type {(Element|null)} */
            element = document.getElementById(this.id);
            $.bindEvent(element, "load", function () {
                var i;
                /** @type {boolean} */
                me._ready = true;
                i = me._ready_handlers.length;
                for (; i--;) {
                    me._ready_handlers[i].call(me);
                }
            });
            $.onready(function () {
                /** @type {boolean} */
                var rf = false;
                if (document.querySelector && document.querySelector('a[href$="/v/' + me.options.chart + '/"]')) {
                    /** @type {boolean} */
                    rf = true;
                }
                if (!rf) {
                    /** @type {!NodeList<Element>} */
                    var sidebarlinks = document.getElementsByTagName("a");
                    /** @type {!RegExp} */
                    var negativeRegex = new RegExp("/v/" + me.options.chart + "/$");
                    /** @type {!RegExp} */
                    var queryRegExp = new RegExp("/chart/([0-9a-zA-Z:+*-/()]+)/" + me.options.chart);
                    /** @type {number} */
                    var i = 0;
                    for (; i < sidebarlinks.length; i++) {
                        if (negativeRegex.test(sidebarlinks[i].href) || queryRegExp.test(sidebarlinks[i].href)) {
                            /** @type {boolean} */
                            rf = true;
                            break;
                        }
                    }
                }
                if (rf) {
                    element.src += "#nolinks";
                    /** @type {string} */
                    element.name = "nolinks";
                }
            });
            this.postMessage = $.postMessageWrapper(element.contentWindow, this.id);
            this.postMessage.on("toggleFullscreen", function (event) {
                if (element.contentWindow === this.source) {
                    me.toggleFullscreen(event.value);
                }
            }, true);
        },
        ready: $.widget.prototype.ready,
        renderCss: function () {
            return ".tradingview-widget {position: relative;}";
        },
        render: function () {
            /** @type {string} */
            var contentHt = this.options.mobileStatic && this.isMobile ? $.host + "/embed-static/" : $.host + "/embed/";
            /** @type {string} */
            var picKey = "?method=script" + (this.options.locale ? "&locale=" + encodeURIComponent(this.options.locale) : "");
            /** @type {string} */
            this.options.type = "chart";
            return '<div class="tradingview-widget" ' + (this.options.autosize ? ' style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;"' : ' style="width:' + this.options.width + "px;" + " height:" + this.options.height + 'px;"') + ">" + '<iframe id="' + this.id + '"' + ' src="' + contentHt + this.options.chart + "/" + picKey + "&" + $.generateUtmForUrlParams(this.options) + '"' + (this.options.autosize ? ' style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;"' :
                ' width="' + this.options.width + '"' + ' height="' + this.options.height + '"') + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>' + "</div>";
        },
        toggleFullscreen: function (abrDoc) {
            /** @type {(Element|null)} */
            var canvas = document.getElementById(this.id);
            if (!abrDoc) {
                /** @type {string} */
                canvas.style.position = "static";
                if (this.options.autosize) {
                    /** @type {string} */
                    canvas.style.width = "100%";
                    /** @type {string} */
                    canvas.style.height = "100%";
                } else {
                    /** @type {string} */
                    canvas.style.width = this.options.width + "px";
                    /** @type {string} */
                    canvas.style.height = this.options.height + "px";
                }
                /** @type {string} */
                canvas.style.maxWidth = "none";
                /** @type {string} */
                canvas.style.maxHeight = "none";
                /** @type {string} */
                canvas.style.zIndex = "auto";
                /** @type {string} */
                canvas.style.backgroundColor = "transparent";
            } else {
                /** @type {string} */
                canvas.style.position = "fixed";
                /** @type {string} */
                canvas.style.width = "100vw";
                /** @type {string} */
                canvas.style.maxWidth = "100%";
                /** @type {string} */
                canvas.style.height = "100vh";
                /** @type {string} */
                canvas.style.maxHeight = "100%";
                /** @type {string} */
                canvas.style.left = "0px";
                /** @type {string} */
                canvas.style.top = "0px";
                /** @type {string} */
                canvas.style.zIndex = "1000000";
                /** @type {string} */
                canvas.style.backgroundColor = "#fff";
            }
        },
        getSymbolInfo: function (type) {
            this.postMessage.get("symbolInfo", {}, type);
        }
    };
    $.stream.prototype = {
        create: function () {
            this.isMobile = $.isMobileDevice.any;
            var result = this.render();
            callback(result, this.options.container);
        },
        render: function () {
            /** @type {string} */
            var chartId = "?" + (this.options.locale ? "&locale=" + encodeURIComponent(this.options.locale) : "");
            /** @type {string} */
            this.options.type = "chart";
            return '<div class="tradingview-widget" ' + (this.options.autosize ? ' style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;"' : ' style="width:' + this.options.width + "px;" + " height:" + this.options.height + 'px;"') + ">" + '<iframe id="' + this.id + '"' + ' src="' + $.host + this.options.stream + "/embed/" + chartId + "&" + $.generateUtmForUrlParams(this.options) + '"' + (this.options.autosize ? ' style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;"' :
                ' width="' + this.options.width + '"' + ' height="' + this.options.height + '"') + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>' + "</div>";
        }
    };
    /**
     * @param {?} res
     * @param {?} callback
     * @return {undefined}
     */
    $.showSignIn = function (res, callback) {
        $.dependenciesManager.depends(["/static/bundles/spinner.js"], "authWidget", function () {
            /** @type {!Element} */
            var element = document.createElement("div");
            /** @type {!Element} */
            var target = document.createElement("div");
            element.appendChild(target);
            (new window.Spinner).setStyle({
                color: "#00A2E2",
                opacity: "0"
            }).spin(target);
            /** @type {string} */
            element.style.cssText = "position: fixed;" + "left: 0;" + "top: 0;" + "width: 100%;" + "height: 100%;" + "background: rgba(0, 0, 0, 0.5);" + "z-index: 120;" + "-webkit-transform: translate3d(0, 0, 0);";
            element.addEventListener("click", function () {
                document.body.removeChild(element);
            });
            document.body.appendChild(element);
            var id = $.gId();
            var query = $.createUrlParams({
                id: id,
                utmSourceOverride: res.utmSourceOverride
            });
            /** @type {string} */
            var dm = $.ideasHost + "/authwidget/?" + query;
            var fboData = {
                width: "470px",
                height: "650px"
            };
            /** @type {string} */
            var DEFAULT_404_PAGE = '<iframe id="' + id + '"' + ' src="' + dm + '"' + ' width="' + fboData.width + '"' + (fboData.height ? ' height="' + fboData.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
            /** @type {!Element} */
            var container = document.createElement("div");
            /** @type {string} */
            container.innerHTML = DEFAULT_404_PAGE;
            /** @type {string} */
            container.style.cssText = "position: absolute;" + "left: 50%;" + "top: 50%;" + "margin-top: -325px;" + "margin-left: -235px;";
            element.appendChild(container);
            /** @type {(Element|null)} */
            var ret = document.getElementById(id);
            var doc = $.postMessageWrapper(ret.contentWindow, id);
            /**
             * @param {!Object} data
             * @return {undefined}
             */
            var onClose = function (data) {
                if (data.id === id) {
                    document.body.removeChild(element);
                    if (data.user) {
                        callback(data.user);
                    }
                    doc.off("close", onClose);
                }
            };
            doc.on("close", onClose, true);
            doc.on("widgetLoad", function () {
                /** @type {string} */
                target.style.display = "none";
            });
        });
    };
    /**
     * @param {?} res
     * @param {?} callback
     * @return {undefined}
     */
    $.isSignedIn = function (res, callback) {
        var id = $.gId();
        var query = $.createUrlParams({
            id: id
        });
        /** @type {string} */
        var dm = $.ideasHost + "/isauthwidget/?" + query;
        /** @type {string} */
        var DEFAULT_404_PAGE = '<iframe id="' + id + '"' + ' src="' + dm + '"' + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
        /** @type {!Element} */
        var container = document.createElement("div");
        /** @type {string} */
        container.innerHTML = DEFAULT_404_PAGE;
        document.body.appendChild(container);
        /** @type {(Element|null)} */
        var ret = document.getElementById(id);
        var doc = $.postMessageWrapper(ret.contentWindow, id);
        /**
         * @param {!Object} data
         * @return {undefined}
         */
        var onClose = function (data) {
            if (data.id === id) {
                document.body.removeChild(container);
                callback(data.user);
                doc.off("close", onClose);
            }
        };
        doc.on("close", onClose, true);
    };
    /**
     * @param {?} doNotMakeOrders
     * @param {?} cb
     * @return {undefined}
     */
    $.onLoginStateChange = function (doNotMakeOrders, cb) {
        var i = $.gId();
        var query = $.createUrlParams({
            id: i
        });
        /** @type {string} */
        var dm = $.ideasHost + "/loginstatewidget/?" + query;
        /** @type {string} */
        var DEFAULT_404_PAGE = '<iframe id="' + i + '"' + ' src="' + dm + '"' + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
        /** @type {!Element} */
        var container = document.createElement("div");
        /** @type {string} */
        container.innerHTML = DEFAULT_404_PAGE;
        document.body.appendChild(container);
        /** @type {(Element|null)} */
        var ret = document.getElementById(i);
        var j = $.postMessageWrapper(ret.contentWindow, i);
        /**
         * @param {!Object} data
         * @return {undefined}
         */
        var sort = function (data) {
            if (data.id === i) {
                cb(data.user);
            }
        };
        j.on("loginStateChange", sort, true);
    };
    $.postMessageWrapper = function () {
        var userList = {};
        var eventTable = {};
        var inputsToClear = {};
        var parent;
        /** @type {number} */
        var nChanges = 0;
        /** @type {number} */
        var polygonId = 0;
        /** @type {string} */
        var settings = "TradingView";
        if (window.addEventListener) {
            window.addEventListener("message", function (message) {
                var data;
                try {
                    /** @type {*} */
                    data = JSON.parse(message.data);
                } catch (error) {
                    return;
                }
                if (!data || !data.provider || data.provider !== settings) {
                    return;
                }
                /** @type {(Window|null)} */
                data.source = message.source;
                if (data.type === "get") {
                    if (!eventTable[data.name]) {
                        return;
                    }
                    eventTable[data.name].forEach(function (rtc) {
                        if (typeof rtc === "function") {
                            rtc.call(data, data.data, function (instancesTypes) {
                                var params = {
                                    id: data.id,
                                    type: "on",
                                    name: data.name,
                                    client_id: data.client_id,
                                    data: instancesTypes,
                                    provider: settings
                                };
                                parent.postMessage(JSON.stringify(params), "*");
                            });
                        }
                    });
                } else {
                    if (data.type === "on") {
                        if (userList[data.client_id] && userList[data.client_id][data.id]) {
                            userList[data.client_id][data.id].call(data, data.data);
                            delete userList[data.client_id][data.id];
                        }
                    } else {
                        if (data.type === "post") {
                            if (!eventTable[data.name]) {
                                return;
                            }
                            eventTable[data.name].forEach(function (rtc) {
                                if (typeof rtc === "function") {
                                    rtc.call(data, data.data, function () {
                                    });
                                }
                            });
                        }
                    }
                }
            });
        }
        return function (el, i) {
            userList[i] = {};
            /** @type {!Worker} */
            inputsToClear[i] = el;
            /** @type {!Worker} */
            parent = el;
            return {
                on: function (type, name, data) {
                    if (!eventTable[type] || !data) {
                        /** @type {!Array} */
                        eventTable[type] = [];
                    }
                    eventTable[type].push(name);
                },
                off: function (event, listener) {
                    if (!eventTable[event]) {
                        return false;
                    }
                    var oIndex = eventTable[event].indexOf(listener);
                    if (oIndex > -1) {
                        eventTable[event].splice(oIndex, 1);
                    }
                },
                get: function (options, callback, type) {
                    var params = {
                        id: nChanges++,
                        type: "get",
                        name: options,
                        client_id: i,
                        data: callback,
                        provider: settings
                    };
                    /** @type {!Function} */
                    userList[i][params.id] = type;
                    inputsToClear[i].postMessage(JSON.stringify(params), "*");
                },
                post: function (socket, name, data) {
                    var payload = {
                        id: polygonId++,
                        type: "post",
                        name: name,
                        data: data,
                        provider: settings
                    };
                    if (socket && typeof socket.postMessage === "function") {
                        socket.postMessage(JSON.stringify(payload), "*");
                    }
                }
            };
        };
    }();
    /**
     * @return {?}
     */
    $.getUrlParams = function () {
        /** @type {!RegExp} */
        var spaceRegexp = /\+/g;
        /** @type {!RegExp} */
        var comment = /([^&=]+)=?([^&]*)/g;
        /** @type {string} */
        var data = window.location.search.substring(1);
        /** @type {(Array<string>|null)} */
        var result = comment.exec(data);
        /**
         * @param {string} s
         * @return {?}
         */
        var decode = function (s) {
            return decodeURIComponent(s.replace(spaceRegexp, " "));
        };
        var urlParams = {};
        for (; result;) {
            urlParams[decode(result[1])] = decode(result[2]);
            /** @type {(Array<string>|null)} */
            result = comment.exec(data);
        }
        return urlParams;
    };
    /**
     * @param {!Object} obj
     * @return {?}
     */
    $.createUrlParams = function (obj) {
        /** @type {!Array} */
        var drilldownLevelLabels = [];
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] != null) {
                drilldownLevelLabels.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
            }
        }
        return drilldownLevelLabels.join("&");
    };
    /**
     * @param {string} result
     * @param {?} target
     * @return {undefined}
     */
    var callback = function (result, target) {
        /** @type {(Element|null)} */
        var td = document.getElementById(target);
        if (td) {
            /** @type {string} */
            td.innerHTML = result;
            /** @type {(Element|null)} */
            var canvasStick = td.parentElement && td.parentElement.querySelector(".tradingview-widget-copyright");
            if (canvasStick) {
                /** @type {(number|string)} */
                canvasStick.style.width = td.querySelector("iframe").style.width;
            }
        } else {
            document.write(result);
        }
        document.body.appendChild($.embedStylesForCopyright());
    };
    /**
     * @param {!Object} obj1
     * @param {!Object} obj2
     * @return {?}
     */
    var extend = function (obj1, obj2) {
        var name;
        for (name in obj2) {
            if ("object" !== typeof obj2[name] || !obj1.hasOwnProperty(name)) {
                obj1[name] = obj2[name];
            } else {
                extend(obj1[name], obj2[name]);
            }
        }
        return obj1;
    };
    if (window.TradingView) {
        extend(window.TradingView, $);
    } else {
        window.TradingView = $;
    }
})();
