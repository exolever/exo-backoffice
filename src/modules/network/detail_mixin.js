(function(){
    var ItemView = {
        template: templates.consultant_role_input,
        className: 'i-checks content-vertical-align',
        initialize: function(options){
            this.model = options.model;
            this.consultant = options.consultant;
        },
        render: function(){
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            this.$el.iCheck(icheck_options.get_defaults());
            this.$el.find('input').on('ifChanged', _.bind(this.mark_element, this));
            return this.$el;
        },
        get_value: function(){
            return this.$el.find('input').is(":checked");
        },
        mark_selected: function(model){
            this.$el.find('input').attr('checked', 'checked');
            this.$el.find('input').iCheck('update');
            this.consultant_model = model;
        },
        mark_element: function(event){
            var value = this.get_value();
            if (value){
                this.consultant_model = new this.relatedModel({
                    consultant: this.consultant
                });
                this.consultant_model.set(this.relatedField, this.model.id);
                this.consultant_model.save();
            } else{
                if (this.consultant_model){
                    this.consultant_model.destroy();
                }
            }
        }
    };

    var CollectionView = {
        initialize: function(options){
            this.consultant = this.$el.data('consultant');
            this.objects = new this.objectCollection();
            this.consultant_objects = new this.objectConsultantCollection(
                [], {consultant_id: this.consultant});
            this.listenTo(this.objects, 'sync', _.bind(this.sync_objects, this));
            this.listenTo(this.consultant_objects, 'sync', _.bind(this.sync_consultant_objects, this));
            this.listenTo(this.objects, 'add', _.bind(this.add_object, this));
            this.objects.fetch();
            this._views = {};
        },
        add_object: function(model){
            var view = new this.itemView({
                model: model,
                consultant: this.consultant});
            view.render();
            this._views[model.id] = view;
            this.$el.append(view.$el);
        },
        sync_objects: function(){
            this.consultant_objects.fetch();
        },
        sync_consultant_objects: function(){
            this.consultant_objects.each(function(model){
                var object_id = model.get(this.relatedField);
                var view = this._views[object_id];
                view.mark_selected(model);
            }, this);
        },
        close: function(){
            this.stopListening();
            this.remove();
            this.unbind();
        }
    };

    Cocktail.mixins.network_detail_itemview = ItemView;
    Cocktail.mixins.network_detail_collectionview = CollectionView;
})();
