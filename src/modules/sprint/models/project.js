(function(Backbone) {
    var ConsultantRoleModel = Backbone.Model.extend({
        get_role_display: function(){
            var role_name = this.get('role_description');
            if (this.get('team')){
                role_name = role_name + " - " +  this.get('team');
            }
            return role_name;
        },
        can_delete: function(){
            if (this.get('team')){
                return false;
            }
            return true;
        }
    });

    var ProjectModel = Backbone.Model.extend({
        initialize: function(options){
            options = $.extend({}, options);
            this.project_id = options.project_id;
            this.set('consultants_roles',
              new Backbone.Collection(
                [],
                {model: ConsultantRoleModel})
            );
        },
        url: function(){
            if (this.id){
                // Note this url is for Sprint Edition
                return urlservice.resolve('sprint-edit', this.id);
            }
            else{
                return urlservice.resolve('sprint-add');
            }
        },
        change_head_coach: function(id, name, email, role){
            var actual_head_coach = this.get_consultant_by_role(role.get('code'));
            if(typeof actual_head_coach !== 'undefined'){
                this.remove_consultant(actual_head_coach.get('position'));
            }
            this.add_consultant(name, email, role.get('id'), role.get('name'), id);
        },
        get_consultant_by_role: function(role){
            return this.get('consultants_roles').findWhere({'role': role});
        },
        add_consultant: function(name, email, role, role_description, id, team, thumbnail, url_profile){
            var consultants = this.get('consultants_roles');
            var position = consultants.length;
            consultants.add({
                name: name,
                email: email,
                role: role,
                role_description: role_description,
                position: position,
                team: team,
                consultant_id: id,
                thumbnail: thumbnail,
                url_profile: url_profile
            });
        },
        remove_consultant: function(position){
            var consultants = this.get('consultants_roles');
            var consultant = consultants.findWhere({position: position});
            consultants.remove(consultant);
        },
        parse: function(response, options){
            var hash = Backbone.Model.prototype.parse.apply(this, arguments);

            _.each(response.consultants_roles, function(model){
                this.add_consultant(model.name, model.email, model.role, model.role_description, model.consultant_id, model.team, model.thumbnail, model.url_profile);
            }, this);
            delete hash.consultants_roles;
            return hash;
        }

    });
    if (typeof Backbone.models === 'undefined') Backbone.models = {};
    Backbone.models.Project = ProjectModel;
})(Backbone);
