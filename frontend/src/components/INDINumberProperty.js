import React from 'react';
import CommitPendingValuesButton from './CommitPendingValuesButton'
import INDILight from './INDILight'
import INDINumber from './INDINumber'



const INDINumberProperty = ({property, isWriteable, pendingValues, displayValues, addPendingValues, commitPendingValues, values }) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-8">
            {values.names.map( (name, index) => <INDINumber key={index} value={values.values[name]} addPendingValues={addPendingValues} displayValue={displayValues[name]} isWriteable={isWriteable} /> )}
        </div>
        <div className="col-xs-1"><CommitPendingValuesButton bsStyle="primary" size="xsmall" isWriteable={isWriteable} commitPendingValues={commitPendingValues} /></div>
    </div>
)
 
export default INDINumberProperty
