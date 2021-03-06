import React from 'react';
import { Icon, Label, Modal, Grid } from 'semantic-ui-react'
import { ModalDialog } from '../Modals/ModalDialog';
import Dropzone from 'react-dropzone';


class ImportSequenceDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <ModalDialog trigger={this.props.trigger} basic size='mini' centered={false}>
                <Modal.Header>Import Sequence</Modal.Header>
                <Modal.Content>
                    <Grid columns={1}>
                        <Grid.Row centered textAlign='center' verticalAlign='middle'>
                            <Dropzone accept='application/json' disablePreview={true} multiple={false} onDrop={ (acceptedFiles) => {
                                this.setState({...this.state, file: acceptedFiles && acceptedFiles.length === 1 ? acceptedFiles[0] : null });
                            }}
                            >
                                <Grid columns={1}>
                                    <Grid.Row centered textAlign='center' verticalAlign='middle'>
                                        <Icon name='upload' size='massive' />
                                    </Grid.Row>
                                    <Grid.Row centered textAlign='center' verticalAlign='middle'>
                                        Drop files here, or click to select
                                    </Grid.Row>
                                </Grid>
                            </Dropzone>
                        </Grid.Row>
                        <Grid.Row centered textAlign='center' verticalAlign='middle'>
                            {this.state.file && <Label>{this.state.file.name}</Label>}
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <ModalDialog.CloseButton content='Cancel' />
                    <ModalDialog.CloseButton content='Import' icon='upload' onClose={() => this.upload()} disabled={!this.state.file}/>
                </Modal.Actions>
            </ModalDialog>
        )
    }

    upload = () => {
        const file = this.state.file;
        this.setState({});
        const reader = new FileReader();
        reader.onload = () => {
            const fileString = reader.result;
            this.props.importSequence(fileString);
        }
        reader.readAsBinaryString(file);
    }
}

export default ImportSequenceDialog;
