function SkillAssessmentViews(){
    this.initialize();
}

SkillAssessmentViews.prototype.initialize = function(){
    this.initialize_views();
    this.initialize_form();
};

SkillAssessmentViews.prototype.initialize_views = function(){
    if (typeof window.View == 'undefined') window.View = {};

    window.View.SkillAssessmentSectionTitle = Backbone.View.extend({
        tagName: 'h3',
        initialize: function(options){
            this.model = options.model;
        }
    });
};

SkillAssessmentViews.prototype.initialize_form = function(){
    if (typeof window.View == 'undefined') window.View = {};

    window.View.SkillAssessmentView = Backbone.View.extend({
        el: '#wizard',
        initialize: function(options){
            this.model = options.model;
            this.is_invitation = this.$el.data('invitation') === 'yes';
            this.skill = new window.Model.SkillAssessmentResponse({
                template: this.model.id
            });
        },
        bindUIElements: function(){
            this._ui = {};
            _.each(this.ui, function(value, key){
                this._ui[key] = this.$el.find(value);
            }, this);
        },
        render: function(){
            this.bindUIElements();
            this.model.get('sections').each(function(section){
                var view = new window.View.SkillAssessmentSectionTitle({model: section});
                this.$el.append(view.$el);

                var content = new window.View.SkillAssesmentSection({
                    model: section,
                    skill: this.skill});
                content.render();
                this.$el.append(content.$el);
            }, this);

            this.$el.steps({
                headerTag: "h3",
                bodyTag: "div.step_body",
                transitionEffect: "slideLeft",
                stepsContainerTag: "div",
                // Events
                onStepChanging: _.bind(this.leaveAStepCallback, this),
                onFinishing: _.bind(this.onFinishCallback, this)
            });

            this.$el.find('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
            });
            this.$el.find('.select2').select2();
            setTimeout(function(){
                $('.wizard ul[role=tablist]').attr('id', 'horizontal-timeline').addClass('horizontal-container');
                $('.wizard ul[role=tablist]').parent();
                $('.wizard ul[role=tablist] li').addClass('horizontal-timeline-block');
            }, 0);
            if (this.is_invitation){
                var invitation_id = this.$el.data('id');
                this.skill.init_from_invitation({
                    invitation_id: invitation_id,
                    questions: this.model.get('questions')
                });
            }else{
                var skill_id = this.$el.data('id');
                this.skill.set('id', skill_id);
                this.skill.fetch();
            }

        },
        _save_step: function(step){
            var errors = true;
            var model = this.model.get('sections').findWhere({
                    order: step
                });
            if (model)
                errors = model.view.commit();

            if (_.isEmpty(errors))
                return true;

            return false;
        },
        leaveAStepCallback: function(event, actual_step, next_step){
            if (actual_step > next_step)
                return true;
            return this._save_step(actual_step+1);
        },
        onFinishCallback: function(event, current_step){
            var validation = this._save_step(current_step+1);
            if (validation){
                var errors = [];
                this.model.get('sections').each(function(section){
                    _.each(section.questions, function(question){
                        var value = question.value;
                        if(_.isUndefined(value)){
                            errors.push(question);
                        }
                    }, this);
                }, this);
                if(_.isEmpty(errors)){
                    this.save();
                    return true;
                }
            }
            return false;
        },
        save: function(){
            this.skill.save_response(_.bind(this.processSaveSuccess, this));
        },
        processSaveSuccess: function(data){
            toastr_manager.show_message('success','Skill assessment filled successfully', '');
            location.href = this.$el.data('success--url');
        }

    });
};
