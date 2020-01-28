import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    FormGroup
} from 'semantic-ui-react'


const SearchInput = (props) => {
    return (
        <Form onSubmit={props.onSubmit}>
            <FormGroup>
                <Form.Input
                    name='search'
                    className='search'
                    placeholder='search'
                    value={props.search}
                    onChange={props.onChange}
                />
                <Form.Button type='submit'>Search</Form.Button>
            </FormGroup>
        </Form>
    )
}

SearchInput.propTypes = {
    search: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
};

SearchInput.defaultProps = {
    search: PropTypes.string,
    onChange: undefined,
    onSubmit: undefined
};

export default SearchInput;