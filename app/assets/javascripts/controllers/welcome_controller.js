(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Welcome = App.Controller.Page.extend({

    index: function() {
      console.log('Welcome#index');
    }

  });
})(this.App);
