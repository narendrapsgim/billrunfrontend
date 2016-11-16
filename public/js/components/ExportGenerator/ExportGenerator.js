import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showDanger } from '../../actions/alertsActions';
import { getExportGenerator, clearExportGenerator, saveExportGenerator, setFtpField } from '../../actions/exportGeneratorActions';
import { Map } from 'immutable';
import { getSettings } from '../../actions/settingsActions';
import Steps from './elements/ExportGeneratorSteps';
import SelectInputProcessor from './elements/SelectInputProcessor';
import Segmentation from './elements/Segmentation';
import FtpDetails from './elements/FtpDetails';

class ExportGenerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stepIndex: 0,
      finished: 0,
      steps: [
        "select_input",
        "segmentation",
        "ftpDetails"
      ]
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { name, action } = this.props.location.query;
    dispatch(getSettings(['export_generators']));

    // Should be deal with edit
    if (action !== "new") dispatch(getExportGenerator(name));
  }

  onError(message) {
    this.props.dispatch(showDanger(message));
  }

  goBack() {
    this.context.router.push({
      pathname: "export_generators"
    });
  }
  
  handleNext() {
    const { stepIndex } = this.state || 0;
    const totalSteps = this.state.steps.length - 1;

    const cb = (err) => {
      if (err) return;
      const finished = (stepIndex + 1) === totalSteps;
      this.setState({
        stepIndex: stepIndex + 1,
        finished
      });
    };

    this.validateSteps(cb);
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) return this.setState({stepIndex: stepIndex - 1, finished: 0});
    let r = confirm("are you sure you want to stop editing Export Generator?");
    if (r) {
      this.props.dispatch(clearExportGenerator());
      this.goBack();
    }
  }

  handleCancel() {
    let r = confirm("are you sure you want to stop editing Export Generator?");
    const { dispatch, fileType } = this.props;
    if (r) {
      if (fileType !== true) {
        dispatch(clearExportGenerator());
        this.goBack();
      } else {
        const cb = (err) => {
          if (err) {
            dispatch(showDanger("Please try again"));
            return;
          }
          dispatch(clearExportGenerator());
          this.goBack();
        };
        // need to handle
        dispatch(clearExportGenerator(this.props.settings.get('file_type'), cb));
      }
    }
  }

  validateSteps (cb) {
    const { stepIndex, finished } = this.state || 0;
    let err = [];

    if (finished) {
      this.props.dispatch(saveExportGenerator());
    } else {      
      switch (stepIndex) {
        case 0:
          // check name
          if (this.props.settings.get('name').length === 0) {
            err.push ('Export Process name is mandatory.');
          }

          //check input processor selected
          if (this.props.settings.get('inputProcess').size === 0) {
            err.push ('Please select Input Processor.');
          }
          break;

        case 1:
          // check at last one segment with from/to is selected
          // let segment = this.props.settings.get('segments').get(0);
          if (this.props.settings.get('segments').size === 0) {
            err.push ('Please select at least one segment');
          } else {
            let firstSegment = this.props.settings.get('segments').first();
            if (!firstSegment.get('field') || ( !firstSegment.get('from') && firstSegment.get('to') )) {
              err.push ('Generator should has at last one valid segment');
            }
          }
          break;
      }

      if (err.length > 0 ) {
        this.props.dispatch(showDanger(err.join("\n\n")));

        cb(true);
        return;
      }


      cb(false);
    }
  }

  onChangeFTPField = (e) => {
    const { id, value } = e.target;
    this.props.dispatch(setFtpField(id, value));
  };

  render() {
    let { stepIndex } = this.state;
    const { settings } = this.props;

    const steps = [
      (<SelectInputProcessor onNext={this.handleNext.bind(this)} settings={settings} />),
      (<Segmentation onNext={this.handleNext.bind(this)} settings={settings} />),
      (<FtpDetails onNext={this.handleNext.bind(this)} settings={ settings.get('receiver', Map()) } onChangeField={ this.onChangeFTPField } />)
    ];

    const { action } = this.props.location.query;
    const title = action === 'new' ? "New export generator" : `Edit input processor - ${settings.get('file_type')}`;
    
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-lg-8">
                    <Steps stepIndex={stepIndex} />
                  </div>
                </div>
              </div>
              <div className="panel-body">
                {/*<div className="row">
                  <div className="col-lg-6 col-lg-offset-4">
                    <Steps stepIndex={stepIndex} />
                  </div>
                </div>*/}

                <div className="contents bordered-container" style={{minHeight: '250px'}}>
                  { steps[stepIndex] }
                </div>

              </div>
              <div style={{marginTop: 12}} className="pull-left">
                <button className="btn btn-default"
                        onClick={this.handleCancel}
                        style={{marginRight: 12}}>
                  Cancel
                </button>
              </div>
              <div style={{marginTop: 12}} className="pull-right">
                {(() => {
                  if (stepIndex > 0) {
                    return (
                      <button className="btn btn-default"
                              onClick={this.handlePrev}
                              style={{marginRight: 12}}>
                        Back
                      </button>
                    );
                  }
                })()}
                <button className="btn btn-primary"
                        onClick={this.handleNext}>
                  { stepIndex === (steps.length - 1) ? "Finish" : "Next" }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExportGenerator.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearExportGenerator }, dispatch);
}

function mapStateToProps(state, props) {
  return { settings: state.exportGenerator };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportGenerator);
