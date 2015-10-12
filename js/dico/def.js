/*! ***************************************************************************
 *
 * evolutility :: def.js
 *
 * Library of helpers for metamodel
 *
 * https://github.com/evoluteur/evolutility
 * Copyright (c) 2015, Olivier Giulieri
 *
 *************************************************************************** */

var Evol = Evol || {};

Evol.Def = function(){

var fts = {
    text: 'text',
    textml: 'textmultiline',
    bool: 'boolean',
    int: 'integer',
    dec: 'decimal',
    money: 'money',
    date: 'date',
    datetime: 'datetime',
    time: 'time',
    lov: 'lov',
    list: 'list', // many values for one field (behave like tags - return an array of strings)
    html: 'html',
    formula:'formula', // soon to be a field attribute rather than a field type
    email: 'email',
    pix: 'image',
    //geoloc: 'geolocation',
    //doc:'document',
    url: 'url',
    color: 'color',
    hidden: 'hidden'
    //json: 'json',
    //rating: 'rating',
    //widget: 'widget'
};

return {

    fieldTypes: fts,

    /*
    isViewOne: function(viewName){
        return viewName==='new' || viewName==='edit' || viewName==='browse' || viewName==='json';
    },*/
    isViewMany: function(viewName){
        return viewName==='list' || viewName==='cards' || viewName==='charts' || viewName==='bubbles';
    },
    
    isViewCollection: function(viewName){
        return viewName==='list' || viewName==='cards';
    },

    fieldInCharts: function (f) {
        return (_.isUndefined(f.inCharts) || f.inCharts) && Evol.Def.fieldChartable(f);
    },
    fieldChartable: function (f) {
        return  f.type===fts.lov || f.type===fts.bool || f.type===fts.int || f.type===fts.money;
    },

    fieldIsNumber: function(f){
        var ft=f.type;
        return ft===fts.int || ft===fts.dec || ft===fts.money;
    },/*
    fieldIsDateOrTime: function(fType){
        return fType===fts.date || fType===fts.datetime || fType===fts.time;
    },*/

    // get all "shallow" fields (no sub collections) from a UI model
    getFields: function (uiModel, fnFilter) {
        var fs = [];

        function collectFields(te) {
            if (te && te.elements && te.elements.length > 0) {
                _.each(te.elements, function (te) {
                    if(te.type!='panel-list'){
                        collectFields(te);
                    }
                });
            } else {
                fs.push(te);
            }
        }

        collectFields(uiModel);
        if (_.isFunction(fnFilter)) {
            fs= _.filter(fs, fnFilter);
        }
        return fs;
    },

    // get sub collections
    getSubCollecs: function(uiModel){
        var ls = {};

        function collectCollecs(te) {
            if(te.type==='panel-list'){
                ls[te.attribute]=te;
            }else if (te.type!=='panel' && te.elements && te.elements.length > 0) {
                _.each(te.elements, function (te) {
                    if(te.type==='panel-list'){
                        ls[te.attribute]=te;
                    }else if(te.type!=='panel'){
                        collectCollecs(te);
                    }
                });
            } else {
                ls[te.attribute]=te;
            }
        }

        collectCollecs(uiModel);
        return ls;
    }

};

}();