# Backbone-Multiviews

Life cycle for views, dynamic view loading & multi-page navigation.

## View Life Cycle

Backbone-Multiviews introduce a more complete life cycle.
  
### initialize()
  
Action to be executed once on instantiation.
 
* Instantiate child views
* Call open() if property 'autoOpen' is not explicitly 'false'.

### open()

Each time you open a view, ( e.g. by navigating to a page).

* Refresh model (if present).
* Call setup() if property 'open' is not 'true'.
* Call **show()**
* Open child views (unless their 'autoOpen' property is explicity 'false')

### setup()

To execute each time the view open and it wasn't already opened.

* Set model listenners.
* Set dom event delegation.

### close()

### clean()

Reverse of 'setup'. 
            
* Unset view listenners.
* Uset model listenners.
* Undelegate dom events.

### show()
           
### hide()

        
## Child views

### Static Views

### Dynamic Views
    