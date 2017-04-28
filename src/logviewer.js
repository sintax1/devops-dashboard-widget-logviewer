'use strict';

angular.module('DevopsDashboard.widget.logviewer', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('logviewer', {
        title: 'Log Viewer',
        description: 'View Dashboard logs',
        authorizedGroups: ['root9B root9b_all'],
        templateUrl: '{widgetsPath}/logviewer/src/view.html',
        edit: {
          templateUrl: '{widgetsPath}/logviewer/src/edit.html'
        },
        controller: 'logDataCtrl'
      });
  })
  .controller('logDataCtrl', function($scope, $timeout, User, DBLogger) {

    $scope.smartTableData = [];     // Resulting data set after search, filter, etc.
    $scope.smartTableDataSrc = [];  // Original raw data set
    $scope.smartTablePageSize = 10;

    var refreshLogs = $scope.refreshLogs = function() {

      var user = User.get({}, function() {
        var uid = user.uid;
        var logs = DBLogger.query({uid: uid}, function() {
          angular.forEach(logs, function(log) {
            log.service = log.log.service;
            log.command = log.log.command;
            log.output = JSON.stringify(log.log.data);
            this.push(log);
          }, $scope.smartTableDataSrc);

          // Initialize the rows per page select menu
          $('.selectpicker').selectpicker('refresh');
        });
      });
    };

    refreshLogs();

  });
