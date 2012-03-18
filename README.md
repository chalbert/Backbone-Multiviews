# Backbone-Multiviews

### DEPENDENCIES: 

* Backbone-Mediator
* **Require JS** (for dynamic views) 
               * 
Life cycle for views, dynamic view loading & multi-page navigation.

## Defining Views

Views are define by adding a *view* hash on you view. 

    var view = Backbone.View.extend({
        views: {
            // My views
        }
    });
    
There are 2 kinds of views: 

1. Static views.
2. Dynamic views.

### Static Views

Static views are *parts* of your view, like a UI component, a widget. Spliting a view in several component can help
re-using your code.

Static views are added to the *views* hash as a *name* & *view* couple:

    var listView = Backbone.View.extend({...})

    var view = Backbone.View.extend({
        views: {
            list: listView
        }
    });    
    
Static views are automatically opened when the parent view is opened.
In some cases, you might want to open your static view later, manually. You can achieve that setting the 'autoOpen'
property to false (the view will still be instanciated, ready to be opened).

    var listView = Backbone.View.extend({
        autoOpen: false
        ...
    })

    var view = Backbone.View.extend({
        views: {
            list: listView // Won't be opened automatically opened
        }
    });   

### Dynamic Views

Dynamic views allow you to define some views to be loaded on demand. The javascript code of those views won't
be loaded until it is requested. It makes sense to use dynamic views for pages or your application, or for a 
rarely used but heavy component.

RequireJS is a dependency for dynamic views. It is recommanded that 
the view to be loaded dynamically follow the AMD format. 

    var view = Backbone.View.extend({
        '#pages': {
            myPage: 'path/to/my/view'  // Will look for path/to.my/view.js
        }
    });  

## View Life Cycle

Backbone-Multiviews introduce a more complete life cycle so to manage complex view interaction.

### On instantiation
The full life cyle is *normally* executed on instantiation:

    instantiation --> initialize() --> open() --> setup()
                                              --> show()
### On subsequent opening

    open() --> [if not presently opened] --> setup()
           --> show()
           
### On closing

    close() --> clean()
            --> hide()
  
### initialize()
  
Action to be executed once on instantiation.
 
* Instantiate child views
* Call **open()** if property 'autoOpen' is not explicitly 'false'.

### open()

Each time the view opens, ( e.g. by navigating to a page).

* Refresh model (if present).
* Call **setup()** if property 'open' is not 'true'.
* Call **show()**
* Open child views (unless their 'autoOpen' property is explicity 'false')

### setup()

Each time the view opens and it wasn't already opened.

* Set model listenners.
* Set dom event delegation.

### close()

* Close child views
* Call **clean()**
* Call **hide()**

### clean()

Reverse of 'setup'. 
            
* Unset view listenners.
* Uset model listenners.
* Undelegate dom events.

### show()

* show the dom element (*this.$el.stop().show()*)
           
### hide()

* hide the dom element (*this.$el.stop().hide()*)

## Overriding & extanding the view life cycle
    