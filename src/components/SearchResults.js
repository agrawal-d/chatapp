import React from 'react';
import Results from './Results';
const axios = require('axios');

class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.state = {
            query: "",
            visible: false,
            result: "",
            id: "search-input",
            resultElement: <span>Press enter to search, and only an exact match will appear for privacy.</span>
        };
    }

    handleBlur() {
        this.setState({
            focus: false,
            query: ""
        })
    }

    handleFocus() {
        this.setState({
            focus: true,
        })
    }

    handleInputChange(e) {
        this.setState({
            query: e.target.value
        })
    }


    handleSubmit(e) { // For new chat search
        if (e.keyCode === 13) {
            this.props.handleToast("Searching", 2000);
            const query = this.state.query;
            axios.post(`${this.props.globalSettings.serverRoot}my-chats/search`, {
                query: query,
                people: this.props.people,
                withCredentials: true
            }, {
                    withCredentials: true
                }).then((response) => {
                    this.props.handleSearchResult(response)
                }).catch((error) => {
                    console.error("Searching", error)
                })
            this.setState({
                query: ""
            })
        }
    }

    render() {
        return (
            <div>
                <input className="theme-btn chat-search" placeholder="Search for people" onChange={this.handleInputChange} onKeyUp={this.handleSubmit} value={this.state.query} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <Results status={this.state} maxLength={64} />
            </div>
        )
    }
}

export default SearchResults;