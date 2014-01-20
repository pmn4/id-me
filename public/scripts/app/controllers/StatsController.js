function StatsController($scope, $log, $scanDispatcher) {
	$scope.$on($scanDispatcher.EVENT_NAME, function() {
		$log.info("AppStatsController: ", $scanDispatcher.identity);
	});
}