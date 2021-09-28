'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.NextArrow = exports.PrevArrow = void 0;

const _react = _interopRequireDefault(require('react'));

const _classnames = _interopRequireDefault(require('classnames'));

const _innerSliderUtils = require('./utils/innerSliderUtils');

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj; }; } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; }; } return _typeof(obj); }

function _extends () { _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function'); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

const PrevArrow = /* #__PURE__ */(function (_React$PureComponent) {
  _inherits(PrevArrow, _React$PureComponent);

  const _super = _createSuper(PrevArrow);

  function PrevArrow () {
    _classCallCheck(this, PrevArrow);

    return _super.apply(this, arguments);
  }

  _createClass(PrevArrow, [{
    key: 'clickHandler',
    value: function clickHandler (options, e) {
      if (e) {
        e.preventDefault();
      }

      this.props.clickHandler(options, e);
    }
  }, {
    key: 'render',
    value: function render () {
      const prevClasses = {
        'slick-arrow': true,
        'slick-prev': true
      };
      let prevHandler = this.clickHandler.bind(this, {
        message: 'previous'
      });

      if (!this.props.infinite && (this.props.currentSlide === 0 || this.props.slideCount <= this.props.slidesToShow)) {
        prevClasses['slick-disabled'] = true;
        prevHandler = null;
      }

      const prevArrowProps = {
        key: '0',
        'data-role': 'none',
        className: (0, _classnames.default)(prevClasses),
        style: {
          display: 'block'
        },
        onClick: prevHandler
      };
      const customProps = {
        currentSlide: this.props.currentSlide,
        slideCount: this.props.slideCount
      };
      let prevArrow;

      if (this.props.prevArrow) {
        prevArrow = /* #__PURE__ */_react.default.cloneElement(this.props.prevArrow, _objectSpread(_objectSpread({}, prevArrowProps), customProps));
      } else {
        prevArrow = /* #__PURE__ */_react.default.createElement('button', _extends({
          key: '0',
          type: 'button'
        }, prevArrowProps), ' ', '');
      }

      return prevArrow;
    }
  }]);

  return PrevArrow;
}(_react.default.PureComponent));

exports.PrevArrow = PrevArrow;

const NextArrow = /* #__PURE__ */(function (_React$PureComponent2) {
  _inherits(NextArrow, _React$PureComponent2);

  const _super2 = _createSuper(NextArrow);

  function NextArrow () {
    _classCallCheck(this, NextArrow);

    return _super2.apply(this, arguments);
  }

  _createClass(NextArrow, [{
    key: 'clickHandler',
    value: function clickHandler (options, e) {
      if (e) {
        e.preventDefault();
      }

      this.props.clickHandler(options, e);
    }
  }, {
    key: 'render',
    value: function render () {
      const nextClasses = {
        'slick-arrow': true,
        'slick-next': true
      };
      let nextHandler = this.clickHandler.bind(this, {
        message: 'next'
      });

      if (!(0, _innerSliderUtils.canGoNext)(this.props)) {
        nextClasses['slick-disabled'] = true;
        nextHandler = null;
      }

      const nextArrowProps = {
        key: '1',
        'data-role': 'none',
        className: (0, _classnames.default)(nextClasses),
        style: {
          display: 'block'
        },
        onClick: nextHandler
      };
      const customProps = {
        currentSlide: this.props.currentSlide,
        slideCount: this.props.slideCount
      };
      let nextArrow;

      if (this.props.nextArrow) {
        nextArrow = /* #__PURE__ */_react.default.cloneElement(this.props.nextArrow, _objectSpread(_objectSpread({}, nextArrowProps), customProps));
      } else {
        nextArrow = /* #__PURE__ */_react.default.createElement('button', _extends({
          key: '1',
          type: 'button'
        }, nextArrowProps), ' ', '');
      }

      return nextArrow;
    }
  }]);

  return NextArrow;
}(_react.default.PureComponent));

exports.NextArrow = NextArrow;
