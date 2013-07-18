/**
 * AngularJS http service utilities
 * @author Kevin Hillinger
 * @version v0.1.0 - 2013-07-18
 * @link http://github.com/kevinhillinger/angular-http-util
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
function HttpMappingProvider() {
    var mappings = {};

    this.when = function (pattern, map) {
        map = angular.extend(map, {
            pattern: pattern, caseInsensitiveMatch: false,
            regex: new RegExp(pattern, map.caseInsensitiveMatch ? 'i' : '')
        });
        mappings[pattern] = create(map);
        return this;
    };

    this.$get = function() {
        var httpMapping = {
            mappings: mappings,
            match: function(url) {
                var mapping = null;
                angular.forEach(mappings, function(m) {
                    if (m.isMatch(url)) {
                        mapping = m;
                    }
                });
                return mapping;
            }
        };
        return httpMapping;
    };

    function create(map) {
        return angular.extend({
            uri: getUri(map),
            isMatch: function(url) {
                return map.regex.test(url);
            }
        }, map);
    }

    function getUri(mapping) {
        var uri = (mapping.scheme || "http") + "://" + mapping.hostname;

        if (mapping.port && !isNaN(mapping.port)) {
            uri += ':' + mapping.port;
        }
        return uri;
    }
}
function HttpPathUtilityProvider() {
    this.$get = ['http.util.httpMapping', function (httpMapping) {
        var urlCache = {};
        var httpPathUtility = {
            resolveUrl: function(url) {
                if (!shouldResolveUrl(url)) {
                    return url;
                }
                return urlCache[url] || (urlCache[url] = resolve(url));
            },
            refresh: function() {
                urlCache = {};
            }
        };

        return httpPathUtility;
        
        function shouldResolveUrl(url) {
            return url && url.length > 0 && url.indexOf('http') !== 0;
        }
        
        function resolve(url) {
            var mapping = httpMapping.match(url);
            return !mapping ? url : (mapping.uri + sanitizeUrl(url));
        }
        
        function sanitizeUrl(url) {
            return url.indexOf('/') === 0 ? url : '/' + url;
        }
    }];
}
var httpRequestInterceptor = ['http.util.httpPathUtility', '$q', function (httpPathUtility, $q) {
    return {
        request: function (config) {
            if (config) {
                config.url = httpPathUtility.resolveUrl(config.url);
            }
            return config || $q.when(config);
        }
    };
}];
angular.module('http.util', [])
    .provider('http.util.httpMapping', HttpMappingProvider)
    .provider('http.util.httpPathUtility', HttpPathUtilityProvider)
    .factory('http.util.httpRequestInterceptor', httpRequestInterceptor)

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('http.util.httpRequestInterceptor');
    }]);