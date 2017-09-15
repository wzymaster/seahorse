/**
 * Copyright (c) 2015, CodiLime Inc.
 */
'use strict';

/* @ngInject */
function ExperimentController(
  experiment,
  $http, $modal, $timeout, $scope, $log,
  PageService, Operations, GraphPanelRendererService, ExperimentService,
  ExperimentApiClient, UUIDGenerator, MouseEvent,
  DeepsenseNodeParameters, FreezeService, NotificationService
) {
  const RUN_STATE_CHECK_INTERVAL = 2000;

  var that = this;
  var internal = {};

  var GraphNode = require('./common-objects/common-graph-node.js');
  var Edge = require('./common-objects/common-edge.js');

  internal.selectedNode = null;

  /**
   * Loads all view-specific data.
   */
  internal.init = function init() {
    PageService.setTitle('Experiment: ' + experiment.experiment.name);

    ExperimentService.setExperiment(ExperimentService.createExperiment(experiment, Operations.getData()));
    GraphPanelRendererService.setExperiment(ExperimentService.getExperiment());

    internal.updateAndRerenderEdges(experiment);
  };

  /**
   * Handles experiment state change.
   *
   * @param {object} data
   */
  internal.handleExperimentStateChange = function handleExperimentStateChange(data) {
    if (ExperimentService.experimentIsSet()) {
      let experimentState;

      ExperimentService.getExperiment().updateState(data.experiment.state);
      experimentState = ExperimentService.getExperiment().getStatus();
      that.checkExperimentState();
      FreezeService.handleExperimentStateChange(experimentState);
    }
  };

  internal.rerenderEdges = function rerenderEdges() {
    ExperimentService.updateEdgesStates();
    GraphPanelRendererService.changeEdgesPaintStyles();
  };

  /**
   * Updates edges' states and rerender all edges.
   *
   * @param {Object} data
   */
  internal.updateAndRerenderEdges = function updateAndRerenderEdges(data) {
    ExperimentService.updateTypeKnowledge(data);
    internal.rerenderEdges();
  };

  /**
   * Saves the experiment data by sending a request to the server.
   *
   * @returns {Promise}
   */
  internal.saveExperiment = function saveExperiment() {
    let serializedExperiment = ExperimentService.getExperiment().serialize();

    return ExperimentApiClient.
      saveData({
        'experiment': serializedExperiment
      }).
      then((result) => {
        if (ExperimentService.experimentIsSet()) {
          internal.handleExperimentStateChange(result);
          internal.updateAndRerenderEdges(result);

          $scope.$emit('Experiment.SAVE.SUCCESS');

          // TODO: compare sent data with response / update experiment if needed
        }
      }, (error) => {
        $scope.$emit('Experiment.SAVE.ERROR', error);
      });
  };

  /**
   * Loads experiment state data.
   */
  internal.loadExperimentState = function loadExperimentState() {
    if (ExperimentService.experimentIsSet()) {
      ExperimentApiClient.
        getData(ExperimentService.getExperiment().getId()).
        then((data) => {
          if (ExperimentService.experimentIsSet()) {
            internal.handleExperimentStateChange(data);
            internal.updateAndRerenderEdges(data);
          }
        }, (error) => {
          console.error('experiment fetch state error', error);
        });
    }
  };

  /**
   * Executes when all nodes are rendered.
   * It triggers the jsPlumb drawing.
   */
  that.onRenderFinish = function onRenderFinish() {
    GraphPanelRendererService.init();
    GraphPanelRendererService.renderPorts();
    GraphPanelRendererService.renderEdges();
    GraphPanelRendererService.repaintEverything();

    that.checkExperimentState();

    $scope.$broadcast('Experiment.RENDER_FINISHED');
  };

  /**
   * Triggers experiment state check.
   */
  that.checkExperimentState = function checkExperimentState() {
    $timeout.cancel(internal.runStateTimeout);
    if (ExperimentService.getExperiment().isRunning()) {
      internal.runStateTimeout = $timeout(internal.loadExperimentState, RUN_STATE_CHECK_INTERVAL, false);
    }
  };

  that.getCatalog = Operations.getCatalog;

  that.getExperiment = ExperimentService.getExperiment;

  that.getSelectedNode = function getSelectedNode() {
    return internal.selectedNode;
  };

  that.unselectNode = function unselectNode() {
    internal.selectedNode = null;
  };


  $scope.$on(GraphNode.CLICK, (event, data) => {
    let node = data.selectedNode;

    internal.selectedNode = node;

    if (node.hasParameters()) {
      $scope.$digest();
    } else {
      Operations.getWithParams(node.operationId).then((operationData) => {
        $scope.$applyAsync(() => {
          node.setParameters(operationData.parameters, DeepsenseNodeParameters);
        });
      }, (error) => {
        console.error('operation fetch error', error);
      });
    }
  });

  $scope.$on('Experiment.SAVE', () => {
    internal.saveExperiment();
  });

  $scope.$on(GraphNode.MOVE, (data) => {
    //internal.saveExperiment();
  });

  $scope.$on(Edge.CREATE, (data, args)  => {
    ExperimentService.getExperiment().addEdge(args.edge);
    internal.rerenderEdges();
    internal.saveExperiment();
  });

  $scope.$on(Edge.REMOVE, (data, args)  => {
    ExperimentService.getExperiment().removeEdge(args.edge);
    internal.rerenderEdges();
    internal.saveExperiment();
  });

  $scope.$on('Keyboard.KEY_PRESSED_DEL', (event, data) => {
    if (internal.selectedNode && !ExperimentService.getExperiment().isRunning()) {
      ExperimentService.getExperiment().removeNode(internal.selectedNode.id);
      GraphPanelRendererService.removeNode(internal.selectedNode.id);
      that.unselectNode();

      internal.rerenderEdges();

      that.onRenderFinish();
      $scope.$digest();

      internal.saveExperiment();
    }
  });

  $scope.$on('FlowChartBox.ELEMENT_DROPPED', function elementDropped(event, args) {
    let dropElementOffset = MouseEvent.getEventOffsetOfElement(args.dropEvent, args.target);
    let operation = Operations.get(args.elementId);
    let offsetX = dropElementOffset.x;
    let offsetY = dropElementOffset.y;
    let positionX = offsetX || 0;
    let positionY = offsetY || 0;
    let elementOffsetX = 100;
    let elementOffsetY = 30;
    let node = ExperimentService.getExperiment().createNode({
        'id': UUIDGenerator.generateUUID(),
        'operation': operation,
        'x': positionX > elementOffsetX ? positionX - elementOffsetX : 0,
        'y': positionY > elementOffsetY ? positionY - elementOffsetY : 0
      });

    ExperimentService.getExperiment().addNode(node);
    GraphPanelRendererService.repaintEverything();
    $scope.$digest();
    that.onRenderFinish();
    internal.saveExperiment();
  });

  $scope.$on('Experiment.RUN', () => {
    internal.saveExperiment().then(() => {
      return ExperimentApiClient.runExperiment(
        ExperimentService.getExperiment().getId()
      );
    }).then((data) => {
      internal.handleExperimentStateChange(data);
      $scope.$emit('Experiment.RUN.SUCCESS', data);
    }, (error) => {
      $scope.$emit('Experiment.RUN.ERROR', error);
    });
  });

  $scope.$on('Experiment.ABORT', () => {
    ExperimentApiClient.abortExperiment(ExperimentService.getExperiment().getId()).then((data) => {
      internal.handleExperimentStateChange(data);
      $scope.$emit('Experiment.ABORT.SUCCESS', data);
    }, (error) => {
      $scope.$emit('Experiment.ABORT.ERROR', error);
    });
  });

  $scope.$on('AttributePanel.UNSELECT_NODE', () => {
    that.unselectNode();
    $scope.$digest();
  });

  $scope.$on('$destroy', () => {
    $timeout.cancel(internal.runStateTimeout);
    ExperimentService.clearExperiment();
    GraphPanelRendererService.clearExperiment();
  });

  internal.init();

  return that;
}

exports.function = ExperimentController;

exports.inject = function (module) {
  module.controller('ExperimentController', ExperimentController);
};
