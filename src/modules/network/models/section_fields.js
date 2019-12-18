(function(Backbone){

    var SectionFieldModel = Backbone.Model.extend({
        url: function(){
            return urlservice.resolve('section-fields', this.section);
        }
    });

    if (typeof window.Model == 'undefined') window.Model = {};
    window.Model.SectionFields = SectionFieldModel;
})(Backbone);
