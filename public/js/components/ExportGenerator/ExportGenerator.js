import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { PageHeader } from 'react-bootstrap';

// import { clearInputProcessor, getProcessorSettings, setName, setDelimiterType, setDelimiter, setFields, setFieldMapping, setFieldWidth, addCSVField, addUsagetMapping, setCustomerMapping, setRatingField, setReceiverField, saveInputProcessorSettings, removeCSVField, removeAllCSVFields, mapUsaget, removeUsagetMapping, deleteInputProcessor, setUsagetType, setLineKey, setStaticUsaget } from '../../actions/inputProcessorActions';
import { getSettings } from '../../actions/settingsActions';
import { showSuccess, showWarning, showDanger } from '../../actions/alertsActions';

import Steps from './elements/ExportGeneratorSteps';
import SelectInputProcessor from './elements/SelectInputProcessor';
import Segmentation from './elements/Segmentation';
import FtpDetials from './elements/FtpDetials';

class InputProcessor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stepIndex: 0,
      finished: 0,
      steps: [
        "parser",
        "processor",
        "customer_identification_fields",
        "receiver"
      ]
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { file_type, action } = this.props.location.query;

    // dispatch(clearInputProcessor());
    if (action !== "new") dispatch(getProcessorSettings(file_type));
    // dispatch(getSettings(["usage_types"]));
  }

  onError(message) {
    this.props.dispatch(showDanger(message));
  }

  goBack() {
    this.context.router.push({
      pathname: "input_processors"
    });
  }
  
  handleNext() {
    const { stepIndex } = this.state || 0;
    const totalSteps = this.state.steps.length - 1;

    const cb = (err) => {
      if (err) return;
      if (this.state.finished) {
        this.props.dispatch(showSuccess("Input processor saved successfully!"));
        this.goBack();
      } else {
        const totalSteps = this.state.steps.length - 1;
        const finished = (stepIndex + 1) === totalSteps;
        this.setState({
          stepIndex: stepIndex + 1,
          finished
        });
      }
    };

    const finished = (stepIndex + 1) === totalSteps;
    this.setState({
      stepIndex: stepIndex + 1,
      finished
    });

    //const part = this.state.finished ? false : this.state.steps[stepIndex];
    // this.props.dispatch(saveInputProcessorSettings(this.props.settings, cb, part));
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) return this.setState({stepIndex: stepIndex - 1, finished: 0});
    let r = confirm("are you sure you want to stop editing input processor?");
    if (r) {
      this.props.dispatch(clearInputProcessor());
      this.goBack();
    }
  }

  handleCancel() {
    let r = confirm("are you sure you want to stop editing Export Generator?");
    const { dispatch, fileType } = this.props;
    if (r) {
      if (fileType !== true) {
        dispatch(clearInputProcessor());
        this.goBack();
      } else {
        const cb = (err) => {
          if (err) {
            dispatch(showDanger("Please try again"));
            return;
          }
          dispatch(clearInputProcessor());
          this.goBack();
        };
        dispatch(deleteInputProcessor(this.props.settings.get('file_type'), cb));
      }
    }
  }

  render() {
    let { stepIndex } = this.state;
    const { settings, usage_types } = this.props;

    const steps = [
      (<SelectInputProcessor onNext={this.handleNext.bind(this)} settings={settings} />),
      (<Segmentation onNext={this.handleNext.bind(this)} settings={settings} />),
      (<FtpDetials onNext={this.handleNext.bind(this)} settings={settings} />)
    ];

    const { action } = this.props.location.query;
    const title = action === 'new' ? "New export gener" : `Edit input processor - ${settings.get('file_type')}`;
    
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

                <div className="contents bordered-container ">
                  { steps[stepIndex] }
                </div>

              </div>
              <div style={{marginTop: 12, float: "right"}}>
                <button className="btn btn-default"
                        onClick={this.handleCancel}
                        style={{marginRight: 12}}>
                  Cancel
                </button>
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

InputProcessor.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return { settings: state.inputProcessor,
           usage_types: state.settings.get('usage_types') };
}

export default connect(mapStateToProps)(InputProcessor);
