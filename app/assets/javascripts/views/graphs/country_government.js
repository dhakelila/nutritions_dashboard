(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.CountryGovernmentView = App.View.Chart.extend({

    templates: {
      domestic: HandlebarsTemplates['current_funding_domestic'],
      foreign: HandlebarsTemplates['current_funding_domestic_null'],
      no_data_placeholder: HandlebarsTemplates['no_data_placeholder'],
      foreign_footnote: HandlebarsTemplates['current_funding_domestic_footnote']
    },

    initialize: function() {
      this.status = new Backbone.Model({});
      this.model = new App.Model.CountriesModel();

      App.View.CountryGovernmentView.__super__.initialize.apply(this);
    },

    _addListeners: function() {
      //Internal
      this.status.on('change:iso', this._fetchData.bind(this));

      //External
      App.Events.on('country:selected', this._setStatus.bind(this));
    },

    _fetchData: function() {
      this.ajaxStart('#currentCountryGovernment');
      var params = {
        iso: this.status.get('iso')
      };

      this.model.getDataForCountryGovernment(params).done(function(){
        this.render();
        this.ajaxComplete('#currentCountryGovernment');
      }.bind(this));
    },

    _formatNum: function(num) {
      if (num > 1000 || num < -1000) {
        var num = '$' + d3.format('.3s')(num);
        num = num.replace("G", "B");
        return num;
      } else {
        return d3.round(num, 2);
      }
    },

    _drawText: function(data) {
      $('.placeholder').css('display', 'block');
      if ( data[0].total_spend === null ) {
        this.$el.find('#governmentFundingText').html(this.templates.foreign({
          donor: this._formatNum(data[0].cost),
          country: data[0].country
        }));
        this.$el.find('#governmentFundingFootnote').html('<p></p>');
      } else {
        this.$el.find('#governmentFundingText').html(this.templates.domestic({
          donor: this._formatNum(data[0].cost),
          gov: this._formatNum(data[0].total_spend),
          total: this._formatNum(data[0].cost + data[0].total_spend),
          country: data[0].country
        }));
        this.$el.find('#governmentFundingFootnote').html(this.templates.foreign_footnote());
      }
    },

    _drawGraph: function() {
      var data = this.model.toJSON();
      this._drawText(data);
      if ( data[0].total_spend !== null ) {
        this.stackChart = new App.View.C3Chart({
          el: this.el,
          options: {
            padding: {
              top: 10
            },
            color: this.colors.funding,
            data: {
              columns: [
                ['Domestic sources', data[0].total_spend, null, data[0].total_spend],
                ['Donor', null, data[0].cost, data[0].cost]
              ],
              type: 'bar',
              groups: [
                ['Domestic sources', 'Donor']
              ],
              colors: this.colors.funding,
              order: false
            },
            bar: {
                width: {
                    ratio: 0.4 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            },
            interaction: {
              enabled: true
            },
            axis: {
              x: {
                type: 'category',
                categories: ['Domestic sources', 'Donors', 'Total'],
                tick: {},
                padding: {
                  left: 0,
                  right: 0
                },
                height: 40,
              },
              y: {
                tick: {
                  format: function (v, id, i, j) {
                    if (v > 1000 || v < -1000) {
                      var num = '$' + d3.format('.3s')(v);
                      num = num.replace("G", "B");
                      return num;
                    } else {
                      return d3.round(v, 2);
                    }
                  },
                  count: 6
                }
              }
            },
            grid: {
              y: {
                show: true
              }
            },
            legend: {
              hide: true
            }
          }
        });
      } else {
        this.$el.find('.c-chart').html(this.templates.no_data_placeholder());
      }
  }

  });

})(this.App);
