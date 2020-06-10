import React, {Component} from 'react';
import CoronaTable from "../../components/CoronaTable";
import {Continents} from "../../constants/corona-table";
import { NextPageContext } from 'next';


interface ContinentProps  {
    continent: string
}

class Continent extends Component<ContinentProps> {
    static async getInitialProps({query}: NextPageContext) {
        console.log(query.continent);
        return {continent: query.continent};
    }

    render() {
        return (
               <CoronaTable filter={true} continent={Continents[this.props.continent]}/>
        );
    }
}

export default Continent;



