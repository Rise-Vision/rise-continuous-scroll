/* global TweenLite, TimelineLite, Linear */
import React from "react";
import "gsap";

let tween = null,
  timeline = null;

const ContinuousScroll = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(["none", "continuous", "page"]),
    speed: React.PropTypes.oneOf(["slow", "medium", "fast"]),
    pause: React.PropTypes.number,
    height: React.PropTypes.number.isRequired,
    data: React.PropTypes.array.isRequired,
    isRefreshing: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
    onComplete: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      type: "none",
      speed: "medium",
      pause: 5,
      isRefreshing: false,
      onComplete: function() {}
    };
  },

  componentDidMount: function() {
    if (this.props.type === "continuous") {
      tween = this.createTween();
    }
    else if (this.props.type === "page") {
      timeline = this.createTimeline();
    }

    // Duplicate the data so that there won't be any blank space, and let parent know so that
    // it can update the state.
    // TODO: Only clone as much data as necessary.
    this.props.onChange(this.props.data.concat(this.props.data));
  },

  componentDidUpdate: function () {
    if (this.props.isRefreshing) {
      // Recreate the tween in case the height of the content has changed.
      if (this.props.type === "continuous") {
        tween.progress(0);
        tween = this.createTween();
      }
      else if (this.props.type === "page") {
        timeline.progress(0);
        timeline = this.createTimeline();
      }

      // Duplicate the data so that there won't be any blank space, and let parent know so that
      // it can update the state.
      // TODO: Only clone as much data as necessary.
      this.props.onChange(this.props.data.concat(this.props.data));
    }
  },

  /* Create tween for continuous scrolling. */
  createTween: function() {
    let component = this;

    // Create the tween now that the height of the content is known.
    return TweenLite.to(
      this.refs.content,
      this.getTweenDuration(),
      {
        y: -this.refs[0].offsetHeight,
        delay: this.props.pause,
        ease: Linear.easeNone,
        paused: true,
        onComplete: function() {
          this.pause();
          this.progress(0);
          component.props.onComplete();
        }
      }
    );
  },

  /* Add tweens to a timeline that execute sequentially when scrolling by page. */
  createTimeline: function() {
    let multiplier = 1,
      timeline = new TimelineLite(),
      containerHeight = this.refs.content.offsetHeight,
      contentHeight = this.refs[0].offsetHeight;

    // Add tweens to the timeline. A single tween represents scrolling content from the bottom
    // to the top of the section.
    while (contentHeight > 0) {
      let component = this,
        originalContentHeight = this.refs[0].offsetHeight;

      timeline.add(TweenLite.to(
        this.refs.content,
        this.getTimelineDuration(),
        {
          y: -containerHeight * multiplier,
          delay: this.props.pause,
          ease: Linear.easeNone,
          onUpdateParams: ["{self}"],
          onUpdate: function(tween) {
            if (this._next === null) {
              let element = tween.target;

              // All content has scrolled.
              if (element._gsTransform.y <= -originalContentHeight) {
                // Reset timeline to start, but fast forward past the delay on the first tween.
                this.timeline.pause();
                this.timeline.seek(component.props.pause);
                component.props.onComplete();
              }
            }
          }
        }
      ));

      contentHeight -= containerHeight;
      multiplier++;
    }

    timeline.pause();

    return timeline;
  },

  /* Get the duration of the tween. */
  getTweenDuration: function() {
    let factor;

    switch (this.props.speed) {
      case "slow":
        factor = 30;
        break;
      case "medium":
        factor = 50;
        break;
      case "fast":
        factor = 100;
        break;
      default:
        factor = 50;
    }

    return this.refs[0].offsetHeight / factor;
  },

  /* Get the duration of the timeline. */
  getTimelineDuration: function() {
    let factor;

    switch (this.props.speed) {
      case "slow":
        factor = 30;
        break;
      case "medium":
        factor = 50;
        break;
      case "fast":
        factor = 100;
        break;
      default:
        factor = 50;
    }

    return this.refs.content.offsetHeight / factor;
  },

  play: function() {
    if (tween) {
      tween.play();
    }
    else if (timeline) {
      timeline.play();
    }
  },

  pause: function() {
    if (tween) {
      tween.pause();
    }
    else if (timeline) {
      timeline.pause();
    }
  },

  render: function () {
    return (
      <section className="content" style={{height: this.props.height}} ref="content">
        {React.Children.map(this.props.children, (element, id) => {
          return React.cloneElement(element, { ref: id });
        })}
      </section>
    );
  }
});

export default ContinuousScroll;