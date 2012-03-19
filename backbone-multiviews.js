define([
  'underscore',
  'backbone',
  'backbone-mediator'
], function(_, Backbone) {

  var router = new Backbone.Router();

  function registerViews(selector, views){

    var container = (selector[0] === '$')
        ? this.$get(selector.replace('$', ''))
        : (selector === '') ? this.$el : this.$el.find(selector);

    _.each(views, function(url, name){

      //| > If the value is not a string, it must already an object which mean the
      //| > view is already loaded
      if (!_.isString(url)) return;

      //| > Subscribe to the first opening, when the view is not loaded
      Backbone.Mediator.subscribeOnce('open:' + name, function(){
        var args = _.toArray(arguments);
        Backbone.Mediator.subscribeOnce('loaded:' + name, function(){
          args.unshift('open:' + name);
          Backbone.Mediator.publish.apply(null, args);
        }, this);
        loadView.call(this, container, name, url);
      }, this);

    }, this);

  }

  function loadView(container, name, url){

    Backbone.Mediator.publish('loading', name);

    require([url], $.proxy(function(view) {

      var view = new view();
      view._parent = this;
      container.append(view.render().$el);

      Backbone.Mediator.subscribe('open:' + name, function(attributes){

        container.addClass('view-' + name);
        var args = _.compact(_.toArray(arguments));
        //| > If the view is already opened, and attributes haven't changed, ignore
        if (view.opened && _.isEqual(view.attributes, _.extend({}, view.attributes, attributes))) {
          return
        };

        view.open.apply(view, args);

      }, this);

      Backbone.Mediator.subscribe('close:' + name, function(){

        container.removeClass('view-' + name);

        view.close.apply(view, arguments);
      });

      Backbone.Mediator.publish('loaded:' + name);

    }, this))
  }


  function registerPages(pages){

    _.each(pages, function(route, page){

      var slugs;

      slugs = getSlugs(route);

      router.route(route, page, function(){
        var args = _.toArray(arguments),
            attrs = {};
        _.each(args, function(arg, i){
          if (slugs[i]) attrs[slugs[i]] = arg;
        });
        Backbone.Mediator.publish.apply(this, ['open:' + page, attrs]);
      });

      Backbone.Mediator.subscribe('go:' + page, function() {
        var args = _.toArray(arguments),
            newRoute = route.split('*')[0];

        newRoute = replaceRouteArgs(newRoute, args);

        router.navigate(newRoute, {trigger: true});

      }, this);

      Backbone.Mediator.subscribe('open:' + page, function(){
        if (this.activePage && (page === this.activePage)) return;
        if (this.activePage) Backbone.Mediator.publish('close:' + this.activePage);
        this.activePage = page;

      }, this);

      if (route.indexOf('*') !== -1) {
        Backbone.Mediator.subscribe('loaded:' + page, function(){
          // To open submodule, we reload url, which will map new routes
          if (Backbone.history.options) Backbone.history.loadUrl();
        }, this);
      }

    }, this);


  }

  function getSlugs(route){
    var matches = route.match(/:\w+/g);
    matches = _.map(matches, function(match){
      return match.replace(':', '');
    });
    return matches;
  }

  function replaceRouteArgs(route, args){
    var matches = route.match(/:\w+/g);

    _.forEach(matches, function(match){
      route = route.replace(match, args.shift());
    });
    return route;
  }


  Backbone.View = Backbone.View.extend({
    initialize: function(options){
      options || (options = {});

      this.setHtml(options.html);
      this.$el.addClass('view');
      this.setViews();

      registerPages.call(this, this.pages);
      if (this._super) this._super('initialize', arguments);
    },


    setup: function(){
      // | > If we destroy the model, the view need to go
      if (this.model) {
        this.model.on('destroy', function(){
          this.remove();
        }, this);
      }

      //| > Let's redelegate the events.
      this.delegateEvents(this.events);

    },

    open: function(attributes){
      this.attributes = _.extend((this.attributes || {}), attributes);

      //| > This need to be setup only if not already opened
      if (!this.opened) this.setup();

      if (this.model) {
        this.model.clear();
        if (this.model.configure) this.model.configure(this.attributes || {});
        this.model.fetch();
      }

      this.show();
      this.opened = true;

      this.openViews();

    },

    openViews: function(){
      _.each(this.views, function(view, name) {
        if (!(view instanceof Backbone.View)) return;

        if (view.autoOpen !== false) {
          view.open(this.attributes)
        }
      }, this);
    },

    //| # Set the html if define
    setHtml: function(html){
      html = html || this.html;
      if (html) {
        this.$el.html(html);
      }
      if (this.refreshElements) this.refreshElements();
    },

    //| # Convention base loading of child views. Meant to load 'parts' of the main view.
    setViews: function(){
      _.each(this.views, function(view, name){
        if (_.isFunction(view)) {
          var el = view.prototype.el;
          // Lookup first inside the view, then as a global element
          this.views[name] = new view({el: (this.$el.find(el)[0] || $(el)[0])});
          // Keep a reference to the parent view
          this.views[name]._parent = this;
        } else {
          registerViews.call(this, name, view);
        }
      }, this);
    },

    show: function(){
      this.$el.stop().show();
    },

    hide: function(){
      this.$el.stop().hide();
    },

    //| # Base closing method
    close: function(){
      //| > Undelegate shorcuts
      this.clean();

      _.each(this.views, function(view, viewName){
        //| > If not a view, than is a hash of dynamic views
        if (!(view instanceof Backbone.View)) {
          _.each(view, function(dynamicView, dynamicViewName){
            //| > If not a view, then not yet load - so don't try to close
            Backbone.Mediator.publish('close:' + dynamicViewName);
          }, this);
        } else {
          view.close();
        }
      }, this);

      this.opened = false;
      this.hide();
    },

    clean: function(){
      this.off();
      if (this.model) {
        this.model.off();
        this.model.clear();
      }

      this.undelegateEvents();
    }

  });

  return Backbone;

});