import { getDevicesConnection, getDeviceEntities, getDevicesProperties, getValues } from './indi-properties'
import { createSelector } from 'reselect'

export const getSequences = state => state.sequences;
export const getSequenceItems = state => state.sequenceItems;

export const getGear = state => state.gear


const buildBaseObject = (devicesConnection, deviceEntities, devicesProperties, deviceID) => {
    let device = { id: deviceID }
    if(deviceID in deviceEntities)
        device.name = deviceEntities[deviceID].name;
    device.connected = devicesConnection[deviceID];
    return device;
}

const buildCamera = (devicesConnection, deviceEntities, devicesProperties, cameraID) => {
    let camera = buildBaseObject(devicesConnection, deviceEntities, devicesProperties, cameraID);
    if(camera.connected) {
        camera.exposureProperty = devicesProperties[cameraID].CCD_EXPOSURE;
        camera.abortExposureProperty = devicesProperties[cameraID].CCD_ABORT_EXPOSURE;
    }
    return camera
}

const buildFilterWheel = (devicesConnection, deviceEntities, devicesProperties, filterWheelID, values) => {
    let filterWheel = buildBaseObject(devicesConnection, deviceEntities, devicesProperties, filterWheelID);
    if(filterWheel.connected) {
        filterWheel.filterNameProperty = devicesProperties[filterWheelID].FILTER_NAME;
        filterWheel.filterSlotProperty = devicesProperties[filterWheelID].FILTER_SLOT;
        if(filterWheel.filterNameProperty && filterWheel.filterSlotProperty) {
            let filtersNamesValue = values[filterWheel.filterNameProperty.id]
            filterWheel.filters = filtersNamesValue.names.map( (name, index) => ({number: index+1, name: filtersNamesValue.values[name].value}) );
            filterWheel.names2numbers = filterWheel.filters.reduce( (mapping, filter) => ({...mapping, [filter.name]: filter.number}), {});
            filterWheel.numbers2names = filterWheel.filters.reduce( (mapping, filter) => ({...mapping, [filter.number]: filter.name}), {});
            let filterSlot = values[filterWheel.filterSlotProperty.id].values.FILTER_SLOT_VALUE.value;
            filterWheel.currentFilter = { number: filterSlot, name: filterWheel.numbers2names[filterSlot] }
        }
    }
    return filterWheel
}


const buildGear = (devicesConnection, deviceEntities, devicesProperties, sequence, values) => {
    let gear = { sequence: sequence.id };
    if(sequence.camera)
        gear.camera = buildCamera(devicesConnection, deviceEntities, devicesProperties, sequence.camera);
    if(sequence.filterWheel)
        gear.filterWheel = buildFilterWheel(devicesConnection, deviceEntities, devicesProperties, sequence.filterWheel, values);
    return gear;
}

export const getGears = createSelector([getDevicesConnection, getDeviceEntities, getDevicesProperties, getSequences, getValues], (devicesConnection, deviceEntities, devicesProperties, sequences, values) => {
    return sequences.ids.reduce( (gears, sequenceID) => ({...gears, [sequenceID]: buildGear(devicesConnection, deviceEntities, devicesProperties, sequences.entities[sequenceID], values) }), {});
})
