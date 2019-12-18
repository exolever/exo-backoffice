(function($, _, Backbone) {

    if (typeof window.View == 'undefined') window.View = {};

    window.View.OrganizationCreateView = Backbone.BootstrapContentModalForm.extend({

        template: templates.organization_create_form,
        initialize: function(options){
            var _self = this;
            Backbone.BootstrapContentModalForm.prototype.initialize.apply(this, [options]);

            this.channel = options.channel;

            _self.bind('shown', _self.renderModalDone);
        },
        render: function(){
            this.$el.html(this.template());
            return this.$el;
        },
        renderModalDone: function(modal){
            // Prepare Select2
            this.$el.find('select#id_country').select2(init_country_select2());
            this.$el.find('select#id_industry').select2(init_industry_select2());
            this.$el.find('select#id_size').select2(init_industry_size_select2());
        },
        commit: function(){
            var data = {};
            data.name = this.$el.find('input#id_name').val();
            data.country = this.$el.find('select#id_country option:selected').val();
            data.industry = this.$el.find('select#id_industry option:selected').val();
            data.size = this.$el.find('select#id_size option:selected').val();
            data.market_value = this.$el.find('input#id_market_value').val();
            data.annual_revenue = this.$el.find('input#id_annual_revenue').val();

            return data;
        },
        save: function(){
            this.channel.trigger('submit-data', this.commit());
            return true;
        }
    });

})(jQuery, _, Backbone);
