/**
 * 
 */
window.addEventListener("load", function () {    
    class Welcome extends React.Component {
        constructor(props){
            super(props)
            this.state = {
                time: null
            };
            
            var self = this;
            $NS$.handlers.react = function (d) {
                self.setState({time: d.time});
            }
        }
        render() {
            return this.state.time ? 
                React.createElement('h1', null, 'Hi, it\'s ' + this.state.time + ' and sorry but'+ this.props.message + '!')
                :
                null
        }
    }
    ReactDOM.render(
        React.createElement(Welcome, { message: ' ... cant`t wait for You!' }),
        document.getElementById('app')
    );
});

