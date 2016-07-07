import React from "react";
import ReactDOM from "react-dom";
import ContinuousScroll from "../../src/continuous-scroll";

let data = ["First", "I am the walrus", "I am the walrus", "I am the walrus", "I am the walrus",
  "I am the walrus", "I am the walrus", "I am the walrus", "I am the walrus", "I am the walrus",
  "I am the walrus", "Last"];

const Continuous = React.createClass({
  getInitialState: function() {
    return {
      data: data
    };
  },
  componentDidMount: function() {
    this.refs.scroll.play();
  },

  handleChange: function(newData) {
    this.setState({ data: newData });
  },

  handleComplete: function() {
    window.dispatchEvent(new Event("handleComplete"));
  },

  render: function () {
    return (
      <ContinuousScroll type={"continuous"} speed={"medium"} pause={2} height={200} data={this.state.data}
        onChange={this.handleChange} onComplete={this.handleComplete} ref="scroll">
        <ul>
          {this.state.data.map((item, index) =>
            <li key={index}>{item}</li>
          )}
        </ul>
      </ContinuousScroll>
    );
  }
});

ReactDOM.render(<Continuous />, document.getElementById("continuous"));