(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.ScenarioComparisionView = Backbone.View.extend({

    initialize: function() {
      this.status = new Backbone.Model({});
      this.collection = new App.Collection.IndicatorsCollection();

      this._addListeners();
    },

    _addListeners: function() {
      //Internal
      // this.status.on('change', this._fetchData);
      // TEMPORAL - we are not setting values right now.
      this._fetchData();

      //External
      App.Events.on('groupSelector:group', this._setStatus)
    },

    _setStatus: function(params) {
      this.status.set(params);
    },

    _fetchData: function() {
      var params = {
        mode: this.status.get('mode'),
        item: this.status.get('item')
      };

      this.collection.getDataForScenarios(params).done(function(){
        this.render();
      }.bind(this));
    },

    render: function() {
      this._drawGraph();
    },

    _parseData: function() {
      var data = this.collection.toJSON();
      var dataByScenario = _.groupBy(data, 'scenario');

      for (var i in dataByScenario) {
        var packages = _.groupBy(dataByScenario[i], 'package');
        dataByScenario[i] = packages;
      }

      return dataByScenario;
    },

    _drawGraph: function() {
      var data = this._parseData()['Global Solidarity']['Full'];

      this.stackChart = new App.View.Chart({
        el: this.el,
        options: {
          data: {
            json: {
              'Domestic': _.pluck(_.where(data, {source: 'Domestic'}), 'cost'),
              'Donor': _.pluck(_.where(data, {source: 'Donor'}), 'cost'),
              'Household': _.pluck(_.where(data, {source: 'Household'}), 'cost'),
              'Innovative': _.pluck(_.where(data, {source: 'Innovative'}), 'cost'),
              'Gap': _.pluck(_.where(data, {source: 'Gap'}), 'cost')
            },
            types: {
              'Domestic': 'area',
              'Donor': 'area', 
              'Household': 'area',
              'Innovative': 'area',
              'Gap': 'area'
                // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
            },
            groups: [['Domestic', 'Donor', 'Household', 'Innovative', 'Gap']],
          },
          axis: {
            x: {
              type: 'category',
              categories: _.uniq(_.pluck(data, 'year')),
              tick: {},
              padding: {
                left: 0,
                right: 0
              }
            },
            y: {
              label: {
                text: 'USD M$',
                position: 'outer-top'
              },
              tick: {}
            }
          }
        }
      });
    }

  });

})(this.App);
