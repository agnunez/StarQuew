import React from 'react';
import INDITextProperty from './INDITextProperty';
import INDINumberProperty from './INDINumberProperty';
import INDISwitchProperty from './INDISwitchProperty';
import INDILightProperty from './INDILightProperty';

const getPropertyComponent = (property, pendingProperties, addPendingProperties) => {
    switch(property.type) {
        case "text":
            return ( <INDITextProperty property={property} pendingProperties={pendingProperties} addPendingProperties={addPendingProperties} /> );
        case "number":
            return ( <INDINumberProperty property={property} pendingProperties={pendingProperties} addPendingProperties={addPendingProperties} /> );
        case "switch":
            return ( <INDISwitchProperty property={property} pendingProperties={pendingProperties} addPendingProperties={addPendingProperties} /> );
        case "light":
            return ( <INDILightProperty property={property} pendingProperties={pendingProperties} addPendingProperties={addPendingProperties} /> );
        default:
            // TODO: render blob in some way?
            return null;
    }
}

const INDIDeviceGroup = ({device, group, properties, pendingProperties, addPendingProperties}) => (
    <div className="container-fluid indi-device-group">
        { properties.map((property, index) => (
            <div className="indi-property" key={index}>{getPropertyComponent(property, pendingProperties.filter(p => p.name === property.name), addPendingProperties)}</div>
        ))}
    </div>
)
 
export default INDIDeviceGroup
