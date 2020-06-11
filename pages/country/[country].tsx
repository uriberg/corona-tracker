import React, {Component} from 'react';
import axios from "axios";
import dateformat from "dateformat";
import {Countries} from "../../constants/corona-table";
import {lineGraphSettings} from "../../constants/barChart";
import MyResponsiveBar from '../../components/barChart';
import  MyResponsiveLine from '../../components/lineChart';
import { NextPageContext } from 'next';

interface CountryProps {
    // Add your regular properties here
    country: string,
    data: any
}

class Country extends Component<CountryProps> {
    static async getInitialProps({query}: NextPageContext) {
        console.log(query.country);
        // @ts-ignore
        const res = await axios.get("https://api.covid19api.com/total/dayone/country/" + Countries[query.country].value);
        console.log(res);
        return {country: query.country, data: res.data};
    }

    state = {
        dailyCases: [],
        activeCases: [],
        firstCase: "",
        totalCases: "",
        totalDeaths: "",
        totalRecovered: "",
        currentlyInfected: 0,
        deathsPerOneMillion: "",
        testsPerOneMillion: "",
        criticalCondition: "",
        activeCasesChange: "",
        worseActiveCasesDate: "",
        worseActiveCasesNumber: 0,
        worseNewCasesDate: "",
        worseNewCasesNumber: 0,
        worseNewDeathsDate: "",
        worseNewDeathsNumber: 0,
        lastSevenDaysNewCases: 0,
        lastSevenDaysNewDeaths: 0,
        todayCases: 0,
        todayDeaths: 0,
        showGraphs: false
    };

    componentDidMount(): void {
        console.log(this.props.country);
        console.log(Countries[this.props.country].value);
        console.log(this.props.data);

                let data = this.props.data;
                let temp = [];
                let activeTemp= [ {
                    id: "ActiveCases",
                    color: "hsl(308, 70%, 50%)",
                    data: []
                }];

                let firstDate = dateformat(data[0].Date, "mmm dS");
                console.log(firstDate);
                let worseActiveCasesNumber = data[0].Active;
                let worseActiveCasesDate = firstDate;
                let worseNewCasesNumber = data[0].Confirmed;
                let worseNewCasesDate = firstDate;
                let worseNewDeathsNumber = data[0].Deaths;
                let worseNewDeathsDate = firstDate;
                const firstDayObject = {
                    x: 0,
                    y: data[0].Confirmed,
                    Date: firstDate,
                    Cases: data[0].Confirmed,
                    Deaths: data[0].Deaths,
                    ActiveCases: data[0].Active
                };

                const activeFirstObject = {
                    x: firstDate,
                    y: data[0].Active
                };
                console.log(worseNewCasesNumber);
                temp.push(firstDayObject);
                activeTemp[0].data.push(activeFirstObject);
                for (let i = 1; i < data.length; i++) {

                    let activeDaily = {
                        x: dateformat(data[i].Date, "mmm dS"),
                        y: data[i].Active
                    };

                    let daily = {
                        x: i,
                        y: data[i].Confirmed - data[i - 1].Confirmed,
                        Date: dateformat(data[i].Date, "mmm dS"),
                        Cases: data[i].Confirmed - data[i - 1].Confirmed,
                        Deaths: data[i].Deaths - data[i - 1].Deaths,
                        ActiveCases: data[i].Active,
                    };
                    if (daily.ActiveCases > worseActiveCasesNumber) {
                        worseActiveCasesNumber = daily.ActiveCases;
                        worseActiveCasesDate = dateformat(data[i].Date, "mmm dS");
                    }
                    if (daily.Cases > worseNewCasesNumber) {
                        worseNewCasesNumber = daily.Cases;
                        worseNewCasesDate = dateformat(data[i].Date, "mmm dS");
                    }
                    if (daily.Deaths > worseNewDeathsNumber) {
                        worseNewDeathsNumber = daily.Deaths;
                        worseNewDeathsDate = dateformat(data[i].Date, "mmm dS");
                    }
                    temp.push(daily);
                    activeTemp[0].data.push(activeDaily);
                }

                let lastSevenDaysNewCases = 0;
                let lastSevenDaysNewDeaths = 0;
                for (let i = temp.length - 1, j = 0; j < 7; i--, j++) {
                    lastSevenDaysNewCases += temp[i].Cases;
                    lastSevenDaysNewDeaths += temp[i].Deaths;
                }
                console.log((lastSevenDaysNewCases / 7).toFixed(2));
                console.log((lastSevenDaysNewDeaths / 7).toFixed(2));
                console.log(worseNewDeathsNumber);
                console.log(worseNewCasesNumber);
                console.log(temp);
                this.setState({
                    dailyCases: temp,
                    activeCases: activeTemp,
                    firstCase: firstDayObject.Date,
                    worseActiveCasesNumber: worseActiveCasesNumber,
                    worseActiveCasesDate: worseActiveCasesDate,
                    worseNewCasesNumber: worseNewCasesNumber,
                    worseNewCasesDate: worseNewCasesDate,
                    worseNewDeathsNumber: worseNewDeathsNumber,
                    worseNewDeathsDate: worseNewDeathsDate,
                    lastSevenDaysNewCases: lastSevenDaysNewCases,
                    lastSevenDaysNewDeaths: lastSevenDaysNewDeaths
                });

        axios.get("https://disease.sh/v2/countries/" + this.props.country + "?yesterday=false")
            .then(response => {
                console.log(response.data);
                this.setState({
                    totalCases: response.data.cases,
                    totalDeaths: response.data.deaths,
                    totalRecovered: response.data.recovered,
                    currentlyInfected: response.data.active,
                    deathsPerOneMillion: response.data.deathsPerOneMillion,
                    testsPerOneMillion: response.data.testsPerOneMillion,
                    criticalCondition: response.data.critical,
                    todayCases: response.data.todayCases,
                    todayDeaths: response.data.todayDeaths
                });
                this.getYesterdayStats();
            })
            .catch(err => {
                console.log(err)
            });
    }

