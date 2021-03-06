import React from 'react';
import ExposureSequenceJobContainer from './ExposureSequenceJobContainer'
import CommandSequenceJob from './CommandSequenceJob'
import FilterSequenceJobContainer from './FilterSequenceJobContainer'
import INDIPropertySequenceJobContainer from './INDIPropertySequenceJobContainer'
import { NotFoundPage } from '../components/NotFoundPage';

const mapItemType = (sequenceJob) => {
    switch(sequenceJob.type) {
        case 'shots':
            return <ExposureSequenceJobContainer sequenceJob={sequenceJob} />;
        case 'filter':
            return <FilterSequenceJobContainer sequenceJob={sequenceJob} />;
        case 'command':
            return <CommandSequenceJob sequenceJob={sequenceJob} />
        case 'property':
            return <INDIPropertySequenceJobContainer sequenceJob={sequenceJob} />
        default:
            return null;
        }
}

const SequenceJob = ({sequenceJob}) => {
    if(sequenceJob) {
        return <div className="container">{mapItemType(sequenceJob)}</div>
    }
    return <NotFoundPage backToUrl='/sequences/all' message='Sequence job not found' />
}

export default SequenceJob
