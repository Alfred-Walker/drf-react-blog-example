import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Header,
    List,
    Pagination,
} from 'semantic-ui-react'

import * as Utils from '../utils/jwt';


function TitleList(props) {
    const [list, setList] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(1);

    const loadItemsFromServer = (urlWithoutPage, page, callbackOnSuccess, callbackOnError) => {
        let headers = {};
        const jwt = Utils.getJwt();

        if (jwt) {
            headers = {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        fetch(
            urlWithoutPage + "&page=" + page, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        }
        )
            .then(
                response => (response.json())
            )
            .then(
                result => {
                    callbackOnSuccess(result);
                }
            )
            .catch(
                // TODO: need better catch.
                err => {
                    callbackOnError();
                }
            );
    }

    const onPageChange = (e, pageInfo) => {
        setActivePage(pageInfo.activePage);
        loadItemsFromServer(props.url, pageInfo.activePage, onListLoadSuccess, onListLoadFailure);
    }

    const onListLoadSuccess = (result) => {
        if (result) {
            console.log(result)
            setList(result.results);
            setPageCount(Math.ceil(result.count / props.perPageCount))
        }
    }

    const onListLoadFailure = () => {
        // console.log("onListLoadFailure");
    }

    // similar to componentDidMount & componentDidUpdate of class components
    useEffect(() => {
        function fetchData() {
            loadItemsFromServer(props.url, activePage, onListLoadSuccess, onListLoadFailure);
        }

        fetchData();
    }, []);

    return (
        <div>
            <Header as='h3'>{props.header}</Header>
            
            <List divided relaxed>
            {
                list && list.length != 0 ?
                list.map((item, index) =>
                        <List.Item key={index} as={Link} to={props.itemPath + item.id}>
                            <List.Icon name={props.icon} size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header as='a'>{item.title}</List.Header>
                                <List.Description as='a'>{item.registered_date}</List.Description>
                            </List.Content>
                        </List.Item>
                )
                : "No items found..."
            }
            </List>

            <Pagination
                            className='pagination'
                            activePage={activePage}
                            onPageChange={onPageChange}
                            totalPages={pageCount}
                            ellipsisItem={null}
                        />
        </div>
    )
}

TitleList.propTypes = {
    url: PropTypes.string,
    itemPath: PropTypes.string,
    perPageCount: PropTypes.number,
    header: PropTypes.string,
    icon: PropTypes.string
};

TitleList.defaultProps = {
    url: undefined,
    itemPath: "/",
    perPageCount: 10,
    header: "List Items",
    icon: "file alternate"
};

export default TitleList;
