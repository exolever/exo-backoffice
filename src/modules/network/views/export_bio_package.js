(function(Backbone){
    var ExportBioPackageView = Backbone.BootstrapContentModalForm.extend({
        template: templates.modal_export_bio_packages,
        mixins: ['section_fields'],
        initialize: function(options){
            this.url = options.url;
        },
        getSelected: function(){
            var fields = [
                {'label': 'Name', 'field': 'name'},
                {'label': 'Shortline', 'field': 'shortline'},
                {'label': 'Location', 'field': 'location'},
                {'label': 'Extended bio', 'field': 'extended_bio'},
                {'label': 'Bio', 'field': 'bio'},
                {'label': 'Languages', 'field': 'languages'},

            ];
            return fields;
        },
        getFixed: function(){
            return ['name', 'shortline', 'location'];
        },
        render: function(){
            // Remove fields that they are selected from all fields.
            var availables = this.getAvailables();
            var selected = this.getSelected();
            availables = this.clean_selected(availables, selected);
            var html = this.template(this.getJson(availables, selected));
            this.$el.html(html);
            _.each(this.getFixed(), function(value, index){
                this.$el.find('#selected li[data-field="' + value  + '"]').addClass('fixed');
            }, this);
            this.initialize_sortable();
            this.$el.find('#id_consultant').select2(init_consultant_select2());
            return this.$el;
        },
        getJson: function(availables, selected){
            return {
                all_fields: _.sortBy(availables, 'label'),
                table_detail: selected
            };
        },
        save: function(){
            var values = this.$el.find('#id_consultant').val();
            var selected = _.map(this.$el.find('#selected li:not(.fixed)'), function(elem){
                return $(elem).data('field');
            });
            var url = "?consultants=" + values.join(",");
            url = url + "&fields=" + selected.join(",");
            window.location.href = this.url + url;
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.ExportBioPackage = ExportBioPackageView;
})(Backbone);
