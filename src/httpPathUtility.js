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