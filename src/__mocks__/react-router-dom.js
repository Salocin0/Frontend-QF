const React = require('react');

// Minimal mock of react-router-dom for tests
const Link = ({ children, to, ...rest }) => React.createElement('a', { href: to, ...rest }, children);
const MemoryRouter = ({ children }) => React.createElement(React.Fragment, null, children);
const Routes = ({ children }) => React.createElement(React.Fragment, null, children);
const Route = ({ element }) => element || null;

const useNavigate = (typeof jest !== 'undefined') ? jest.fn() : () => {};

const useParams = () => ({});
const useLocation = () => ({ pathname: '/' });

module.exports = {
  Link,
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
  // for tests that do jest.requireActual and spread the module
  default: {
    Link,
    MemoryRouter,
    Routes,
    Route,
    useNavigate,
    useParams,
    useLocation
  }
};