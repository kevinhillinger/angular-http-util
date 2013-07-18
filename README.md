## angular-http-util

A lightweight http utility library that allows you to point to different http services, and still let you define relative urls.

## Example

The httpMapping provider is where you define how to resolve your urls.

```javascript

angular.module('app', ['http.util'])
    .controller('mainController', function ($scope, $http) {
        $scope.people = [];
        
        //http resource path is relative
        $http.get('/api/people').success(function(result) {
            $scope.people = result;
        });
    })
    .config(['http.util.httpMappingProvider', function (httpMappingProvider) {
        //here, we define when a particular pattern is found in the url, then to resolve it using these http variables
        httpMappingProvider.when('^/api/people', {
            scheme: 'http',
            port: 3001,
            hostname: 'localhost'
        });
    }]);
	
```

## Licensing

MIT license.