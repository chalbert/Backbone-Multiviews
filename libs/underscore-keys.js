
define(['libs/vendor/underscore/underscore'], function(_){

  var keyEvents = ['keypress', 'keydown', 'keyup'];
  var keyMap = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 28,
    capslock: 20,
    escape: 27,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    'delete': 46
  };

  //| f1 to f12
  for (var n = 1; n <= 12; n++) keyMap['f' + n] = 111 + n;

  return _.mixin({

    //| # Return true if the event is keypress, keydown or keyup.
    isKeyEvent: function(event){
      if (keyEvents.indexOf(event) !== -1) return true;
    },

    //| # Return true if the key argument correspond to the name of a key.
    isKey: function(key){
      if (key.length === 1) return true;
      if (_.keys(keyMap).indexOf(key) !== -1) return true;
    },

    //| # Return the keycode from the name of the key.
    getKeycode: function(key){
      if (key.length === 1) return key.charCodeAt(0);
      return keyMap[key];
    },

    //| # Return the name of the key from the keycode.
    getKey: function(code){
      //| If special char
      for (var key in keyMap) {
        if (keyMap[key] === code) return key;
      }
      //| If no special char
      return String.fromCharCode(key);
    }


  });

});