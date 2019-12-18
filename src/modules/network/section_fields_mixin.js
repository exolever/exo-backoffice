(function(){

    var SectionFieldSelect = {
        initialize: function(options){
            this.model = options.model;
        },
        initialize_sortable: function(){
            this.$el.find('#availables, #selected').sortable({
                connectWith: "ul",
                items: 'li:not(.fixed)',
                tolerance: 'pointer',
                forcePlaceholderSize: true,
                opacity: 0.8
            }).disableSelection();
        },
        clean_selected: function(availables, selected){
            _.each(selected, function(elem){
                var e2 = _.findWhere(availables, {field: elem.field});
                availables = _.without(availables, e2);
            }, this);
            return availables;
        },
        getAvailables: function(){
            return this.model.get('all_fields');
        }
    };

    Cocktail.mixins.section_fields = SectionFieldSelect;
})();
