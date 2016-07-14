import React from "react";
import { shallow, mount } from "enzyme";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import sinonChai from "sinon-chai";
import ContinuousScroll from "../../src/continuous-scroll";

chai.use(chaiEnzyme());
chai.use(sinonChai);

let wrapper = null,
  data = [["I am the walrus!", "1", "3"]];

describe("Default prop values", function() {

  beforeEach(function() {
    wrapper = mount(<ContinuousScroll height={50} data={data} onChange={function() {}} />);
  });

  it("should set default type if not specified", function() {
    expect(wrapper.props().type).to.equal("none");
  });

  it("should set default speed if not specified", function() {
    expect(wrapper.props().speed).to.equal("medium");
  });

  it("should set default pause if not specified", function() {
    expect(wrapper.props().pause).to.equal(5);
  });

  it("should set default isRefreshing if not specified", function() {
    expect(wrapper.props().isRefreshing).to.equal(false);
  });

  it("should set default onComplete if not specified", function() {
    expect(wrapper.props().onComplete).to.be.a("function");
  });

});

describe("Rendering", function() {

  it("should set height", function() {
    wrapper = shallow(<ContinuousScroll height={50} data={data} onChange={function() {}} />);

    expect(wrapper).to.have.style("height").equal("50px");
  });

  it("should render children", function() {
    wrapper = shallow(
      <ContinuousScroll height={50} data={data} onChange={function() {}}>
        <ul>
          <li>I am the walrus!</li>
          <li>1</li>
          <li>3</li>
        </ul>
      </ContinuousScroll>);

    expect(wrapper.find("ul").children()).to.have.length(3);
  });

});

describe("Data", function() {
  let onChange = null;

  beforeEach(function() {
    onChange = sinon.spy();
    wrapper = mount(<ContinuousScroll height={50} data={data} onChange={onChange} />);
  });

  it("should duplicate the data", function() {
    expect(onChange).to.have.been.calledWith([["I am the walrus!", "1", "3"],
      ["I am the walrus!", "1", "3"]]);
  });

  it("should duplicate the data on a refresh", function() {
    wrapper.setProps({ isRefreshing: true });

    expect(onChange.getCall(1).args[0]).to.deep.equal([['I am the walrus!', '1', '3'],
      ['I am the walrus!', '1', '3']]);
  });
});