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