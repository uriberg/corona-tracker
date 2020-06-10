import sortBy from 'lodash.sortby';
import map from 'lodash/map';
import React, {Component} from 'react';
import Table from 'semantic-ui-react/dist/commonjs/collections/Table';
import axios from 'axios';
import Spinner from '../components/UI/Spinner';


interface AllProps {
    filter: boolean
    continent?: string
}

class CoronaTable extends Component<AllProps> {
    state = {
        column: null,
        data: [],
        direction: null,
        continent: this.props.continent,
        loading: true
    };

    componentDidMount(): void {
        console.log(this.state.continent);
        console.log(this.props.filter);
        //this.init();
        this.getStats();
    }


    componentDidUpdate(prevProps: Readonly<AllProps>): void {
        console.log('table has been updated!');
        if (prevProps.continent !== this.props.continent) {
            this.setState({continent: this.props.continent, loading: true});
            this.getStats();
        }
    }

    getStats = () => {
        axios.all([
            axios.get('https://disease.sh/v2/countries?yesterday=false'),
            axios.get('https://corona.lmao.ninja/v2/countries?yesterday=true')
        ])
            .then(responseArr => {
                //this will be executed only when all requests are complete
                const today = this.getTodayStats(responseArr[0]);
                const yesterday = this.getYesterday(responseArr[1]);
                this.combineStats(today, yesterday);
            });
    }

    getTodayStats = (response) => {
        let temp = response.data;
        let result = [];
        for (let i = 0; i < temp.length; i++) {
            console.log(this.props.filter);
            if (this.props.continent === undefined || !this.props.filter || (this.props.filter && (this.props.continent.localeCompare(temp[i].continent) === 0))) {
                temp[i].activeChange = "";
                result.push(temp[i]);
            }
        }
        return result;
    }

    getYesterday = (response) => {
        let yesterday = [];
        for (let i = 0; i < response.data.length; i++) {
            if (this.state.continent === undefined || !this.props.filter || (this.props.filter && (this.props.continent!.localeCompare(response.data[i].continent!) === 0))) {
                yesterday.push(response.data[i]);
            }
        }
        return yesterday;
    }

    combineStats = (today, yesterday) => {
        //move to further calculation
        for (let i = 0; i < today.length; i++) {
            if (today[i].country !== yesterday[i].country) {
                today.splice(i, 1);
            }
        }

        //move to further calculation
        for (let i = 0; i < today.length; i++) {
            if (today[i].active === 0 && yesterday[i].active === 0) {
                today[i].activeChange = 0;
            } else {
                today[i].activeChange = +(today[i].active / yesterday[i].active * 100 - 100).toFixed(2);
            }
        }

    //after all calculations
        this.setSort(today, this.state.direction, this.state.column);
    }

    handleSort = (clickedColumn: any) => () => {
        const {column, data, direction} = this.state;
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: sortBy(data, [clickedColumn]),
                direction: 'ascending',
            });

            return
        }

        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    setSort = (data, direction, clickedColumn) => {
        if (clickedColumn) {
            let temp = sortBy(data, [clickedColumn]);
            if (direction === 'descending') {
                temp.reverse();
            }
            window.setTimeout(() => {
                this.setState({
                    data: temp,
                    direction: direction === 'ascending' ? 'ascending' : 'descending',
                    loading: false
                });
            }, 400);
        } else {
            window.setTimeout(() => {
                this.setState({
                    data: data,
                    loading: false
                });
            }, 400);
        }
    };

    render() {
        const {column, data, direction} = this.state;

        return (
            <>
                <div className={['spin', this.state.loading ? 'fadeIn' : 'fadeOut'].join(' ')}>
                    <Spinner/>
                </div>
                <div className={["table-wrapper", !this.state.loading ? 'fadeIn' : 'fadeOut'].join(' ')}>
                    <table className="ui single line celled unstackable bottom attached table sortable Flip">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={column === 'country' ? direction : null}
                                    onClick={this.handleSort('country')}
                                    className="table-header__cell"
                                >
                                    Name
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'cases' ? direction : null}
                                    onClick={this.handleSort('cases')}
                                    className="table-header__cell"
                                >
                                    Total <br/>Cases
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'todayCases' ? direction : null}
                                    onClick={this.handleSort('todayCases')}
                                    className="table-header__cell"
                                >
                                    New <br/>Cases
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'deaths' ? direction : null}
                                    onClick={this.handleSort('deaths')}
                                    className="table-header__cell"
                                >
                                    Total <br/>Deaths
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'active' ? direction : null}
                                    onClick={this.handleSort('active')}
                                    className="table-header__cell"
                                >
                                    Active<br/>Cases
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'activeChange' ? direction : null}
                                    onClick={this.handleSort('activeChange')}
                                    className="table-header__cell"
                                >
                                    Active Cases <br/> Change
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {map(data, ({country, cases, todayCases, deaths, active, activeChange}) => (
                                <Table.Row key={country}>
                                    <Table.Cell><a href={`/country/` + country}>{country}</a></Table.Cell>
                                    <Table.Cell>{cases}</Table.Cell>
                                    <Table.Cell>{todayCases}</Table.Cell>
                                    <Table.Cell>{deaths}</Table.Cell>
                                    <Table.Cell>{active}</Table.Cell>
                                    <Table.Cell>{activeChange + "%"}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </table>
                </div>
            </>
        );
    }
}

export default CoronaTable;
