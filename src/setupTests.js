const React = require('react');
const PropTypes = require('prop-types');
const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream } = require('stream/web');
const { MessageChannel, MessagePort } = require('worker_threads');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
global.MessageChannel = MessageChannel;
global.MessagePort = MessagePort;

// Compatibility for old libraries such as sweetalert-react
React.PropTypes = PropTypes;

const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });
