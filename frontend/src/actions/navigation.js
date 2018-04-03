
const navigate = (navigationKey, object) => ({ type: 'NAVIGATE_TO', navigationKey, navigation: object });

export const Navigation = {
    toSection: section => navigate('section', {key: section}),
    toSequence: (page, sequence) => navigate('sequencePage', {key: page, sequenceID: sequence }),
    toSequenceItem: (page, sequenceItem) => navigate('sequencePage', {key: page, sequenceItemID: sequenceItem }),
    toINDIDevice: device => navigate('indi', { device }),
    toINDIGroup: (device, group) => navigate('indi', { device, group} ),
}

export default Navigation

