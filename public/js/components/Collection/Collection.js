import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Form, FormGroup, Col, FormControl, ControlLabel, InputGroup } from 'react-bootstrap';
import Help from '../Help';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import { getSettings } from '../../actions/settingsActions';
import { saveCollection, updateCollection, updateNewCollection, clearNewCollection, pushNewCollection } from '../../actions/collectionsActions';

/* COMPONENTS */
import ConfirmModal from '../../components/ConfirmModal';
import ActionButtons from '../Elements/ActionButtons';
import Field from '../Field';
import MailEditorRich from '../MailEditor/MailEditorRich';

/* DEV - TO replace with real API */
import fieldsList from './stub_fields.json';

class Collection extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    showConfirm: false,
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'new') {
      this.props.dispatch(clearNewCollection());
    }
    this.props.dispatch(getSettings('collection'));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props: { item }, state: { showConfirm } } = this;
    return !Immutable.is(item, nextProps.item) || showConfirm !== nextState.showConfirm;
  }

  onChangeName = (e) => {
    const { value } = e.target;
    this.onChange(['name'], value);
  }

  onChangeActive = (e) => {
    const { value } = e.target;
    switch (value) {
      case 'true':
        this.onChange(['active'], true);
        break;
      case 'false':
        this.onChange(['active'], false);
        break;
      default:
        this.onChange(['active'], '');
    }
  }

  onChangeDays = (e) => {
    const { value } = e.target;
    this.onChange(['do_after_days'], value);
  }

  onChangeSubject = (e) => {
    const { value } = e.target;
    this.onChange(['content', 'subject'], value);
  }

  onChangeBody = (value) => {
    this.onChange(['content', 'body'], value);
  }

  onChange = (path, value) => {
    const { mode, index } = this.props;
    if (mode === 'new') {
      this.props.dispatch(updateNewCollection(path, value));
    } else {
      this.props.dispatch(updateCollection([index, ...path], value));
    }
  }

  onSave = () => {
    const { mode, item } = this.props;
    if (mode === 'new') {
      this.props.dispatch(pushNewCollection(item));
      this.props.dispatch(saveCollection());
      this.props.dispatch(clearNewCollection());
      this.props.router.push(`/collection/${item.get('id')}`);
    } else {
      this.props.dispatch(saveCollection());
    }
  }


  onCancelAsk = () => {
    this.setState({ showConfirm: true });
  }

  onCancelOk = () => {
    const { mode } = this.props;
    if (mode === 'new') {
      this.props.dispatch(clearNewCollection());
    } else {
      this.props.dispatch(getSettings('collection'));
    }
    this.backToList();
  }

  onCancelCancel = () => {
    this.setState({ showConfirm: false });
  }

  backToList = () => {
    this.props.router.push('/collections');
  }

  render() {
    const { item } = this.props;
    if (!item) {
      return (<LoadingItemPlaceholder onClick={this.backToList} loadingLabel="Collections not found." />);
    }

    if (!item.get('id', null)) {
      return (<LoadingItemPlaceholder onClick={this.backToList} />);
    }

    const { showConfirm } = this.state;
    const confirmMessage = 'Are you sure you want to stop editing Collection?';

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <Form horizontal>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Collection Details
                </div>
                <div className="panel-body">

                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3} lg={2}> Title </Col>
                    <Col sm={8} lg={9}>
                      <Field onChange={this.onChangeName} value={item.get('name', '')} />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3} lg={2}>Trigger after</Col>
                    <Col sm={4}>

                      <InputGroup>
                        <Field onChange={this.onChangeDays} value={item.get('do_after_days', '')} fieldType="number" min="1" />
                        <InputGroup.Addon>Days</InputGroup.Addon>
                      </InputGroup>
                    </Col>
                  </FormGroup>


                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3} lg={2}>Active</Col>
                    <Col sm={4}>
                      <FormControl componentClass="select" placeholder="" value={item.get('active', '')} onChange={this.onChangeActive}>
                        <option value="">Select...</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </FormControl>
                    </Col>
                  </FormGroup>

                </div>
              </div>

              <div className="panel panel-default">
                <div className="panel-heading">
                  Email Template <Help contents={'Template for email that will be send to customer'} />
                </div>
                <div className="panel-body">

                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3} lg={2}>Subject</Col>
                    <Col sm={8} lg={9}>
                      <Field onChange={this.onChangeSubject} value={item.getIn(['content', 'subject'], '')} />
                    </Col>
                  </FormGroup>

                  <div>
                    <MailEditorRich value={item.getIn(['content', 'body'])} editorName="editor" fields={fieldsList} onChange={this.onChangeBody} />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <ActionButtons onClickSave={this.onSave} onClickCancel={this.onCancelAsk} />
        <ConfirmModal onOk={this.onCancelOk} onCancel={this.onCancelCancel} show={showConfirm} message={confirmMessage} labelOk="Yes" />
      </div>
    );
  }
}


const mapStateToProps = (state, props) => {
  // TODO: make it more readably
  const { itemId, action: mode = (itemId) ? 'update' : 'new' } = props.params;
  let item = state.collections.collection;
  let index = -1;
  if (itemId && state.settings.getIn(['collection', 'steps'], Immutable.List()).size) {
    index = state.settings.getIn(['collection', 'steps'], Immutable.List()).findIndex(collection => collection.get('id') === itemId);
    item = (index > -1)
      ? state.settings.getIn(['collection', 'steps'], Immutable.List()).get(index)
      : null;
  }
  return { item, index, mode };
};

export default withRouter(connect(mapStateToProps)(Collection));
