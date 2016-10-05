import React, { Component } from 'react';

import Templates from '../../Templates';

export default class SelectTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: "predefined",
      template: Object.keys(Templates)[0]
    };
  }

  onCheck = (e) => {
    const { value } = e.target;
    this.setState({selected: value});
  };

  onSelectTemplate = (e) => {
    const { value } = e.target;
    this.setState({template: value});
  };

  handleCancel = () => {
    this.context.router.push({
      pathname: 'input_processors'
    });
  };

  handleNext = () => {
    const { selected, template } = this.state;
    const query = selected === "predefined" ? {action: "new", template} : {action: "new"};
    this.context.router.push({
      pathname: 'input_processor',
      query
    });
  };
  
  render() {
    const { selected, template } = this.state;

    const template_options = Object.keys(Templates).map((type, idx) => (
      <option value={type} key={idx}>{type}</option>
    ));

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <span>Create new input processor</span>
            </div>
            <div className="panel-body">
              <form className="form-horizontal">
                <div className="form-group">
                  <div className="col-lg-3 col-md-4">
                    <input type="radio"
                           name="select-template"
                           value="predefined"
                           checked={true}
                           onChange={this.onCheck} />I will use predefined input processor
                  </div>
                  <div className="col-lg-9 col-md-9">
                    <select className="form-control"
                            value={template}
                            onChange={this.onSelectTemplate}
                            disabled={selected !== "predefined"}>
                      { template_options }
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-3 col-md-4">
                    <input type="radio"
                           name="select-template"
                           value="manual"
                           onChange={this.onCheck} />I will configure a custom input processor
                  </div>
                </div>
                <div style={{marginTop: 12, float: "right"}}>
                  <button className="btn btn-default"
                          type="button"
                          onClick={this.handleCancel}
                          style={{marginRight: 12}}>
                    Cancel
                  </button>
                  <button className="btn btn-primary"
                          type="button"
                          disabled={!selected}
                          onClick={this.handleNext}>
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SelectTemplate.contextTypes = {
  router: React.PropTypes.object.isRequired
};
