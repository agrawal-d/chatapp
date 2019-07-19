import React from 'react';

function Results(props) {
    if (props.status.focus) {
        return (
            <div>
                <div className="search-result visible">
                    <div className="search-results-list">
                        {props.status.resultElement}
                    </div>
                </div>
            </div >
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default Results;