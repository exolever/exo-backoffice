(function(Backbone) {
    var FolderModel = Backbone.Model.extend({
        urls: {
            detail: 'folder-detail',
            folders: 'folder-list',
            files: 'file-list',
            add: 'folder-add',
            path: 'folder-path'
        },
        initialize: function(options){
            this.project_id = options.project_id;
            var folders = new Backbone.Collection();
            this.set('folders', folders);
            var files = new Backbone.Collection();
            this.set('files', files);
        },
        get_id: function(){
            var id = this.id || "";
            if (id !== ""){
                id = id + "/";
            }
            return id;
        },
        get_url: function(name){
            var id = this.get_id();
            var url_name = this.urls[name];
            if (!url_name){
                url_name = 'folder-detail';
            }
            return urlservice.resolve(url_name, this.project_id, id);
        },
        url: function(){
            return this.get_url('detail');
        },
        url_folders: function(){
            return this.get_url('folders');
        },
        url_files: function(){
            return this.get_url('files');
        },
        get_folders: function(){
            var url = this.url_folders();
            $.get(url, _.bind(this.processFolder, this));
        },
        processFolder: function(data){
            var folders = this.get('folders');
            folders.reset(data);
        },
        get_files: function(){
            var url = this.url_files();
            $.get(url, _.bind(this.processFile, this));
        },
        processFile: function(data){
            var files = this.get('files');
            files.reset(data);
        },
        create_folder: function(folder_name){
            var url = this.get_url('add');
            $.post(url, {'name': folder_name}, _.bind(this.processCreateFolder, this));
        },
        processCreateFolder: function(model){
            var folders = this.get('folders');
            folders.add(model);
            toastr_manager.show_message('success', "Folder created successfully", '');
        },
        edit_folder: function(options){
            this.save([], {
                success: _.bind(this.processUpdateFolder, this)
            });
        },
        processUpdateFolder: function(model){
            toastr_manager.show_message('success', "Folder updated successfully", '');
        },
        get_folder_path: function(){
            var parent = this.get('folder_path');
            return parent + this.get('name') + "/";
        },
        api_folder_path: function(callback){
            $.ajax({
                url: this.get_url('path'),
                method: 'get',
                success: callback
            });
        }
    });

    var FileModel = Backbone.Model.extend({
        url: function(){
            if (this.id){
                return urlservice.resolve('file-edit',
                                      this.get('project_id'),
                                      this.get('folder_id'),
                                      this.id);
            }
            return urlservice.resolve('file-add',
                                      this.get('project_id'),
                                      this.get('folder_id'));
        },
        toString: function(){
            return this.get('name') + "." + this.get('extension');
        }
    });
    if (typeof window.Model === 'undefined') window.Model = {};
    window.Model.Folder = FolderModel;
    window.Model.File = FileModel;
})(Backbone);
