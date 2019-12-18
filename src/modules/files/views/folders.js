(function(Backbone) {
    var FolderItemView = Backbone.View.extend({
        tagName: 'li',
        className: "col-xs-12",
        template: templates.folder_item,
        events: {
            'click a.link-folder': 'select_folder',
            'click .edit-folder': 'modal_edit_folder',
            'click .remove-folder': 'modal_remove_folder'
        },
        initialize: function(options){
            this.model = options.model;
            this.listenTo(this.model, 'change:name', this.change_name);
            this.fileChannel = Backbone.Radio.channel('files');
        },
        render: function(){
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            return this.$el;
        },
        close: function(){
            this.remove();
            this.unbind();
        },
        select_folder: function(event){
            event.preventDefault();
            if ($(event.currentTarget).data('toggle') === undefined){
                var channel = Backbone.Radio.channel('files');
                channel.trigger('change', this.model);
            }
        },
        modal_edit_folder: function(event){
            event.preventDefault();
            event.stopPropagation();
            if(this.model.get('write')){
                var view = new window.View.FolderModalView({model: this.model});
                var modal = new Backbone.BootstrapModal({
                    content: view,
                    title: "Edit folder",
                    animate: true,
                    okText: 'Save'
                });
                modal.open();
            }
        },
        change_name: function(model){
            this.$el.find("#name-folder").html(model.get('name'));
            this.$el.find("#name-folder").attr("title", model.get('name'));
        },
        modal_remove_folder: function(event){
            event.preventDefault();
            var view = new Backbone.BootstrapDeleteConfirmModal({
                msg: this.model.get('name'),
                channel: this.fileChannel,
                msg_name: 'remove-folder',
                model: this.model
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                title: "Confirm delete",
                animate: true,
                okText: 'Delete'
            });
            modal.open();
        },
    });

    var FolderCollectionView = Backbone.View.extend({
        tagName: 'ul',
        className: 'folder-list m-t',
        itemView: FolderItemView,
        initialize: function(options){
            this.model = options.model;
            this.collection = options.collection;
            this.listenTo(this.collection, 'add', this.add_folder);
            this.listenTo(this.collection, 'remove', this.remove_folder);
            this.listenTo(this.collection, 'reset', this.clear_folder);
            this._views = {};
        },
        render: function(){
            this.$el.html("");
            this.collection.each(function(model){
                this.add_folder(model);
            }, this);
            return this.$el;
        },
        add_folder: function(model){
            if (model.get('read')){
                var view = new this.itemView({model: model});
                view.render();
                model.view = view;
                this.$el.append(view.$el);
                this._views[model.id] = model.view;
            }
        },
        remove_folder: function(model){
            if (model.view){
                model.view.close();
                delete this._views[model.view];
            }
        },
        clear_folder: function(collection){
            _.each(this._views, function(view, key){
                this.remove_folder(view.model);
            }, this);
            collection.each(function(model){
                this.add_folder(model);
            }, this);
        },
        comparator : function(obj) {
            return obj.get('order');
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.FolderCollectionView = FolderCollectionView;
    window.View.FolderItemView = FolderItemView;
})(Backbone);
