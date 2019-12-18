(function(){
    var RelatedMixinActions = {
        initialize: function(options){
            this.fileChannel = Backbone.Radio.channel('files');
            this.fileChannel.on('edit-modal-file', _.bind(this.process_edit, this));
            this.fileChannel.on('update-file', _.bind(this.update_file, this));
            this.fileChannel.on('remove-file', _.bind(this.remove_file, this));
        },
        process_edit: function(file, folder){
            if (_.isUndefined(folder)){
                folder = this.model;
            }
            this.folder = folder;

            if(file.get('write')){
                var view = new window.View.FileModalView({
                    file: file.toJSON(),
                    folder: folder.toJSON()
                });
                var modal = new Backbone.BootstrapModal({
                    content: view,
                    title: "Edit file",
                    animate: true,
                    okText: 'Save'
                });
                modal.open();
            }
        },
        update_file: function(data){
            var model = new window.Model.File({
                project_id: this.project_id,
                folder_id: this.folder.id
            });
            model.set(data);
            model.save([], {
                success: _.bind(this.processFileUpdated, this)
            });
        },
        processFileUpdated: function(file){
            toastr_manager.show_message('success', "File updated successfully", '');
            if (file.get('parent').id !== this.folder.id){
                this.folder.get('files').remove(file.id);
            }else{
                var new_file = this.folder.get('files').findWhere({id: file.id});
                new_file.set(file.toJSON());
            }
        },
        remove_file: function(file){
            if (!_.isUndefined(this.model)){
                folder = this.model;
            }
            else{
                folder = new window.Model.Folder(file.get('parent'));
                folder.set('project_id', this.project_id);
                folder.get('files').add(file);
                if(!this.project_id) {
                    folder.set('project_id', file.get('project_id'));
                }
            }
            this.folder = folder;
            var model = new window.Model.File({
                project_id: this.project_id,
                folder_id: this.folder.id
            });
            model.set(file.toJSON());
            model.destroy({
                success: _.bind(this.processFileRemoved, this)
            });
        },
        processFileRemoved: function(file){
            this.folder.get('files').remove(file);
            toastr_manager.show_message('success', "File removed successfully", '');
        }
    };
    Cocktail.mixins.view_related_file = RelatedMixinActions;
})();
