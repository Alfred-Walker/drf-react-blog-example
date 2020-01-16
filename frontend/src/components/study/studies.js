import React, { Component } from 'react';
import { Button, Divider, Grid, Header, Label, List, Segment } from 'semantic-ui-react';
import { getJwt } from '../helpers/jwt';
import TagsInput from 'react-tagsinput';
import './studies.css';
import ReactQuill from 'react-quill';


class Studies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            studyList: undefined,
            tags: [],
            suggestions: []
        }

        this.tagsInputProps = {
            className: 'react-tagsinput-input',
            placeholder: ''
          }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(tags) {
        this.setState({ tags });
    }

    componentDidMount() {
        let headers = {};
        const jwt = getJwt();

        if (jwt) {
            headers = { 
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        const studyListUrl = this.props.studyListUrl;

        fetch(
            studyListUrl, {
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
                    this.setState({
                        studyList: result
                    });
                }
            )
            .then(
                console.log(this.state)
            )
            .catch(
                // TODO: need better catch.
                err => {
                    console.log("studies error");
                    console.log(err);
                    this.props.history.push('/');
                }
            );
    }

    // quill editor without toolbar
    modules = {
        toolbar: false,
        clipboard: { matchVisual: false }
      };

    render() {
        if (this.state.studyList === undefined) {
            return (
                <div><h1>No studies found...</h1></div>
            );
        }

        return (
            <Grid centered columns={1} doubling> {
                this.state.studyList.results.map(study =>
                    <Grid.Column key={study.id}>
                        <Segment>
                            <Header as="h1">
                                {study.title}{study.is_public ? "" : <Label className="ui horizontal red">Private</Label>}
                            </Header>
                            <Divider />
                            <ReactQuill 
                                modules={this.modules}
                                value={study.body} 
                                readOnly={true}
                                theme={"snow"}
                            />
                            <p>
                            {study.registered_date}
                            </p>
                            <p>{study.excerpt}</p>
                            <List className="list-tag-horizontal">
                                <TagsInput in
                                disabled={true} 
                                value={study.tags}
                                inputProps={this.tagsInputProps}
                                />
                            </List>
                            <Button primary basic as="a" href="/">See all</Button>
                            <Button primary basic as="a" href="/">Edit</Button>
                        </Segment>
                    </Grid.Column>
                )
            }
            </Grid>
        )
    }
}

export default Studies;
