(function(Backbone) {
    if (typeof window.Model == 'undefined') window.Model = {};
    window.Model.Organization = Backbone.Model.extend({
        url: function(){
            return urlservice.resolve('api-organization-add');
        },
        toString: function(){
            return this.get('name');
        }
    });
})(Backbone);
