//FIX
jQuery.browser = {};
(function() {
	jQuery.browser.msie = false;
	jQuery.browser.version = 0;
	if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
		jQuery.browser.msie = true;
		jQuery.browser.version = RegExp.$1;
	}
})();


angular.module("App", [])

.config(['$httpProvider', '$sceDelegateProvider',
	function($httpProvider, $sceDelegateProvider) {
		$httpProvider.defaults.useXDomain = true;
		$sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?quadramma.com/]);
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
])


.controller('AppController', function(
	$scope, $rootScope, $timeout
) {
	console.info("AppController -> initialized");


	//FEED URL 
	//http://feeds.bbci.co.uk/news/rss.xml

	var x = function(a, b, c) {
			c = new XMLHttpRequest;
			c.open('GET', a);
			c.onload = b;
			c.send()
		},
		yql = function(a, b) {
			return 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from ' + b + ' where url=\"' + a + '\"') + '&format=json';
		};

	x(yql('http://feeds.bbci.co.uk/news/rss.xml', 'xml'), function() {
		var res = JSON.parse(this.response);
		$timeout(function() {
			var items = _.filter(res.query.results.rss.channel.item, function(item, index) {
				item.thumburl = (item.thumbnail[1]).url;
				item.thumburlbig = (item.thumbnail[1]).url;
				return index < 10;
			});
			res.query.results.rss.channel.item = items;

			$scope.$apply(function() {
				$scope.channel = res.query.results.rss.channel;
				console.info($scope.channel);
			});
		});

	});

})


;