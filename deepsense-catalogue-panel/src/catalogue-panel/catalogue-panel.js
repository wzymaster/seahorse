function OperationCatalogue () {
  return {
    scope: {
      catalogCollection: '=',
      isRunning: '='
    },
    templateUrl: 'catalogue-panel/catalogue-panel.html',
    replace: 'true',
    controllerAs: 'cpCtrl',
    controller: ['$scope', '$filter', function($scope, $filter) {

      var cpCtrl = this;
      cpCtrl.search = '';

      cpCtrl.clearSearch = function() {
        cpCtrl.search = '';
      };

      cpCtrl._filterOut = function(tree, filterQuery) {
        let newTree = angular.copy(tree);
        newTree.catalog = _
          .chain(newTree.catalog)
          .map(c => cpCtrl._filterOut(c, filterQuery))
          .filter(c => !_.isNull(c))
          .value();
        newTree.items = _.filter(newTree.items, (item) => {
          return item.name.toLowerCase().indexOf(filterQuery.toLowerCase()) > -1
        });
        if (newTree.catalog.length === 0 && newTree.items.length === 0) {
          return null;
        } else {
          return newTree;
        }
      };

      $scope.$watch('cpCtrl.search', function (val) {
        let catalogs = $scope.catalogCollection;
        let tree = {catalog: catalogs, items: []};
        let data = cpCtrl._filterOut(tree, val);
        $scope.filteredData = data ? data.catalog : [];
      });
    }]
  };
}

namespace.directive("operationCatalogue", OperationCatalogue);
