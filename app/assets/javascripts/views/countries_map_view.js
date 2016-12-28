(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapCountriesView = App.View.D3Map.extend({

    defaults: {
      buckets: {
        active: '#009da7',
        dormant: '#93c9d8',
        defaultFill: 'rgba(216, 216, 216,0.5)'
      },
    },

    events: {
      'change .js--country-selector' : '_onChangeSetCountry'
    },

    initialize: function() {
      if (!this.el) {
        return;
      }
      this.status = new Backbone.Model();
      this.collection = new App.Collection.CountriesCollection();

      this._drawMap();
      this._setListeners();
      this._fetchData();
      App.View.MapCountriesView.__super__.initialize.apply(this);
    },

    setParams: function(params) {
      this.status.set(params);
    },

    _setListeners: function() {
      $(window).on('resize', this._resizeMap.bind(this));
      this._onClickSetCountry();
    },

    _cached: function() {
      this.countryData = this._parseData(this.collection.toJSON());
    },

    _onChangeSetCountry: function(iso) {
      var country = iso.length === 3 ? iso : this.$el.find('.js--country-selector').val();
      var data = this.countryData;
      var keys = Object.keys(data)
      if ( country.length > 1 ) {
        _.each(keys, function(iso){
          if ( country === iso ) {
            data[iso].fillKey = 'active'
          } else {
            data[iso].fillKey = 'dormant'
          }
        })
      } else {
        _.each(keys, function(iso){
          data[iso].fillKey = 'active'
        })
      }
      this._updateMap(data);
    },

    _fetchData: function() {
      this.collection.getCountries().done(function(){
        this._cached();
        this._updateMap(this.countryData);
      }.bind(this));
    },

    _updateMap: function(data) {
      this.map.updateChoropleth(data, {reset: true});
    },

    _parseData: function(data) {
      var parsedData = {};
      _.each(data, function(country) {
        parsedData[country.iso_code] = {
          fillKey: 'active'
        }
      }.bind(this));
      return parsedData;
    },

    _onClickSetCountry: function(datamap) {
      this.map.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
        if ( this.countryData[geography.id] ) {
          this._onChangeSetCountry(geography.id);
          App.Events.trigger('country:selected', {
            iso: geography.id
          });
          // App.View.CountrySelectorView.status.set({ 'iso': geography.id });
          this._setSelectedCountry(geography.id);
        }
      }.bind(this));
    },

    _setSelectedCountry: function(iso) {
      var $selector = this.$el.find('.js--country-selector');
      var selectorValue = $selector.val()
      var $selectorOption = $selector.find('option[value="'+ iso +'"]');

      if ($selectorOption) {
        if (iso != selectorValue) {
          $selector.find('option').attr('selected', false);
          $selectorOption.attr('selected', true);
          $selector.trigger('change');
        }
      } else {
        $selector.find('option')[0].attr('selected', true);
        $selector.trigger('change');
      }
    },

  });

})(this.App);
