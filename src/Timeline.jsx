import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';

/**
 * @typedef {Object} ActivityObject
 */

/**
 * Decides whether activities are side by side
 * @method tooClose
 * @param  {ActivityObject} activity
 * @param  {ActivityObject} _activity
 * @return {Boolean}
 */
const tooClose = (activity, _activity) => {
  return (activity.left + activity.width === _activity.left) ||
         (activity.left === _activity.left + _activity.width);
};

/**
 * Detects whether activities are overlapping
 * @method overlap
 * @param  {ActivityObject} activity
 * @param  {ActivityObject} _activity
 * @return {Boolean}
 */
const overlap = (activity, _activity) => {
  return (activity.left <= _activity.left && activity.left + activity.width >= _activity.left + _activity.width) ||
         (activity.left >= _activity.left && activity.left <= _activity.left + _activity.width);
};

/**
 * Timeline Component
 * @type {Object}
 */
export default class Timeline extends React.Component {
  static propTypes = {
    activities: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        body: PropTypes.string.isRequired,
        start: PropTypes.any,
        end: PropTypes.any,
        moreLink: PropTypes.string
      }).isRequired
    ).isRequired,
    flexBasis: PropTypes.number.isRequired,
    lineHeight: PropTypes.number.isRequired,
    gutter: PropTypes.number.isRequired,
  }

  static defaultProps = {
    flexBasis: 25,
    lineHeight: 45,
    gutter: 3
  }

  constructor(...args) {
    super(...args);
    this.calculateData(this.props);
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateData(nextProps);
  }

  state = {
    slideIndex: 0,
    isPanning: false,
    positionX: '0px', // this may also be percentage
    positionStart: 0,
    baseX: '0px' // this may also be percentage
  }

  /**
   * Derives data by sorting and reducing incoming props
   * @method calculateData
   * @param  {[type]}      props [description]
   * @return {[type]}            [description]
   */
  calculateData(props) {
    const { activities } = props;

    const currentYear = (new Date()).getFullYear();

    // Here we will determine all the years to display
    const years = Array.from(
      new Set(
        activities.reduce((previous, activity) => {
          const start = activity.start ? parseInt(moment(activity.start).format('Y'), 10) : currentYear;
          const end = activity.end ? parseInt(moment(activity.end).format('Y'), 10) : currentYear;
          return [
            ...previous,
            start,
            end
          ];
        }, currentYear)
    )).sort().reduce((previous, year) => {
      const gap = [];
      const lastYear = Array.from(previous)[previous.length - 1];

      // Detect gaps between years
      let i = year;
      while (i > lastYear) {
        gap.push(i--);
      }

      gap.shift();

      return [
        ...previous,
        ...gap.reverse(),
        year
      ];
    }, []).concat([currentYear + 1]).reverse();

    // Here we sort and position activities based on when they start and end
    const positionedActivities = activities.sort((a, b) => {
      if (a.default === true) {
        return -1;
      } else if (b.default === true) {
        return 1;
      }

      const Astart = moment(a.start);
      const Aend = a.end ? moment(a.end) : null;

      const Bstart = moment(b.start);
      const Bend = b.end ? moment(b.end) : null;

      if (!Bend && !Aend) {
        if (Astart === Bstart) {
          return 0;
        }

        return Astart > Bstart ? -1 : 1;
      } else if (Aend && !Bend) {
        return 1;
      } else if (Bend && !Aend) {
        return -1;
      }

      return Astart > Bstart ? -1 : 1;
    }).reduce((previous, activity) => {
      const stop = parseInt(moment(activity.start).format('Y'), 10);
      const start = activity.end ? parseInt(moment(activity.end).format('Y'), 10) : years[0];
      const stopIndex = years.indexOf(stop);
      const startIndex = years.indexOf(start);

      activity.left = startIndex * props.flexBasis;
      activity.width = Math.max(1, stopIndex - startIndex) * props.flexBasis;

      const lineIndexes = previous
        .filter(_activity => overlap(activity, _activity) || tooClose(activity, _activity))
        .map(_activity => _activity.row).sort();

      activity.row = !lineIndexes.length ? 0 : lineIndexes.reduce((_previous, row) => {
        if (row - _previous === 1) {
          return row;
        }

        return _previous;
      }, -1) + 1;

      activity.top = activity.row * (props.lineHeight + props.gutter);

      return [
        ...previous,
        activity
      ];
    }, []);

    // Determine what size our grid should be
    const [ maxWidth, minHeight ] = positionedActivities.reduce((previous, value) => {
      const top = value.top + props.lineHeight;
      const width = value.left + value.width;
      return [
        width > previous[0] ? width : previous[0],
        top > previous[1] ? top : previous[1]
      ];
    }, [0, 0]);

    this.years = years;
    this.positionedActivities = positionedActivities;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
  }

  onMouseDown = (e) => {
    this.setState({ isPanning: true, positionStart: e.clientX });
  }

  onTouchStart = (e) => {
    const touch = e.touches[0];
    if (!touch) {
      return;
    }

    this.setState({ isPanning: true, positionStart: touch.clientX });
  }

  onTouchMove = (e) => {
    if (!this.state.isPanning) {
      return;
    }

    const touch = e.touches[0];
    if (!touch) {
      return;
    }

    const difference = touch.clientX - this.state.positionStart;
    this.setState({ positionX: Math.min(0, this.state.baseX + difference) + 'px' });
  }

  onTouchEnd = (e) => {
    this.onMouseOut(e);
  }

  onMouseMove = (e) => {
    if (!this.state.isPanning) {
      return;
    }

    const rulerWidth = e.currentTarget.getBoundingClientRect().width;

    const max = typeof e.currentTarget.querySelectorAll === 'function'
      ? Array.from(e.currentTarget.querySelectorAll('.activity')).reduce((previous, element) => {
        const bounds = element.getBoundingClientRect();
        return Math.max(previous, bounds.left + bounds.width);
      }, 0) : null;

    const baseX =
      this.state.baseX.indexOf('%') !== -1
        ? Math.round((parseInt(this.state.baseX, 10) / 100) * rulerWidth)
        : parseInt(this.state.baseX, 10);

    const difference = e.clientX - this.state.positionStart;
    if (
      max + this.props.gutter < rulerWidth &&
      baseX + difference < this.state.positionX
    ) {
      return;
    }

    this.setState({ positionX: Math.min(0, baseX + difference) + 'px' });
  }

  onMouseUp = () => {
    this.setState({
      isPanning: false,
      baseX: this.state.positionX
    });
  }

  toPrevious = () => {
    this.setState(this.stateToPrevious);
  }

  stateToPrevious = (state) => {
    const activity = this.positionedActivities[state.slideIndex - 1];
    const positionX = activity ? -1 * activity.left + '%' : state.positionX;

    return {
      slideIndex: Math.max(0, state.slideIndex - 1),
      positionX
    };
  };

  toNext = () => {
    this.setState(this.stateToNext);
  }

  stateToNext = (state) => {
    const activity = this.positionedActivities[state.slideIndex + 1];
    const positionX = activity ? -1 * activity.left + '%' : state.positionX;

    return {
      slideIndex: Math.min(this.positionedActivities.length - 1, state.slideIndex + 1),
      positionX
    };
  };


  render()  {
    const {
      minHeight,
      maxWidth,
      positionedActivities,
      years
    } = this;


    return (
      <div
        className="timeline">
        <div className="gallery">
          <div
            onClick={this.toPrevious}
            className={`previous${this.state.slideIndex <= 0 ? ' disabled' : ''}`} />
          <div
            onClick={this.toNext}
            className={`next${this.state.slideIndex >= positionedActivities.length - 1 ? ' disabled' : ''}`}
          />
          <div
            className="scroller"
            style={{
              left: (-1 * this.state.slideIndex * 100) + '%'
            }}>
            {positionedActivities.map(({ body, image, name, moreLink }, index) => {
              return (
                <div
                  className={'activity' + (this.state.slideIndex === index ? ' focus' : '')}
                  key={index}>
                  <div className="container">
                    {image && (
                      <div className="image">
                        <img src={image} />
                      </div>
                    )}
                    <div className="card">
                      <h5>{name}</h5>
                      <p>{body}</p>
                      {moreLink && (
                        <a className="external-link" href={moreLink.url}>{moreLink.text}</a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          onTouchStartCapture={this.onTouchStart}
          onTouchMoveCapture={this.onTouchMove}
          onTouchEndCapture={this.onTouchEnd}
          onMouseDownCapture={this.onMouseDown}
          onMouseMoveCapture={this.onMouseMove}
          onMouseUpCapture={this.onMouseUp}
          className="browser">
          <div
            className="ruler"
            style={{
              left: (this.state.positionX)
            }}>
            <div className="plot"
              style={{
                minHeight: minHeight
              }}>
              {positionedActivities.map(({ name, top, left, width }, index) => {
                const style = {
                  position: 'absolute',
                  top: top + 'px',
                  left: left + '%',
                  width: width + '%'
                };

                return (
                  <div
                    key={index}
                    className={'activity' + (this.state.slideIndex === index ? ' focus' : '')}
                    style={style}
                    onClick={() => this.setState({ slideIndex: index })}>
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>
            <div className="markers" style={{ minWidth: maxWidth + '%' }}>
              {years.map(year => (
                <div
                  className="marker"
                  style={{
                    flexBasis: this.props.flexBasis + '%'
                  }}
                  key={year}>
                  {year}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
