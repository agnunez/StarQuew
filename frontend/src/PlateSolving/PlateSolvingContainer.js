import { connect } from 'react-redux';
import { PlateSolvingPage, PlateSolvingSectionMenu } from './PlateSolvingPage';
import {
  connectedAstrometrySelector,
  connectedTelescopesSelector,
  connectedCamerasSelector,
} from '../Gear/selectors';
import { getMessages } from '../INDI-Server/selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    astrometryDrivers: connectedAstrometrySelector(state),
    telescopes: connectedTelescopesSelector(state),
    cameras: connectedCamerasSelector(state),
    options: state.plateSolving.options,
    messages: getMessages(state)[state.plateSolving.options.astrometryDriver],
})

const mapDispatchToProps = dispatch => ({
  setOption: (option, value) => dispatch(Actions.PlateSolving.setOption(option, value)),
  solveField: options => dispatch(Actions.PlateSolving.solveField(options)),
})

export const PlateSolvingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlateSolvingPage)

export const PlateSolvingSectionMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlateSolvingSectionMenu)

