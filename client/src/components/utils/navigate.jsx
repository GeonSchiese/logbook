import createBrowserHistory from '../../history';

const navigate = (url) => {
    createBrowserHistory.push(url);
}

export default navigate;