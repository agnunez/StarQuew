import { createSelector } from 'reselect'

export const getProperties = state => state.indiserver.properties;
export const getValues = state => state.indiserver.values;
export const getDeviceIds = state => state.indiserver.devices;
export const getDeviceEntities = state => state.indiserver.deviceEntities;
export const getVisibleDevice = state => state.navigation.indi.device;
export const getVisibleGroup = state => state.navigation.indi.group ? state.navigation.indi.group : 'Main Control';

export const getDeviceNames = createSelector([getDeviceIds, getDeviceEntities], (deviceIds, devices) => {
    return deviceIds.map(id => ({ id, name: devices[id].name }))
})

export const getVisibleDeviceProperties = createSelector([getProperties, getVisibleDevice], (properties, visibleDevice) =>
    Object.keys(properties).map(p => properties[p]).filter(p => p.device === visibleDevice)
)

export const getVisibleProperties = createSelector([getVisibleDeviceProperties, getVisibleGroup], (properties, visibleGroup) =>
    properties.filter(p => p.group === visibleGroup)
)

export const getVisibleGroups = createSelector([getVisibleDeviceProperties], properties => {
    let groups = properties.map(p => p.group);
    groups = groups.filter((group, index) => groups.indexOf(group) === index)
    return groups;
});


export const getDevicesProperties = createSelector([getDeviceIds, getProperties], (devices, properties) =>
    Object.keys(properties).reduce( (mapping, id) => {
        let property = properties[id];
        let deviceID = property.device;
        return {...mapping, [deviceID]: {...mapping[deviceID], [property.name]: property } }
    } , {})
)


export const getDevicesConnection = createSelector([getDeviceIds, getDevicesProperties, getValues], (deviceIds, devicesProperties, values) => {
    return deviceIds.reduce( (acc, deviceID) =>  {
        if(!(deviceID in devicesProperties))
            return {...acc, [deviceID]: false};
        let deviceProperties = devicesProperties[deviceID]
        if(! ('CONNECTION' in deviceProperties))
            return {...acc, [deviceID]: false};
        let connectionProperty = deviceProperties.CONNECTION;
        let propertyValues = values[connectionProperty.id];
        return {...acc, [deviceID]: !! propertyValues.values.CONNECT && propertyValues.values.CONNECT.value}
    }, {});
});
