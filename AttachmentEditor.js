define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/_base/lang',
    'dojo/topic',
    'dojo/domReady!',
    'dojo/aspect',
    'dijit/registry',
    'dojo/_base/array',

    'dojo/text!./AttachmentEditor/templates/AttachmentEditor.html',
    'xstyle/css!./AttachmentEditor/css/AttachmentEditor.css',

    'esri/layers/FeatureLayer',
    'esri/dijit/editing/AttachmentEditor',
    'dojo/dom',

    'esri/lang',
    'esri/Color',
    'dojo/number',
    'dojo/dom-style',

//    'dojo/data/ObjectStore',
//    'dojo/store/Memory',

    'dijit/form/Select',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane'

], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    lang,
    topic,
    ready,
    aspect,
    registry,
    array,

    template,
    css,

    FeatureLayer, 
    AttachmentEditor,
    dom,

    esriLang,
    Color, 
    number, 
    domStyle

 //   ObjectStore, 
 //   Memory
) {
    var dialog;
    var map;
    var featureLayer;
    var attachmentEditor;
    var loaded = 0;
    var selectedLayerID;

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
         widgetsInTemplate: true,
         templateString: template,        
        map: true,
        postCreate: function () {
            this.inherited(arguments);
            map = this.map;
            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));

            if (this.parentWidget && this.parentWidget.toggleable) {
                this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                    this.onLayoutChange(this.parentWidget.open);
                })));
            }            

            // execute the editAttachment method when user clicks the map
            map.on('click', lang.hitch(this, 'editAttachment'));
            map.on('extent-change', lang.hitch(this, 'changeHandler'));
        //    map.on('zoom', lang.hitch(this, 'changeHandler'));

        },

        startup: function () {
            //this.getMapLayers2();
            this.getMapLayers3();
        },

        initLayer: function()
        {
            // featureLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Prominent_Peaks_attach/FeatureServer/0",{
            //     mode: FeatureLayer.MODE_ONDEMAND
            // });
       //     var layerID = this.layerid;
            var layerID = selectedLayerID;
            featureLayer = map.getLayer(layerID); //@tmcgee hint

            //do we need to turn off all other feature layers?
        //    this.turnOffAllOtherFeatureLayers();

            map.infoWindow.setContent("<div id='content' style='width:100%'></div>");
            map.infoWindow.resize(350,200);
            attachmentEditor = new AttachmentEditor({}, dom.byId("content"));
            attachmentEditor.startup();
/*
            featureLayer.on("click", function(evt) {
                var objectId = evt.graphic.attributes[featureLayer.objectIdField];
                map.infoWindow.setTitle(objectId);
                attachmentEditor.showAttachments(evt.graphic,featureLayer);
                map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
            });
*/        
//            map.addLayer(featureLayer);
        },

        changeHandler: function (evt){
/*
            if (this.parentWidget) {
                if (this.parentWidget.open)
                    this.parentWidget._onTitleClick();  
            } 
            */
            if (this.parentWidget) {
                if (this.parentWidget.open)
                    this.onAttachment();
            }        
        },

        onLayoutChange: function (open) {
            if (open) {
                this.disconnectMapClick();
                this.initLayer();

            } else {
                this.connectMapClick();
            }
        },

        editAttachment: function (evt) {
            if ("myClick2" === this.mapClickMode)
            {
                //console.log(featureLayer);
                var objectId = evt.graphic.attributes[featureLayer.objectIdField];
                map.infoWindow.setTitle(objectId);
                attachmentEditor.showAttachments(evt.graphic,featureLayer);
                map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
            }
        },

        turnOffAllOtherFeatureLayers: function(layerList, onLayer)
        {
            array.forEach( layerList, function( layer ) {
                var featureLayerToTurnOnOff = map.getLayer(layer); //@tmcgee hint

                if (layer != onLayer)
                {
                    featureLayerToTurnOnOff.visible = false;
                }
                else
                {
                    featureLayerToTurnOnOff.visible = true;
                }               
            }, this);   
        },

        getMapLayers: function () {  
            var object = null; 
            var data = [];
            loaded++;

            if (loaded === 1)
            {
                array.forEach( this.layers2attachment, function( layer ) {
                    object = {value: layer.layerid, label: layer.layerid};
                    data.push(object); 
                }, this);    
            //    console.log(data);     

                this.selectLayer4AttachmentEditor.set('options', data);  
            }
        },  

        getMapLayers2: function () {  
            var object = null; 
            var data = [];
            array.forEach( this.layers2attachment, function( layer ) {
                object = {value: layer.layerid, label: layer.layerid};
                data.push(object); 
            }, this);    

            this.selectLayer4AttachmentEditor.set('options', data); 
            this.selectLayer4AttachmentEditor.set('value', data[0].value); 
        },  

        getMapLayers3: function () //try to get the layer list from the map object
        {
            //alert(map.layers)
            var object = null; 
            var data = [];
            array.forEach( map.graphicsLayerIds, function( layer ) {
                object = {value: layer, label: layer};
                if (map.getLayer(layer).type === 'Feature Layer')
                {
                    data.push(object);                     
                }
            }, this);   
            // object = {value: 'county', label: 'county'}; 
            // data.push(object); 

            this.selectLayer4AttachmentEditor.set('options', data); 
            this.selectLayer4AttachmentEditor.set('value', data[0].value); 

        },

        onAttachment: function() {
            this.disconnectMapClick();
            this.initLayer();
        },

        onAttachmentEditorLayerChange: function (newValue) {
            console.log(newValue);
            featureLayer = null;
            selectedLayerID = newValue;  
            this.initLayer();          
        },

        disconnectMapClick: function() {
            topic.publish("mapClickMode/setCurrent", "myClick2");
        },

        connectMapClick: function() {
            topic.publish("mapClickMode/setDefault");
        },
        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
        }        

    });
});