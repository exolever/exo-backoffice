(function(Backbone) {
    var LanguageModel = Backbone.Model.extend({
        toString: function(){
            return this.get('name');
        }
    });
    var LanguageCollection = Backbone.Collection.extend({
        model: LanguageModel,
        url: function(){
            return urlservice.resolve("languages");
        }
    });

    if (typeof window.Model === 'undefined') window.Model = {};
    if (typeof window.Collection === 'undefined') window.Collection = {};
    window.Model.Language = LanguageModel;
    window.Collection.Language = LanguageCollection;
})(Backbone);
