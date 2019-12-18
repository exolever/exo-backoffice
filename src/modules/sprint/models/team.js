(function(Backbone) {
    var TeamModel = Backbone.Model.extend({
        initialize: function(options){
            this.project_id = options.project_id;
            this.set('team_members', new Backbone.Collection());
            this.set('exo_projects', new Backbone.Collection());
        },
        url: function(){
            if (this.id){
                return urlservice.resolve('project-edit-team', this.project_id, this.id);
            }
            return urlservice.resolve('project-create-team', this.project_id);
        },
        add_member: function(name, email){
            if (this.exists_member(name, email) === false){
                var members = this.get('team_members');
                var position = members.length;
                members.add({
                    short_name: name,
                    email: email,
                    position: position
                });
            }
        },
        exists_member: function(name, email){
            var members = this.get('team_members');
            return members.filter({email:email}).length !== 0;
        },
        remove_member: function(position){
            var members = this.get('team_members');
            var member = members.findWhere({position: position});
            members.remove(member);
        },
        add_exo_project: function(name, description, id){
            var projects = this.get('exo_projects');
            var position = projects.length;
            projects.add({
                name: name,
                description: description,
                position: position,
                id: id});
        },
        remove_exo_project: function(position){
            var projects = this.get('exo_projects');
            var project = projects.findWhere({position: position});
            projects.remove(project);
        },
        remove_from_collection: function(collection, pk){
            var elem = collection.findWhere({position: pk});
            collection.remove(elem);
        },
        parse: function(response, options){
            var hash = Backbone.Model.prototype.parse.apply(this, arguments);

            _.each(response.team_members, function(model){
                this.add_member(model.short_name, model.email);
            }, this);
            _.each(response.exo_projects, function(model){
                this.add_exo_project(model.name, model.description, model.id);
            }, this);
            delete hash.team_members;
            delete hash.exo_projects;
            return hash;
        }
    });
    var TeamCollection = Backbone.Collection.extend({
        model: TeamModel
    });

    if (typeof Backbone.models === 'undefined') Backbone.models = {};
    Backbone.models.Team = TeamModel;
    if (typeof window.Collection === 'undefined') window.Collection = {};
    window.Collection.Team = TeamCollection;
})(Backbone);
