'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _momentMini = require('moment-mini');

var _momentMini2 = _interopRequireDefault(_momentMini);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var tooClose = function tooClose(activity, _activity) {
  return activity.left + activity.width === _activity.left || activity.left === _activity.left + _activity.width;
};

/**
 * Detects whether activities are overlapping
 * @method overlap
 * @param  {ActivityObject} activity
 * @param  {ActivityObject} _activity
 * @return {Boolean}
 */
var overlap = function overlap(activity, _activity) {
  return activity.left <= _activity.left && activity.left + activity.width >= _activity.left + _activity.width || activity.left >= _activity.left && activity.left <= _activity.left + _activity.width;
};

/**
 * Timeline Component
 * @type {Object}
 */

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline() {
    var _ref;

    _classCallCheck(this, Timeline);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call.apply(_ref, [this].concat(args)));

    _this.state = {
      slideIndex: 0,
      isPanning: false,
      positionX: '0px', // this may also be percentage
      positionStart: 0,
      baseX: '0px' // this may also be percentage


      /**
       * Derives data by sorting and reducing incoming props
       * @method calculateData
       * @param  {[type]}      props [description]
       * @return {[type]}            [description]
       */
    };

    _this.onMouseDown = function (e) {
      _this.setState({ isPanning: true, positionStart: e.clientX });
    };

    _this.onTouchStart = function (e) {
      var touch = e.touches[0];
      if (!touch) {
        return;
      }

      _this.setState({ isPanning: true, positionStart: touch.clientX });
    };

    _this.onTouchMove = function (e) {
      if (!_this.state.isPanning) {
        return;
      }

      var touch = e.touches[0];
      if (!touch) {
        return;
      }

      var difference = touch.clientX - _this.state.positionStart;
      _this.setState({ positionX: Math.min(0, _this.state.baseX + difference) + 'px' });
    };

    _this.onTouchEnd = function (e) {
      _this.onMouseOut(e);
    };

    _this.onMouseMove = function (e) {
      if (!_this.state.isPanning) {
        return;
      }

      var rulerWidth = e.currentTarget.getBoundingClientRect().width;

      var max = typeof e.currentTarget.querySelectorAll === 'function' ? Array.from(e.currentTarget.querySelectorAll('.activity')).reduce(function (previous, element) {
        var bounds = element.getBoundingClientRect();
        return Math.max(previous, bounds.left + bounds.width);
      }, 0) : null;

      var baseX = _this.state.baseX.indexOf('%') !== -1 ? Math.round(parseInt(_this.state.baseX, 10) / 100 * rulerWidth) : parseInt(_this.state.baseX, 10);

      var difference = e.clientX - _this.state.positionStart;
      if (max + _this.props.gutter < rulerWidth && baseX + difference < _this.state.positionX) {
        return;
      }

      _this.setState({ positionX: Math.min(0, baseX + difference) + 'px' });
    };

    _this.onMouseUp = function () {
      _this.setState({
        isPanning: false,
        baseX: _this.state.positionX
      });
    };

    _this.toPrevious = function () {
      _this.setState(_this.stateToPrevious);
    };

    _this.stateToPrevious = function (state) {
      var activity = _this.positionedActivities[state.slideIndex - 1];
      var positionX = activity ? -1 * activity.left + '%' : state.positionX;

      return {
        slideIndex: Math.max(0, state.slideIndex - 1),
        positionX: positionX
      };
    };

    _this.toNext = function () {
      _this.setState(_this.stateToNext);
    };

    _this.stateToNext = function (state) {
      var activity = _this.positionedActivities[state.slideIndex + 1];
      var positionX = activity ? -1 * activity.left + '%' : state.positionX;

      return {
        slideIndex: Math.min(_this.positionedActivities.length - 1, state.slideIndex + 1),
        positionX: positionX
      };
    };

    _this.calculateData(_this.props);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.calculateData(nextProps);
    }
  }, {
    key: 'calculateData',
    value: function calculateData(props) {
      var activities = props.activities;


      var currentYear = new Date().getFullYear();

      // Here we will determine all the years to display
      var years = Array.from(new Set(activities.reduce(function (previous, activity) {
        var start = activity.start ? parseInt((0, _momentMini2.default)(activity.start).format('Y'), 10) : currentYear;
        var end = activity.end ? parseInt((0, _momentMini2.default)(activity.end).format('Y'), 10) : currentYear;
        return [].concat(_toConsumableArray(previous), [start, end]);
      }, currentYear))).sort().reduce(function (previous, year) {
        var gap = [];
        var lastYear = Array.from(previous)[previous.length - 1];

        // Detect gaps between years
        var i = year;
        while (i > lastYear) {
          gap.push(i--);
        }

        gap.shift();

        return [].concat(_toConsumableArray(previous), _toConsumableArray(gap.reverse()), [year]);
      }, []).concat([currentYear + 1]).reverse();

      // Here we sort and position activities based on when they start and end
      var positionedActivities = activities.sort(function (a, b) {
        if (a.default === true) {
          return -1;
        } else if (b.default === true) {
          return 1;
        }

        var Astart = (0, _momentMini2.default)(a.start);
        var Aend = a.end ? (0, _momentMini2.default)(a.end) : null;

        var Bstart = (0, _momentMini2.default)(b.start);
        var Bend = b.end ? (0, _momentMini2.default)(b.end) : null;

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
      }).reduce(function (previous, activity) {
        var stop = parseInt((0, _momentMini2.default)(activity.start).format('Y'), 10);
        var start = activity.end ? parseInt((0, _momentMini2.default)(activity.end).format('Y'), 10) : years[0];
        var stopIndex = years.indexOf(stop);
        var startIndex = years.indexOf(start);

        activity.left = startIndex * props.flexBasis;
        activity.width = Math.max(1, stopIndex - startIndex) * props.flexBasis;

        var lineIndexes = previous.filter(function (_activity) {
          return overlap(activity, _activity) || tooClose(activity, _activity);
        }).map(function (_activity) {
          return _activity.row;
        }).sort();

        activity.row = !lineIndexes.length ? 0 : lineIndexes.reduce(function (_previous, row) {
          if (row - _previous === 1) {
            return row;
          }

          return _previous;
        }, -1) + 1;

        activity.top = activity.row * (props.lineHeight + props.gutter);

        return [].concat(_toConsumableArray(previous), [activity]);
      }, []);

      // Determine what size our grid should be

      var _positionedActivities = positionedActivities.reduce(function (previous, value) {
        var top = value.top + props.lineHeight;
        var width = value.left + value.width;
        return [width > previous[0] ? width : previous[0], top > previous[1] ? top : previous[1]];
      }, [0, 0]),
          _positionedActivities2 = _slicedToArray(_positionedActivities, 2),
          maxWidth = _positionedActivities2[0],
          minHeight = _positionedActivities2[1];

      this.years = years;
      this.positionedActivities = positionedActivities;
      this.maxWidth = maxWidth;
      this.minHeight = minHeight;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var minHeight = this.minHeight,
          maxWidth = this.maxWidth,
          positionedActivities = this.positionedActivities,
          years = this.years;


      return _react2.default.createElement(
        'div',
        {
          className: 'timeline' },
        _react2.default.createElement(
          'div',
          { className: 'gallery' },
          _react2.default.createElement('div', {
            onClick: this.toPrevious,
            className: 'previous' + (this.state.slideIndex <= 0 ? ' disabled' : '') }),
          _react2.default.createElement('div', {
            onClick: this.toNext,
            className: 'next' + (this.state.slideIndex >= positionedActivities.length - 1 ? ' disabled' : '')
          }),
          _react2.default.createElement(
            'div',
            {
              className: 'scroller',
              style: {
                left: -1 * this.state.slideIndex * 100 + '%'
              } },
            positionedActivities.map(function (_ref2, index) {
              var body = _ref2.body,
                  image = _ref2.image,
                  name = _ref2.name,
                  moreLink = _ref2.moreLink;

              return _react2.default.createElement(
                'div',
                {
                  className: 'activity' + (_this2.state.slideIndex === index ? ' focus' : ''),
                  key: index },
                _react2.default.createElement(
                  'div',
                  { className: 'container' },
                  image && _react2.default.createElement(
                    'div',
                    { className: 'image' },
                    _react2.default.createElement('img', { src: image })
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'card' },
                    _react2.default.createElement(
                      'h5',
                      null,
                      name
                    ),
                    _react2.default.createElement(
                      'p',
                      null,
                      body
                    ),
                    moreLink && _react2.default.createElement(
                      'a',
                      { className: 'external-link', href: moreLink.url },
                      moreLink.text
                    )
                  )
                )
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
          {
            onTouchStartCapture: this.onTouchStart,
            onTouchMoveCapture: this.onTouchMove,
            onTouchEndCapture: this.onTouchEnd,
            onMouseDownCapture: this.onMouseDown,
            onMouseMoveCapture: this.onMouseMove,
            onMouseUpCapture: this.onMouseUp,
            className: 'browser' },
          _react2.default.createElement(
            'div',
            {
              className: 'ruler',
              style: {
                left: this.state.positionX
              } },
            _react2.default.createElement(
              'div',
              { className: 'plot',
                style: {
                  minHeight: minHeight
                } },
              positionedActivities.map(function (_ref3, index) {
                var name = _ref3.name,
                    top = _ref3.top,
                    left = _ref3.left,
                    width = _ref3.width;

                var style = {
                  position: 'absolute',
                  top: top + 'px',
                  left: left + '%',
                  width: width + '%'
                };

                return _react2.default.createElement(
                  'div',
                  {
                    key: index,
                    className: 'activity' + (_this2.state.slideIndex === index ? ' focus' : ''),
                    style: style,
                    onClick: function onClick() {
                      return _this2.setState({ slideIndex: index });
                    } },
                  _react2.default.createElement(
                    'span',
                    null,
                    name
                  )
                );
              })
            ),
            _react2.default.createElement(
              'div',
              { className: 'markers', style: { minWidth: maxWidth + '%' } },
              years.map(function (year) {
                return _react2.default.createElement(
                  'div',
                  {
                    className: 'marker',
                    style: {
                      flexBasis: _this2.props.flexBasis + '%'
                    },
                    key: year },
                  year
                );
              })
            )
          )
        )
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

Timeline.propTypes = {
  activities: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    image: _propTypes2.default.string,
    body: _propTypes2.default.string.isRequired,
    start: _propTypes2.default.any,
    end: _propTypes2.default.any,
    moreLink: _propTypes2.default.string
  }).isRequired).isRequired,
  flexBasis: _propTypes2.default.number.isRequired,
  lineHeight: _propTypes2.default.number.isRequired,
  gutter: _propTypes2.default.number.isRequired
};
Timeline.defaultProps = {
  flexBasis: 25,
  lineHeight: 45,
  gutter: 3
};
exports.default = Timeline;