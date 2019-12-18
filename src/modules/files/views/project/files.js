/*jshint multistr: true */
(function(Backbone) {
    var ProjectLatestFileItemView = Backbone.View.extend({
        template: templates.dashboard_file,
        tagName: 'li',
        className: 'border-bottom',
        events:{
            'click .dev__edit_file': 'edit_file',
            'click .dev__remove_file': 'remove_file',
            'click .dev__show_file': 'show_file'
        },
        initialize: function(options){
            this.model = options.model;
            this.project_id = options.project_id;
            this.fileChannel = Backbone.Radio.channel('files');
            this.listenTo(this.model, 'change', this.render);
            this.fileChannel.on('remove-file', _.bind(this.removeFileProcess, this));
        },
        render: function(){
            var data = this.model.toJSON();
            var modified = moment(data.modified);
            data.modified_str = modified.format("MMMM Do, YYYY");
            data.show_project = _.isUndefined(this.project_id) && data.show_project;
            data.has_to_show_team = data.show_team && data.team_name;
            var html = this.template(data);
            this.$el.html(html);
            return this.$el;
        },
        edit_file: function(event){
            event.preventDefault();
            var folder = new window.Model.Folder(this.model.get('parent'));
            folder.set('project_id', this.model.get('project_id'));
            folder.get('files').add(this.model);
            this.fileChannel.trigger('edit-modal-file', this.model, folder);
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
        removeFileProcess: function(model){
            if (model.id === this.model.id){
                this.model.collection.remove(model);
            }
        },
        show_file: function(event){
            event.preventDefault();
            var view = new FileModalView({
                model: this.model
            });
            var modal = new Backbone.BootstrapModal({
                content: view,
                title: "File details",
                animate: true,
                okText: 'Close',
                allowCancel: false
            });
            modal.open();
        },
        close: function(){
            this.remove();
            this.unbind();
        }
    });

    var ProjectLatestFilesCollectionView = Backbone.View.extend({
        el: '#dev__recent_files',
        mixins: ['view_related_file'],
        itemClass: ProjectLatestFileItemView,
        initialize: function(options){
            this.project_id = options.project_id;
            this.collection = new window.Collection.ProjectLatestFile([], {project_id: this.project_id});
            this.listenTo(this.collection, 'add', this.add_one);
            this.listenTo(this.collection, 'remove', this.remove_one);
            this._views = [];
        },
        render: function(){
            this.collection.fetch({success: _.bind(this.clearSpinner, this)});
            return this.$el;
        },
        clearSpinner: function(){
            this.$el.find('.sk-spinner').remove();
            if (this.collection.length === 0){
                var html = "<div class=\"text-center \
                    full-width pull-left m-b-md m-t-md\"> \
                    <i class=\"fa fa-files-o f-24\" aria-hidden=\"true\" \
                    ></i><br>You don't have files yet.</div>";
                var html2 = _.template(html)();
                this.$el.append("<li>" + html2 + "</li>");
            }
        },
        add_one: function(model, collection, options){
            var view = new this.itemClass({
                model: model,
                project_id: this.project_id});
            var $el = view.render();
            if (options.first){
                this.$el.prepend($el);
            }
            else{
                this.$el.append($el);
            }
            this._views[model.cid] = view;
        },
        remove_one: function(model){
            var view = this._views[model.cid];
            view.close();
            delete this._views[model.cid];
        }
    });

    var FileModalView = Backbone.BootstrapContentModalForm.extend({
        template: templates.dashboard_file_view,
        initialize: function(options){
            this.model = options.model;
        },
        render: function(){
            var data = this.model.toJSON();
            var html = this.template(data);
            this.$el.html(html);
            return this.$el;
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.ProjectLatestFilesCollection = ProjectLatestFilesCollectionView;

})(Backbone);
