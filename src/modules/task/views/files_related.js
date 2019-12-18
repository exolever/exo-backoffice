(function(Backbone) {
    var FileTaskView = Backbone.View.extend({
        el: '#resources',
        events: {
            'click #select-file': 'select_file'
        },
        initialize: function(options){
            this.model = options.model;
            this.channel = Backbone.Radio.channel('files-related');
            this.project_id = this.model.get('project');
            this.channel.on('select-file', _.bind(this.processFileAdded, this));
            this.channel.on('create-file', _.bind(this.create_file, this));
        },
        render: function(){
            var collection = this.model.get('files');
            this.collection_view = new FileCollectionTask({collection: collection});
            this.collection_view.render();
            this._ui = {};
            this._ui.fileupload = this.$el.find("#fileupload");
            this.init_fileupload();
            return this.$el;
        },
        select_file: function(event){
            var view = new window.View.SelectFile({
                project_id: this.model.get('project'),
                channel_name: 'files-related'
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                title: "Select files",
                animate: true,
                okText: 'Save'
            });
            modal.open();
        },
        processFileAdded: function(file){
            var collection = this.model.get('files');
            collection.add(file);
        },
        init_fileupload: function(){
            var url = urlservice.resolve('file-upload', this.project_id);
            this._ui.fileupload.fileupload({
                url: url,
                crossDomain: false,
                dataType: 'json',
                done: _.bind(this.process_upload, this)
            }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
        },
        process_upload: function(e, data){
            var file = data.result;
            var view = new window.View.FileModalView({
                file: file,
                folder: {project_id: this.project_id},
                channelName: 'files-related'
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                title: "Upload file",
                animate: true,
                okText: 'Save'
            });
            modal.open();
        },
        create_file: function(data){
            var model = new window.Model.File({
                project_id: this.project_id,
                folder_id: data.new_folder
            });
            model.set(data);
            model.save([], {
                success: _.bind(this.processFileAdded, this)
            });
        }
    });

    var FileTaskItem = Backbone.View.extend({
        tagName: 'tr',
        template: templates.task_resource_item,
        events: {
            'click .delete': 'delete_item'
        },
        initialize: function(options){
            this.model = options.model;
        },
        render: function(){
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            return this.$el;
        },
        delete_item: function(event){
            this.model.collection.remove(this.model);
        },
        close: function(event){
            this.remove();
            this.unbind();
        }
    });
    var FileCollectionTask = Backbone.View.extend({
        el: '#resource-list',
        initialize: function(options){
            this.collection = options.collection;
            this.listenTo(this.collection, 'add', this.add_item);
            this.listenTo(this.collection, 'remove', this.remove_item);
            this._views = {};
        },
        render: function(){
            this.collection.each(function(model){
                this.add_item(model);
            }, this);
        },
        add_item: function(model){
            model.collection = this.collection;
            var view = new FileTaskItem({model: model});
            view.render();
            this._views[model.id] = view;
            this.$el.append(view.$el);
        },
        remove_item: function(model){
            var view = this._views[model.id];
            view.close();
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.FileRelated = FileTaskView;
})(Backbone);
