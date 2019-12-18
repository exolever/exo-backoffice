(function(Backbone) {
    var FileItemView = Backbone.View.extend({
        className: 'file-box',
        events:{
            'click .edit-file': 'edit_file',
            'click .remove-file': 'remove_file'
        },
        template: templates.box_file,
        initialize: function(options){
            this.model = options.model;
            this.fileChannel = Backbone.Radio.channel('files');
            this.listenTo(this.model, 'change', this.render);
        },
        render: function(){
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            //animationHover(this.$el, 'pulse'); Disabled for now
            return this.$el;
        },
        edit_file: function(event){
            event.preventDefault();
            this.fileChannel.trigger('edit-modal-file', this.model);
        },
        remove_file: function(event){
            event.preventDefault();
            var view = new Backbone.BootstrapDeleteConfirmModal({
                msg: this.model.get('name') + "." + this.model.get('extension'),
                channel: this.fileChannel,
                msg_name: 'remove-file',
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
        close: function(){
            this.remove();
            this.unbind();
        }
    });

    var FileCollectionView = Backbone.View.extend({
        el: '#file-area-container',
        itemView: FileItemView,
        initialize: function(options){
            this.model = options.model;
            this.collection = options.collection;
            this.listenTo(this.collection, 'add', this.add_file);
            this.listenTo(this.collection, 'reset', this.reset_collection);
            this.listenTo(this.collection, 'remove', this.remove_file);
        },
        render: function(){
            this.$el.find(".file-box").not('#box-upload-file').remove();
            this.collection.each(function(model){
                this.add_file(model);
            }, this);
            return this.$el;
        },
        reset_collection: function(models){
            return this.render();
        },
        add_file: function(model){
            if (model.get('read')){
                var view = new this.itemView({model: model});
                view.render();
                model.view = view;
                this.$el.find('ul.folder-list').append(view.$el);
            }
        },
        remove_file: function(model){
            if (model.view){
                model.view.close();
                delete model.view;
            }
        },
        comparator : function(obj) {
            return obj.get('name');
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.FileCollectionView = FileCollectionView;
    window.View.FileItemView = FileItemView;
})(Backbone);
