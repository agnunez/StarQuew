import { connect } from 'react-redux'
import Actions from '../actions'
import SequenceItemButtons from './SequenceItemButtons'


const mapStateToProps = (state) => {
    let sequenceId = state.navigation.sequencesPage.sequenceID;
    let sequenceItemId = state.navigation.sequencesPage.sequenceItemID;
    return { sequenceId, sequenceItemId }

}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSave: (sequenceItem) => dispatch(Actions.SequenceItems.saveSequenceItem(sequenceItem)),
        navigateBack: (sequence) => dispatch(Actions.Navigation.toSequence('sequence', sequence)),
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({ ...stateProps, ...dispatchProps, ...ownProps, navigateBack: () => dispatchProps.navigateBack(stateProps.sequenceId) })

const SequenceItemButtonsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SequenceItemButtons)

export default SequenceItemButtonsContainer
