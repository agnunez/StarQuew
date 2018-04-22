import React from 'react';
import INDILight from './INDILight'

const INDILightProperty = ({property, values}) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-9">
            {values.names.map(name => ( <INDILight key={name} state={values.values[name].value} text={values.values[name].label} /> ) )}
        </div>
    </div>
)
 
export default INDILightProperty
