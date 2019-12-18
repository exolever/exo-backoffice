(function(Backbone) {
    var RequestCollaboratorModel = Backbone.Model.extend({
        fileAttribute: 'documentation',
        initialize: function(options){
            this.set('project', options.project_id);
            this.set('time_slots', new Backbone.Collection());
        },
        url: function(){
            if (this.id){
                return urlservice.resolve('request-collaborator-edit', this.get('project'), this.id);
            }
            return urlservice.resolve('request-collaborator-create', this.get('project'));
        },
        load_time_slot: function(form){
            this.set('time_slot', []);
        },
        parse: function(response, options){
            var hash = Backbone.Model.prototype.parse.apply(this, arguments);
            var time_slots = new Backbone.Collection(response.time_slots);
            hash.time_slots = time_slots;
            return hash;
        },
        save_request: function(opt){
            var options = _.extend({}, opt);
            var formData = new FormData();
            _.each( this.attributes, function( value, key ){
                if (value instanceof Backbone.Collection ){
                    value.each(function(slot, index){
                        formData.append("time_slots[" + index + "]date", slot.get('date'));
                        formData.append("time_slots[" + index + "]time", slot.get('time'));
                        if (slot.id){
                            formData.append("time_slots[" + index + "]id", slot.get('id'));
                        }
                    });
                }
                else{
                    formData.append( key, value );
                }
            });

            // Set options for AJAX call
            options.data = formData;
            options.processData = false;
            options.contentType = false;
            this.save({}, options);
        },
        send_message: function(channel_name, msg, data){
            var channel = Backbone.Radio.channel(channel_name);
            channel.trigger(msg, data);
        },
        accept_ticket: function(channel_name){
            this.channel_name = channel_name;
            $.ajax({
                type: 'PUT',
                url: urlservice.resolve('request-collaborator-accept', this.get('project'), this.id),
                data: {},
                success: _.bind(this.processMarkAccepted, this)
            });
        },
        processMarkAccepted: function(data){
            this.send_message(this.channel_name, 'accepted-ok', data);
        },
        mark_schedule: function(consultant_id, timeslot_id, channel_name){
            this.channel_name = channel_name;
            $.ajax({
                type: 'PUT',
                url: urlservice.resolve('request-collaborator-schedule', this.get('project'), this.id),
                data: {consultant: consultant_id, time_slot: timeslot_id},
                success: _.bind(this.processMarkSchedule, this)
            });
        },
        processMarkSchedule: function(data){
            this.send_message(this.channel_name, 'scheduled-ok', data);
        },
        mark_complete: function(channel_name){
            this.channel_name = channel_name;
            $.ajax({
                type: 'PUT',
                url: urlservice.resolve('request-collaborator-complete', this.get('project'), this.id),
                data: {},
                success: _.bind(this.processMarkCompleted, this)
            });
        },
        processMarkCompleted: function(data){
            this.send_message(this.channel_name, 'completed-ok', data);
        },
        mark_remove: function(channel_name){
            this.channel_name = channel_name;
            $.ajax({
                type: 'PUT',
                url: urlservice.resolve('request-collaborator-remove', this.get('project'), this.id),
                data: {},
                success: _.bind(this.processMarkRemoved, this)
            });
        },
        processMarkRemoved: function(data){
            this.send_message(this.channel_name, 'removed-ok', data);
        },
        mark_request_again: function(channel_name){
            this.channel_name = channel_name;
            $.ajax({
                type: 'PUT',
                url: urlservice.resolve('request-collaborator-request-again', this.get('project'), this.id),
                data: {},
                success: _.bind(this.processMarkRequestedAgain, this)
            });
        },
        processMarkRequestedAgain: function(data){
            this.send_message(this.channel_name, 'requested-ok', data);
        }
    });

    if (typeof window.Model === 'undefined') window.Model = {};
    window.Model.RequestCollaborator = RequestCollaboratorModel;
})(Backbone);
