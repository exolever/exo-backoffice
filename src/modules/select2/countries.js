/**
    Init data for Country select2 fields
 */
function init_country_select2(){
    return {
        ajax: {
            url: urlservice.resolve('api-countries'),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term, // search term
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        allowClear: true
    };
}


function init_city_select2(country_id, options){
    options = options || {};
    return {
        ajax: {
            url: urlservice.resolve('api-cities'),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    search: params.term, // search term
                    page: params.page,
                    country__id: country_id,
                    only_consultant: options.only_consultant
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        allowClear: true
    };
}
