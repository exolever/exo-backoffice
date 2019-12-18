(function(Backbone){
    var UserSectionPreferenceModel = Backbone.Model.extend({
        url: function(){
            var url = urlservice.resolve('user-section-preference', this.get('section'));
            if (this.id){
                return  url + this.id + "/";
            }
            return url;
        }
    });

    var UserSectionPreferenceCollection = Backbone.Collection.extend({
        model: UserSectionPreferenceModel,
        url: function(){
            return urlservice.resolve('user-section-preference', this.section);
        }
    });

    if (typeof window.Model === 'undefined') window.Model = {};
    if (typeof window.Collection == 'undefined') window.Collection = {};
    window.Model.UserSectionPreference = UserSectionPreferenceModel;
    window.Collection.UserSectionPreference = UserSectionPreferenceCollection;
})(Backbone);
