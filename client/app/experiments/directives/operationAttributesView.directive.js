/**
 * Copyright (c) 2015, CodiLime Inc.
 *
 * Owner: Grzegorz Swatowski
 */

'use strict';

function OperationAttributesView() {
  return {
    restrict: 'E',
    scope: {
      node: '=',
      showOperationAttributesPanel: '='
    },
    templateUrl: 'app/experiments/experiment.operationAttributesView.html',
    replace: true,
    link: function (scope, element, attrs) {
      element.find('button').on('click', function() {
        scope.showOperationAttributesPanel.value = false;
        scope.$apply();
      });

      scope.$watch('node', function() {
        var container = element[0],
            header = container.querySelector('.panel-heading'),
            body = container.querySelector('.panel-body'),
            footer = container.querySelector('.panel-footer');
        scope.$applyAsync(() => {
          angular.element(body).css('height', (container.offsetHeight - header.offsetHeight - footer.offsetHeight - 2) + 'px');
        });
      });
    }
  };
}

exports.inject = function (module) {
  module.directive('operationAttributesView', OperationAttributesView);
};
