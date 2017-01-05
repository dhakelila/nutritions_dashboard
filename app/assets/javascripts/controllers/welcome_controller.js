(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Welcome = App.Controller.Page.extend({

    index: function() {
      this.map = new App.View.MapHomeView({
        el: '#homeMapView'
      });

      this.progress = new App.View.FundingProgressView({
        el: '#homeMapView'
      });
    }

  });
})(this.App);
