(function(Backbone){
    var UserSectionPreferenceView = Backbone.BootstrapContentModalForm.extend({
        template: templates.modal_user_section_preferences,
        mixins: ['section_fields'],
        initialize: function(options){
            this.channel = Backbone.Radio.channel(options.channelName);
        },
        getJson: function(availables, selected){
            return {
                all_fields: _.sortBy(availables, 'label'),
                table_detail: selected
            };
        },
        getSelected: function(){
            return this.model.get('table_detail');
        },
        render: function(){
            // Remove fields that they are selected from all fields.
            var availables = this.getAvailables();
            var selected = this.getSelected();
            availables = this.clean_selected(availables, selected);
            var html = this.template(this.getJson(availables, selected));
            this.$el.html(html);
            this.initialize_sortable();
            return this.$el;
        },
        save: function(){
            var selected = _.map(this.$el.find('#selected li'), function(elem){
                return $(elem).data('field');
            });
            if (selected.indexOf("name") < 0){
                selected.push('name');
            }
            this.channel.trigger('save-fields', selected, this.model);
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.UserSectionPreference = UserSectionPreferenceView;
})(Backbone);
