(function(Backbone) {
    var FileItemView = Backbone.View.extend({
        className: 'clearfix m-b border-bottom p-b-5 simple-row',
        template: templates.related_file_item,
        events:{
            'click .remove-file': 'remove_file'
        },
        initialize: function(options){
            this.model = options.model;
            this.fileChannel = Backbone.Radio.channel('files');
        },
        render: function(){
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            return this.$el;
        },
        remove_file: function(event){
            event.preventDefault();
            var view = new Backbone.BootstrapDeleteConfirmModal({
                msg: this.model.toString(),
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
            toastr_manager.show_message('success', "File removed successfully", '');
            this.remove();
            this.unbind();
        }
    });

    var FileCollectionView = Backbone.View.extend({
        el: '#file-list',
        initialize: function(options){
            this.project = this.$el.data('project');
            this.object_id = this.$el.data('object');
            this.permissions = eval(this.$el.data('permissions'));
            this.model_class = options.model_class;
            this.model = new this.model_class({
                project_id: this.project,
                id: this.object_id
            });
            this.fileChannel = Backbone.Radio.channel('files');
            this.fileChannel.reset();
            this.fileChannel.on('remove-file', _.bind(this.remove_file, this));
        },
        render: function(){
            this._views = {};
            this.model.get_files();
            this.model.get('files').each(function(model){
                this.add_file(model);
            }, this);
            this.listenTo(this.model.get('files'), 'add', this.add_file);
            this.listenTo(this.model.get('files'), 'remove', this.processTaskFileRemoved);
        },
        add_file: function(model){
            model.set('project_id', this.project);
            model.set('folder_id', model.get('parent'));
            model.set('permissions', this.permissions);
            var view = new FileItemView({model: model});
            view.render();
            this.$el.append(view.$el);
            this._views[model.id] = view;
        },
        remove_file: function(file){
            this.model.remove_file(file);
        },
        processTaskFileRemoved: function(file){
            var view = this._views[file.id];
            view.close();
        },
        close: function(){
            this.stopListening();
            this.remove();
            this.unbind();
        }
    });

    var FileRelatedUpload = Backbone.View.extend({
        el: '#fileupload',
        initialize: function(options){
            this.model = options.model;
            this.project_id = this.model.get('project_id');
            this.channel = Backbone.Radio.channel('files-related');
            this.channel.reset();
            this.channel.on('create-file', _.bind(this.create_file, this));
            this.init_events();
        },
        init_events: function(){
            var url = urlservice.resolve('file-upload', this.model.get('project_id'));
            this.$el.fileupload({
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
        },
        processFileAdded: function(file){
            var data = {};
            data.file_id = file.id;
            this.listenTo(this.model.get('files'), 'add', this.processTaskFileAdded);
            this.model.add_file(data, file);
        },
        processTaskFileAdded: function(file){
            this.stopListening(this.model.get('files'));
            toastr_manager.show_message("success", 'File addedd successfully');
        },
        close: function(){
            this.stopListening();
            this.remove();
            this.unbind();
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.FileRelatedCollectionView = FileCollectionView;
    window.View.FileRelatedItemView = FileItemView;
    window.View.FileRelatedUpload = FileRelatedUpload;
})(Backbone);
