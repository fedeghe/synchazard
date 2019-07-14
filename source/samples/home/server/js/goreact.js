/**
 *
 */
window.addEventListener('load', function () {
    // eslint-disable-next-line no-undef
    class Welcome extends React.Component {
        constructor (props) {
            // eslint-disable-next-line no-this-before-super
            super(props);
            // eslint-disable-next-line vars-on-top
            var self = this;
            this.state = {
                time: null
            };
            maltaV('NS').handlers.react = function (d) {
                self.setState({
                    time: d.time
                });
            };
        }

        render () {
            // eslint-disable-next-line react/destructuring-assignment
            return this.state.time
                // eslint-disable-next-line react/destructuring-assignment, no-undef, react/prop-types
                ? React.createElement('h1', null, `Hi, it's ${this.state.time}, definitely time to ${this.props.message}!`)
                : null;
        }
    }
    // eslint-disable-next-line no-undef
    ReactDOM.render(
        // eslint-disable-next-line no-undef
        React.createElement(Welcome, { message: ' ... move forward' }),
        document.getElementById('app')
    );
});
