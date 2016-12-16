(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapTitleView = App.View.TitleView.extend({

    template_map: HandlebarsTemplates['map_title'],
    template_global: HandlebarsTemplates['map_title_global'],

    render: function() {
      debugger
      var data = this.collection.toJSON()[0];

      if ( this.status.get('mode') === 'global' ) {
        this.$el.html(this.template_global({
          description: data.description
        }));
      } else {
        this.$el.html(this.template_map({
          description: data.description
        }));
      }
    }
  });

})(this.App);
