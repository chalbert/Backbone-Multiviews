define([
  'backbone',
  'backbone-shortcuts'
], function(Backbone){

  describe("When a new view is created", function () {

    it("should registered the shortcuts", function () {
      Backbone.Mediator.publish = sinon.stub();
      var view = new Backbone.View();
      view.setup();
      expect(Backbone.Mediator.publish).toHaveBeenCalledWith('shortcuts:add', view.shortcuts);
    });

  });

});