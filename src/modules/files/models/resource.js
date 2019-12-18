(function(Backbone) {
    var ResourceModel = Backbone.Model.extend({
        url: function(){
            return urlservice.resolve('resources-list');
        },
        addTag: function(tag, callback){
            $.ajax({
                url: urlservice.resolve('resources-add-tag', this.id),
                type: 'PUT',
                data: {'name': tag},
                success: callback,
                async: false
            });
        },
        removeTag: function(tag, callback){
            $.ajax({
                url: urlservice.resolve('resources-remove-tag', this.id),
                type: 'PUT',
                data: {'name': tag},
                success: callback,
                async: false
            });
        }
    });

    var ResourceCollection = Backbone.Collection.extend({
        model: ResourceModel,
        url: function(){
            return urlservice.resolve('resources-list');
        }
    });

    if (typeof window.Collection === 'undefined') window.Collection = {};
    if (typeof window.Model === 'undefined') window.Model = {};
    window.Collection.ResourceCollection = ResourceCollection;
    window.Model.Resource = ResourceModel;
})(Backbone);
