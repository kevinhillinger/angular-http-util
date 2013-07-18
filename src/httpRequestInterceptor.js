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