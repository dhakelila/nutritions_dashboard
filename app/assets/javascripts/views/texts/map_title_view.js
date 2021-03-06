(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapTitleView = App.View.TitleView.extend({

    template_map: HandlebarsTemplates['map_title'],
    template_global: HandlebarsTemplates['map_title_global'],

    render: function() {
      var data = this.collection.toJSON()[0];

      if ( this.status.get('mode') === 'global' ) {
        this.$el.find('#map').removeClass().addClass('c-map-regions');

        this.$el.find('.text').html(this.template_global({
          description: data.description
        }));
      } else {
        //Set the map
        var region = data.region ? data.region : data.income_group;
        this.$el.find('#map').removeClass().addClass('c-map-regions ' + region );

        //Set the text
        this.$el.find('.text').html(this.template_map({
          description: data.description,
          class: data.region ? data.region : data.income_group
        }));
      }
    },

  });

})(this.App);