    getYesterdayStats = () => {
        axios.get("https://disease.sh/v2/countries/" + this.props.country + "?yesterday=true")
            .then(response => {
                console.log(response.data);
                console.log('before for loop');
                console.log(this.state.currentlyInfected);
                let activeCasesChange = +(this.state.currentlyInfected / response.data.active * 100 - 100).toFixed(2);
                console.log(activeCasesChange);
                this.setState({activeCasesChange: activeCasesChange});
                console.log(this.state);
                if (this.state.currentlyInfected > this.state.worseActiveCasesNumber || response.data.active > this.state.worseActiveCasesNumber) {
                    if (activeCasesChange > 0) {
                        this.setState({
                            worseActiveCasesDate: "Today",
                            worseActiveCasesNumber: this.state.currentlyInfected
                        });
                    } else {
                        this.setState({
                            worseActiveCasesDate: "Yesterday",
                            worseActiveCasesNumber: response.data.active
                        });
                    }
                }

                if (this.state.todayCases > this.state.worseNewCasesNumber || response.data.todayCases > this.state.worseNewCasesNumber) {
                    if (this.state.todayCases > response.data.todayCases) {
                        this.setState({
                            worseNewCasesDate: "Today",
                            worseNewCasesNumber: this.state.todayCases
                        });
                    } else {
                        this.setState({
                            worseNewCasesDate: "Yesterday",
                            worseNewCasesNumber: response.data.todayCases
                        });
                    }
                }

                if (this.state.todayDeaths > this.state.worseNewDeathsNumber || response.data.todayDeaths > this.state.worseNewDeathsNumber) {
                    if (activeCasesChange > 0) {
                        this.setState({
                            worseNewDeathsDate: "Today",
                            worseNewDeathsNumber: this.state.todayDeaths
                        });
                    } else {
                        this.setState({
                            worseNewDeathsDate: "Yesterday",
                            worseNewDeathsNumber: response.data.todayDeaths
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err)
            });
    };

    showGraphs = () => {
        //this.setState({showGraphs: true});
        //document.findElementById("test1").scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelector("#test1").scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    render() {
        return (
            <div className="country">
                <div className="country__name">{this.props.country}</div>
                <div className="country__cards">
                    <picture>
                        <source data-srcSet="../img/engin-akyurt-KtYvqysesC4-unsplash_1.webp" media="(min-width: 900px)" type="image/webp" />
                        <source data-srcSet="../img/isaac-quesada-U0apbBgkOeQ-unsplash.webp" media="(max-width: 900px)" type="image/webp" />
                        <img    data-src="../img/engin-akyurt-KtYvqysesC4-unsplash_1-small.webp" alt="background" className="lazyload blur"/>
                    </picture>
                    {/*<img src="../img/engin-akyurt-KtYvqysesC4-unsplash_1.webp" alt="hapoel"/>*/}
                    <div className="card card--general">
                        <h3 className="card__title">General</h3>
                        <ul className="card__list">
                            <li className="card__item">First Case: <span>{this.state.firstCase}</span></li>
                            <li className="card__item">Total Cases: <span>{this.state.totalCases}</span></li>
                            <li className="card__item">Total Deaths: <span>{this.state.totalDeaths}</span></li>
                            <li className="card__item">Total Recovered: <span>{this.state.totalRecovered}</span>
                            </li>
                            {/*<li className="card__item">Currently*/}
                            {/*    Infected: <span>{this.state.currentlyInfected}</span></li>*/}
                            <li className="card__item">Deaths Per 1
                                Million: <span>{this.state.deathsPerOneMillion}</span></li>
                            <li className="card__item">Tests Per 1
                                Million: <span>{this.state.testsPerOneMillion}</span></li>
                        </ul>
                    </div>
                    <div className="card card--new-cases">
                        <h3 className="card__title">New Cases</h3>
                        <ul className="card__list">
                            <li className="card__item">Worse Day: <span>{this.state.worseNewCasesDate}</span></li>
                            <li className="card__item">Today: <span>{this.state.todayCases}</span></li>
                            <li className="card__item">Last 7 days: <span>{this.state.lastSevenDaysNewCases}</span></li>
                            <li className="card__item">Last 7 days
                                Average: <span>{(this.state.lastSevenDaysNewCases / 7).toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="card card--active-cases">
                        <h3 className="card__title">Active Cases</h3>
                        <ul className="card__list">
                            <li className="card__item">Worse Day: <span>{this.state.worseActiveCasesDate}</span></li>
                            <li className="card__item">Currently Infected: <span>{this.state.currentlyInfected}</span>
                            </li>
                            <li className="card__item">Critical Condition: <span>{this.state.criticalCondition}</span>
                            </li>
                            <li className="card__item">Change from
                                yesterday: <span>{this.state.activeCasesChange}%</span></li>
                        </ul>
                    </div>
                    <div className="card card--deaths">
                        <h3 className="card__title">Deaths</h3>
                        <ul className="card__list">
                            <li className="card__item">Worse Day: <span>{this.state.worseNewDeathsDate}</span></li>
                            <li className="card__item">Today: <span>{this.state.todayDeaths}</span></li>
                            <li className="card__item">Last 7 days: <span>{this.state.lastSevenDaysNewDeaths}</span>
                            </li>
                            <li className="card__item">Last 7 days
                                average: <span>{(this.state.lastSevenDaysNewDeaths / 7).toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                </div>


                <div id="section03" className="demo">
                    <a onClick={this.showGraphs}><span></span>Show Graphs</a>
                </div>
                    <div id="test1" className="graphs">

                        <div className="barChart country__graph">
                            <MyResponsiveBar data={this.state.dailyCases} theme={lineGraphSettings.theme}
                                             keys={'Cases'} AxisLeftLegend={'Daily cases'}/>
                        </div>

                        <div className="barChart country__graph">
                            <MyResponsiveBar data={this.state.dailyCases} theme={lineGraphSettings.theme}
                                             keys={'Deaths'} AxisLeftLegend={'Daily deaths'}/>
                        </div>

                        {/*<div className="barChart country__graph">*/}
                        {/*    <MyResponsiveBar data={this.state.dailyCases} theme={lineGraphSettings.theme}*/}
                        {/*                     keys={'ActiveCases'} AxisLeftLegend={'Currently Infected'}/>*/}
                        {/*</div>*/}

                        <div className="barChart country__graph">
                            <MyResponsiveLine data={this.state.activeCases} theme={lineGraphSettings.theme}/>
                        </div>

                    </div>
            </div>
        );
    }
}

export default Country;



