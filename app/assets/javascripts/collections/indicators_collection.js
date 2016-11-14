(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Collection.IndicatorsCollection = App.Collection.CartoCollection.extend({

    scenarioQueryTPL: HandlebarsTemplates['queries/scenario_comparison'],
    costPackagesQueryTPL: HandlebarsTemplates['queries/cost_packages'],
    table: 'nutritions',

    getDataForCostPackages: function(mode, group) {
      var query = this.costPackagesQueryTPL({
        'table': this.table,
        'mode': mode || 'region',
        'group': group || 'sub-saharan-africa'
      });

      var url = this._urlForQuery(query);

      return this.fetch({url: url});
    },

    getDataForScenarios: function(mode, group) {
      var query = this.scenarioQueryTPL({
        'table': this.table,
        'mode': mode || 'region',
        'group': group || 'sub-saharan-africa'
      });

      var url = this._urlForQuery(query);

      return this.fetch({url: url});
    }

  });

})(this.App);
