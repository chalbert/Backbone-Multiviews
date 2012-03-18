# Backbone-Multiviews

Life cycle for views, dynamic view loading & multi-page navigation.

## View Life Cycle

Backbone-Multiviews introduce a more complete life cycle to manage complex Backbone view interaction.
    
* **initialize()** Action to be executed once
  **Action taken:**
    * Call open() if property 'autoOpen' is not explicitly 'false'.

* **open()** Each time you open a view, ( by navigating to a page, by user input, etc). If already opened,
  it will be consired as a 'refresh' and the lifecyle will stop here.
  **Action taken:**
  * Refresh model (if present).
  * Call setup() if property 'open' is not 'true'.

* **setup()** To execute each time the view open and it wasn't already opened.
  **Action taken:**
    *Set bindings.
    *Set listenners.
    *Call show()
        

    