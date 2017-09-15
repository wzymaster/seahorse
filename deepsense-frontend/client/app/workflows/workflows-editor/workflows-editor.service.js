'use strict';

const COOKIE_NAME = 'SEAHORSE_NODE_DELETE_NO_CONFIRMATION';

/* ngInject */
function WorkflowsEditorService(DeleteModalService, EventsService) {

  const service = this;

  service.handleDelete = handleDelete;

  function handleDelete(){
    DeleteModalService.handleDelete(deleteSelection, COOKIE_NAME);
  }

  function deleteSelection() {
    EventsService.publish(EventsService.EVENTS.WORKFLOW_DELETE_SELECTED_ELEMENT);
  }
}

exports.inject = function (module) {
  module.service('WorkflowsEditorService', WorkflowsEditorService);
};
