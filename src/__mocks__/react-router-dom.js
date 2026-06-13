const React = require('react');

// Current path for mock routing
let __currentPath = '/';

// Minimal mock of react-router-dom for tests
const Link = ({ children, to, ...rest }) => React.createElement('a', { href: to, ...rest }, children);

const MemoryRouter = ({ children, initialEntries }) => {
  if (initialEntries && initialEntries.length > 0) {
    __currentPath = initialEntries[0];
  }
  return React.createElement(React.Fragment, null, children);
};

const Routes = ({ children, location }) => {
  if (location) __currentPath = location.pathname || location;
  const routes = React.Children.toArray(children).filter(Boolean);
  const matched = routes.find(route => {
    if (!route || !route.props || !route.props.path) return false;
    // Convert route pattern to regex (handle :params)
    const pattern = route.props.path
      .replace(/:\w+/g, '[^/]+')
      .replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(__currentPath);
  });
  return matched ? matched.props.element : null;
};

const Route = ({ element }) => element || null;

const Navigate = ({ to, replace }) =>
  React.createElement('div', { 'data-testid': 'mock-navigate', 'data-to': to, 'data-replace': replace ? 'true' : 'false' });

const useNavigate = (typeof jest !== 'undefined') ? jest.fn(() => jest.fn()) : () => () => {};
// Expose the first navigate mock so tests can assert on calls
useNavigate._navigateFn = null;

const useParams = () => ({});
const useLocation = () => ({ pathname: __currentPath });

module.exports = {
  Link,
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
  // for tests that do jest.requireActual and spread the module
  default: {
    Link,
    MemoryRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
    useParams,
    useLocation
  }
};
