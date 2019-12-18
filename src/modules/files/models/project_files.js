(function(Backbone) {
    var FileProjectCollection = Backbone.Collection.extend({
        model: window.Model.File,
        initialize: function(objects, options){
            this.project_id = options.project_id;
        },
        url: function(){
            if (this.project_id){
                return urlservice.resolve('file-project-latest', this.project_id);
            }else{
                return urlservice.resolve('file-user-latest');
            }

        }
    });

    if (typeof window.Collection === 'undefined') window.Collection = {};
    window.Collection.ProjectLatestFile = FileProjectCollection;
})(Backbone);
