import React, {
    Component
} from 'react';
import {
    Badge,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButton
} from 'reactstrap';

import axios from 'axios';
import LastProcess from './LastProcess';
import Loading from 'react-loading-bar';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: [],
            nb_result: "",
            searchFieldValue: "",
            errorCheck:true,
            warningCheck:true,
            successCheck:true,
        };
    }

	onShow() {
    	this.setState({ show: true })
  	}

  	onHide() {
    	this.setState({ show: false })
  	}

    performElasticQuery(query) {
        this.onShow()
        console.log(query)
        if (query != '') {
        	var theQuery = ""
        	if (query.substring(0,4).indexOf("AND") !== -1) {
        		theQuery = 'type:flux ' + query
        	} else {
        		theQuery = 'type:flux AND ' + query
        	}
            axios.post(`http://lgc-sandbox-dev:9200/console/_search`, {
                    version: true,
                    size: 50,
                    sort: [{
                        ts_cre: {
                            order: 'desc',
                            unmapped_type: 'boolean'
                        }
                    }],
                    query: {
                        bool: {
                            must: [{
                                    query_string: {
                                        query: theQuery,
                                        analyze_wildcard: true,
                                        default_field: '*'
                                    }
                                }
                            ],
                        }
                    }
                })
                .then(res => {
                    const results = res.data.hits.hits.map(obj => obj._source);
                    this.setState({
                        results : results,
                        nb_result : res.data.hits.total
                    });
                    this.onHide()
                });
        } else {
            axios.post(`http://lgc-sandbox-dev:9200/console/_search`, {
                    version: true,
                    size: 50,
                    sort: [{
                        ts_cre: {
                            order: 'desc',
                            unmapped_type: 'boolean'
                        }
                    }],
                    query: {
                        bool: {
                            must: [{
                                    query_string: {
                                        query: 'type:flux',
                                        analyze_wildcard: true,
                                        default_field: '*'
                                    }
                                }
                            ],
                        }
                    }
                })
                .then(res => {
                    const results = res.data.hits.hits.map(obj => obj._source);
                    this.setState({
                        results : results,
                        nb_result : res.data.hits.total
                    });
                    this.onHide()
                });
        }
    }
    
    updateWarningCheck() {
    	if (this.state.warningCheck == true) {
    		this.setState({warningCheck : false})
    	} else {
    		this.setState({warningCheck : true})
    	}
    	this.buildAndPerformElasticQuery()
    }

    updateSuccessCheck() {
    	if (this.state.successCheck == true) {
    		this.setState({successCheck : false})
    	} else {
    		this.setState({successCheck : true})
    	}
    	this.buildAndPerformElasticQuery()
    }

    updateErrorCheck() {
    	if (this.state.errorCheck == true) {
    		this.setState({errorCheck : false})
    	} else {
    		this.setState({errorCheck : true})
    	}
    	this.buildAndPerformElasticQuery()
    }

    updateSearchFieldValue(value) {
    	if (value != '') {
    		this.setState({searchFieldValue:value})
    	}
    }

    buildAndPerformElasticQuery() {
    	var addToQuery = ''
    	console.log("Success : " + this.state.successCheck + "    Warning : " + this.state.warningCheck + "     Error : " + this.state.errorCheck)
    	if (this.state.warningCheck == true) {
    		addToQuery = addToQuery + ' AND sta_flu:A '
    	}
		if (this.state.successCheck == true) {
    		addToQuery = addToQuery + ' AND sta_flu:S '
    	}
    	if (this.state.errorCheck == true) {
    		addToQuery = addToQuery + ' AND sta_flu:E '
    	}
    	console.log(addToQuery)
    	this.performElasticQuery(this.state.searchFieldValue + addToQuery)
    }

    componentDidMount() {
        this.performElasticQuery('');
    }

    renderStaFlu(sta_flu) {
        if (sta_flu == 'S') {
            return (<td><Badge color="success">{ "Succes" }</Badge></td>)
        } else if (sta_flu == 'A') {
            return (<td><Badge color="warning"><b>{ "Avertissement" }</b></Badge></td>)
        } else {
            return (<td><Badge color="danger"><b>{ "Erreur" }</b></Badge></td>)
        }
    }

    renderRAIColumn(gln_flu, rai_soc) {
        if (rai_soc != null) {
            return (rai_soc)
        } else {
            return (gln_flu)
        }
    }

    render() {
        return (
      <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="12">
            <Card>
              <CardHeader>
              	<Loading show={this.state.show} color="red"/>
                <small>Recherche</small> 
                <strong>Flux</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="12">
                      <InputGroup>
                        <InputGroupAddon><i className="icon-magnifier"></i></InputGroupAddon>
                        <Input type="text" id="input1-group1" name="input1-group1" placeholder="Search" onChange={(event) => this.updateSearchFieldValue(event.target.value) }/>
                      </InputGroup>
                    </Col>
                </Row>
                <Row/>
                <Row>
                  <Col md="2">
                    <FormGroup>
                      <Label htmlFor="ccmonth">Month</Label>
                      <Input type="select" name="ccmonth" id="ccmonth">
                        <option value="1">Janvier</option>
                        <option value="2">Février</option>
                        <option value="3">Mars</option>
                        <option value="4">Avril</option>
                        <option value="5">Mai</option>
                        <option value="6">Juin</option>
                        <option value="7">Juillet</option>
                        <option value="8">Aout</option>
                        <option value="9">Septembre</option>
                        <option value="10">Octobre</option>
                        <option value="11">Novembre</option>
                        <option value="12">Décembre</option>
                      </Input>
                    </FormGroup>
                    </Col>
                    <Col md="5">
                    <Label>Statut</Label><br/>
                      <FormGroup check className="form-check-inline">
                        <Label check htmlFor="inline-checkbox1">
                          <Input type="checkbox" id="inline-checkbox1" name="inline-checkbox1" defaultChecked={true} onChange={(event) => this.updateSuccessCheck() }/> Success
                        </Label>
                        {' '}
                        <Label check htmlFor="inline-checkbox2">
                          <Input type="checkbox" id="inline-checkbox2" name="inline-checkbox2" defaultChecked={true} onChange={(event) => this.updateWarningCheck() }/> Avertissement
                        </Label>
                        {' '}
                        <Label check htmlFor="inline-checkbox3">
                          <Input type="checkbox" id="inline-checkbox3" name="inline-checkbox3" defaultChecked={true} onChange={(event) => this.updateErrorCheck() }/> Erreur
                        </Label>
                      </FormGroup>
                    </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="success" onClick={ () => this.buildAndPerformElasticQuery() }><i className="fa fa-dot-circle-o"></i> Submit</Button>  
              </CardFooter>
            </Card>
          </Col>
          </Row>
          <Row>
        <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>Flux : { this.state.nb_result } résultats
              </CardHeader>
              <CardBody>
      		  	<Table responsive striped>
                  <thead>
                  <tr>
                    <th>Flux ID</th>
                    <th>Type </th>
                    <th>Emetteur</th>
                    <th>Destinataire</th>
                    <th>Reference</th>
                    <th>Creation</th>
                    <th>Dernier Traitement</th>
                    <th>Statut</th>
                  </tr>
                  </thead>
                  <tbody>
                  { // 
                  	this.state.results.map(result =>
            			<tr key={result.num_flu}>
            				<td>{ (result.sta_flu == 'S') ? result.id_flu : <b> { result.id_flu } </b> }</td>
            				<td>{ (result.sta_flu == 'S') ? result.typ_flu : <b> { result.typ_flu } </b> }</td>
            				<td>{ (result.sta_flu == 'S') ? this.renderRAIColumn(result.eme_flu, result.rai_soc_eme) : <b> { this.renderRAIColumn(result.eme_flu, result.rai_soc_eme) } </b> }</td>
            				<td>{ (result.sta_flu == 'S') ? this.renderRAIColumn(result.des_flu, result.rai_soc_des) : <b> { this.renderRAIColumn(result.des_flu, result.rai_soc_des) } </b> }</td>
            				<td>{ (result.sta_flu == 'S') ? result.ref_flu : <b> { result.ref_flu } </b> }</td>
            				<td>{ (result.sta_flu == 'S') ? new Date(result.ts_cre).toLocaleString() : <b> { new Date(result.ts_cre).toLocaleString() } </b> }</td>
            				<td>{ (result.sta_flu == 'S') ? <LastProcess flux={result.num_flu}/> : <b><LastProcess flux={result.num_flu}/></b> }</td>
            				{this.renderStaFlu(result.sta_flu)}
            			</tr>
          			)
                  }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          </Row>
      </div>
        )
    }
}

export default Dashboard;