# Backbone-Multiviews

Life cycle for views, dynamic view loading & multi-page navigation.

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
        
## Child views

### Static Views

### Dynamic Views
    