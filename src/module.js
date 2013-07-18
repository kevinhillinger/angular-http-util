angular.module('http.util', [])
    .provider('http.util.httpMapping', HttpMappingProvider)
    .provider('http.util.httpPathUtility', HttpPathUtilityProvider)
    .factory('http.util.httpRequestInterceptor', httpRequestInterceptor)

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('http.util.httpRequestInterceptor');
    }]);