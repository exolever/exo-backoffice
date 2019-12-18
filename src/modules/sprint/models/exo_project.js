(function(Backbone) {
    var ExOProjectFilesCollection = Backbone.Collection.extend({
        model: window.Model.File,
        initialize: function(models, options){
            this.project_id = options.project_id;
            this.exo_project_id = options.exo_project_id;
        },
        url: function(){
            return urlservice.resolve('exo-project-files-related', this.project_id, this.exo_project_id);
        }
    });

    var ExOProjectModel = Backbone.Model.extend({
        mixins: ['related_file'],
        toString: function(){
            return this.get('name');
        },
        url_add: function(){
            return urlservice.resolve(
                'exo-project-files-related',
                this.get('project_id'), this.get('id'));
        },
        url_remove: function(file){
            return urlservice.resolve(
                'exo-project-remove-file',
                this.get('project_id'),
                this.get('id'),
                file.id);
        },
        get_files: function(){
            var collection = new ExOProjectFilesCollection([], {
                project_id: this.get('project_id'),
                exo_project_id: this.get('id')
            });
            this.set('files', collection);
            collection.fetch();
        }
    });

    var EXOProjectCollection = Backbone.Collection.extend({
        model: ExOProjectModel,
        initialize: function(models, options){
            this.project_id = options.project_id;
        },
        url: function(){
            return urlservice.resolve('sprint-exo-project-list', this.project_id);
        }
    });
    if (typeof window.Model === 'undefined') window.Model = {};
    if (typeof window.Collection === 'undefined') window.Collection = {};
    window.Model.ExOProject = ExOProjectModel;
    window.Collection.ExOProject = EXOProjectCollection;
})(Backbone);
