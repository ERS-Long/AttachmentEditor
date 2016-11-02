# Attachment Editor
Example Widget to test Attachment Editor in CMV

Used ESRI Example https://developers.arcgis.com/javascript/3/jssamples/ed_attachments.html

This is just an example widget to test the functionality of ESRI Attachment Editor in CMV.

CMV Config Settings

add esri example layer

        {
            type: 'feature',
            url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Prominent_Peaks_attach/FeatureServer/0',
            title: 'Prominent_Peaks_attach',
            options: {
                id: 'Prominent_Peaks_attach',
                opacity: 0.75,
                visible: true,
                outFields: ['*'],
                mode: 0,
                showAttachments: true
            },
            identifyLayerInfos: {
                layerIds: [0]
            },
            editorLayerInfos: {
                showDeleteButton: false,
                disableAttributeUpdate: false,
                disableGeometryUpdate: false,
            },
            legendLayerInfos: {
                exclude: true
            }            
        },                    

		
add the widget setting
		
		attachmentEditor:
		{
			include: true,
			id: 'attachmentEditor',
			type: 'titlePane',
			canFloat: true,
			path: 'widgets/AttachmentEditor',
			title: 'Attachment Editor',
			position: 22,
			open: false,                
			options: {
				map: true
			}
		},     

Put the widget code to folder \widgets


Expand the attachmentEditor widget, the map click event changes to the attachment editor click, Collapse the widget, the map click changes back to the default.  
            

![alt tag](/AttachmentEditor.PNG)


