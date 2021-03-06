import React from 'react';
import { Container, Grid, Input, Form, Header, Segment, Button, Message } from 'semantic-ui-react';
import ExposureInputContainer from './ExposureInputContainer';
import CurrentImageViewerContainer from './CurrentImageViewerContainer';
import AutoExposureContainer from './AutoExposureContainer';
import HistogramContainer from './HistogramContainer';
import SelectFilterContainer from './SelectFilterContainer';
import ImageViewOptions from '../Image/ImageViewOptions';
import { NotFoundPage } from '../components/NotFoundPage';


const FilterWheelSection = ({filterWheels, currentFilterWheel, setCurrentFilterWheel}) => (
    <React.Fragment>
        <Header size='tiny' content='FilterWheel' textAlign='center' />
        <Button.Group vertical size='mini' fluid basic>
        { filterWheels.map(c => <Button
            toggle
            active={currentFilterWheel && currentFilterWheel.id === c.id}
            key={c.id} content={c.device.name}
            onClick={() => setCurrentFilterWheel(c.id)}
        />) }
        </Button.Group>
        { currentFilterWheel &&
            <Form.Field inline>
                <label>Filter</label>
                <SelectFilterContainer basic size='tiny' labeled floating />
            </Form.Field>
        }
    </React.Fragment>
)

export const CameraSectionMenu = ({
    cameras,
    currentCamera,
    filterWheels,
    options,
    setOption,
    setCurrentCamera,
    isShooting,
    imageLoading,
    currentFilterWheel,
    setCurrentFilterWheel,
    canCrop,
    crop,
    startCrop,
    resetCrop,
}) => cameras.length > 0 && (
    <Form size='tiny'>
        <Header size='tiny' content='Camera' textAlign='center' />
        <Button.Group vertical size='mini' fluid basic>
        { cameras.map(c => <Button
            toggle
            active={currentCamera && currentCamera.id === c.id}
            key={c.id} content={c.device.name}
            onClick={() => setCurrentCamera(c.id)}
        />) }
        </Button.Group>
        { filterWheels.length > 0 &&
            <FilterWheelSection {...{filterWheels, currentFilterWheel, setCurrentFilterWheel}} />
        }
        <Header size='tiny' content='Exposure' textAlign='center' />
        <Form.Field>
            <ExposureInputContainer disabled={!currentCamera || isShooting} size='tiny' />
            { !currentCamera && <Message content='Please select a camera first' size='tiny'/> }
        </Form.Field>
        <Form.Checkbox label='Continuous' disabled={!currentCamera} toggle size='mini' checked={options.continuous} onChange={(e, data) => setOption({continuous: data.checked})} />
        <Header size='tiny' content='View Options' textAlign='center' />
        <ImageViewOptions options={options} setOption={setOption} />
        <Header size='tiny' content='Histogram' textAlign='center' />
        <Form.Checkbox label='Show histogram' toggle size='tiny' checked={options.showHistogram} onChange={(e, data) => setOption({showHistogram: data.checked})} />
        {
            options.showHistogram && (<React.Fragment>
                <Form.Checkbox
                    key='log'
                    label='logarithmic'
                    toggle
                    size='tiny'
                    checked={options.histogramLogarithmic}
                    onChange={(e, data) => setOption({histogramLogarithmic: data.checked})}
                    />
                <Form.Field key='bins'>
                    <Input
                        type='number'
                        label='bins'
                        size='tiny'
                        min={0}
                        max={255}
                        value={options.histogramBins}
                        onChange={(e, data) => setOption({histogramBins: data.value})}
                    />
                </Form.Field>
            </React.Fragment>)
        }
        <Header size='tiny' content='ROI' textAlign='center' />
        <Button content='select ROI' size='tiny' fluid basic disabled={!canCrop || !!crop} onClick={startCrop}/>
        <Button content='clear ROI' size='tiny' fluid basic disabled={!canCrop || !(!!crop && crop.pixel )} onClick={resetCrop}/>
        { crop && crop.pixel && ! crop.applied && <Message size='tiny' content='You need to shoot another image to see the new ROI applied' />}
        { crop && ! crop.pixel && crop.canceled && <Message size='tiny' content='You need to shoot another image to reset the ROI to full size' />}

    </Form>
)


export const Camera = ({options, cameras}) => {
    if(cameras.length === 0)
        return <NotFoundPage backToUrl='/indi/server' message='Camera not found. Perhaps you need to connect to your INDI server?' backButtonText='INDI server page' />
    return (
        <Container fluid>
            <AutoExposureContainer />
            <HistogramContainer />
            <CurrentImageViewerContainer fitScreen={options.fitToScreen} />
        </Container>
    );
}


